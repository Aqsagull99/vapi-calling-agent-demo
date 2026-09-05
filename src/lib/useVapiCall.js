import { useCallback, useEffect, useRef, useState } from 'react'
import VapiSDK from '@vapi-ai/web'
import { VAPI_ASSISTANT_ID, VAPI_PUBLIC_KEY, IS_CONFIGURED } from '../config'
import { EMPTY_APPOINTMENT, applyToolCall } from './appointment'
import { loadHistory, saveHistory } from './history'

// @vapi-ai/web ships CommonJS (`module.exports = { default: Vapi }`). Bundlers
// disagree on whether a default import unwraps that, so normalize it here —
// Vite 8 hands over the wrapper object and `new Vapi()` throws without this.
const Vapi = VapiSDK?.default ?? VapiSDK

export const CALL_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  ENDING: 'ending',
}

const FLASH_MS = 1400

const GENERIC_ERROR =
  'The call could not be connected. Check the assistant ID and your microphone permissions.'

/**
 * Daily (Vapi's WebRTC transport) reports errors as nested plain objects, and
 * the SDK's own serializer can leave `message` holding an *object* rather than
 * a string — `{ type, msg, details }` is the shape it hands over. Rendering
 * that directly crashes React, so dig for the first real string and never
 * return anything else.
 */
function readableError(err, depth = 0) {
  if (err === null || err === undefined) return GENERIC_ERROR
  if (typeof err === 'string') return err.trim() || GENERIC_ERROR
  if (typeof err !== 'object' || depth > 3) return GENERIC_ERROR

  const candidates = [err.msg, err.errorMsg, err.message, err.error, err.errorDetail, err.details]

  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim()
  }
  for (const c of candidates) {
    if (c && typeof c === 'object') {
      const nested = readableError(c, depth + 1)
      if (nested !== GENERIC_ERROR) return nested
    }
  }
  return GENERIC_ERROR
}

/**
 * Daily fires an `error` on a perfectly normal hang-up. Surfacing a red banner
 * every time the presenter ends a call would be worse than useless.
 */
function isBenignEndOfCall(text) {
  return /meeting (has )?ended|left the meeting|ejected|call ended/i.test(text)
}

/**
 * Owns the Vapi client and every piece of live call state the UI renders.
 * One hook so the components stay presentational.
 */
export function useVapiCall() {
  const [status, setStatus] = useState(CALL_STATUS.IDLE)
  const [turns, setTurns] = useState([])
  const [liveTurn, setLiveTurn] = useState(null)
  const [agentSpeaking, setAgentSpeaking] = useState(false)
  const [agentVolume, setAgentVolume] = useState(0)
  const [micVolume, setMicVolume] = useState(0)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [appointment, setAppointment] = useState(EMPTY_APPOINTMENT)
  const [flashFields, setFlashFields] = useState([])
  const [history, setHistory] = useState(() => loadHistory())

  const vapiRef = useRef(null)
  const startedAtRef = useRef(null)
  const appointmentRef = useRef(EMPTY_APPOINTMENT)
  const turnsRef = useRef([])
  const flashTimer = useRef(null)

  useEffect(() => { appointmentRef.current = appointment }, [appointment])
  useEffect(() => { turnsRef.current = turns }, [turns])
  useEffect(() => { saveHistory(history) }, [history])

  // ---- client lifecycle -----------------------------------------------
  useEffect(() => {
    if (!IS_CONFIGURED) return undefined

    const vapi = new Vapi(VAPI_PUBLIC_KEY)
    vapiRef.current = vapi

    const onCallStart = () => {
      startedAtRef.current = Date.now()
      setElapsed(0)
      setStatus(CALL_STATUS.ACTIVE)
      setError(null)
    }

    const onCallEnd = () => {
      const startedAt = startedAtRef.current
      const seconds = startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0
      const booking = appointmentRef.current

      if (startedAt && seconds > 0) {
        const entry = {
          id: `${startedAt}`,
          startedAt,
          seconds,
          turns: turnsRef.current.length,
          outcome: booking.status === 'confirmed' ? 'booked' : 'no-booking',
          patient: booking.patient,
          service: booking.service,
          slot: [booking.date, booking.time].filter(Boolean).join(' · '),
        }
        setHistory((prev) => [entry, ...prev].slice(0, 12))
      }

      startedAtRef.current = null
      setStatus(CALL_STATUS.IDLE)
      setLiveTurn(null)
      setAgentSpeaking(false)
      setAgentVolume(0)
      setMicVolume(0)
      setMuted(false)
    }

    const onMessage = (message) => {
      if (message?.type === 'transcript') {
        const text = (message.transcript ?? '').trim()
        if (!text) return
        if (message.transcriptType === 'partial') {
          setLiveTurn({ role: message.role, text })
          return
        }
        setLiveTurn((live) => (live?.role === message.role ? null : live))
        setTurns((prev) => [
          ...prev,
          { id: `${Date.now()}-${prev.length}`, role: message.role, text, at: Date.now() },
        ])
        return
      }

      if (message?.type === 'tool-calls' || message?.type === 'function-call') {
        const { appointment: next, changed } = applyToolCall(appointmentRef.current, message)
        if (!changed.length) return
        appointmentRef.current = next
        setAppointment(next)
        setFlashFields(changed)
        clearTimeout(flashTimer.current)
        flashTimer.current = setTimeout(() => setFlashFields([]), FLASH_MS)
      }
    }

    const onSpeechStart = () => setAgentSpeaking(true)
    const onSpeechEnd = () => setAgentSpeaking(false)
    const onError = (err) => {
      console.error('[Vapi error]', err)
      const text = readableError(err)
      startedAtRef.current = null
      setStatus(CALL_STATUS.IDLE)
      if (!isBenignEndOfCall(text)) setError(text)
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('volume-level', setAgentVolume)
    vapi.on('local-volume-level', setMicVolume)
    vapi.on('error', onError)
    vapi.on('call-start-failed', onError)

    return () => {
      clearTimeout(flashTimer.current)
      vapi.removeAllListeners()
      // stop() is async and rejects if the transport is already gone (React
      // StrictMode remounts, hot reload); a teardown must never throw.
      Promise.resolve(vapi.stop()).catch(() => {})
      vapiRef.current = null
    }
  }, [])

  // ---- call timer ------------------------------------------------------
  useEffect(() => {
    if (status !== CALL_STATUS.ACTIVE) return undefined
    const id = setInterval(() => {
      if (startedAtRef.current) {
        setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
      }
    }, 500)
    return () => clearInterval(id)
  }, [status])

  // ---- actions ---------------------------------------------------------
  const startCall = useCallback(async () => {
    if (!vapiRef.current || status !== CALL_STATUS.IDLE) return
    setError(null)
    setTurns([])
    setLiveTurn(null)
    setAppointment(EMPTY_APPOINTMENT)
    appointmentRef.current = EMPTY_APPOINTMENT
    setFlashFields([])
    setStatus(CALL_STATUS.CONNECTING)
    try {
      await vapiRef.current.start(VAPI_ASSISTANT_ID)
    } catch (err) {
      setError(readableError(err))
      setStatus(CALL_STATUS.IDLE)
    }
  }, [status])

  const endCall = useCallback(() => {
    if (!vapiRef.current) return
    setStatus(CALL_STATUS.ENDING)
    Promise.resolve(vapiRef.current.stop()).catch(() => {
      setStatus(CALL_STATUS.IDLE)
    })
  }, [])

  const toggleMute = useCallback(() => {
    const vapi = vapiRef.current
    if (!vapi) return
    const next = !vapi.isMuted()
    vapi.setMuted(next)
    setMuted(next)
  }, [])

  const clearLog = useCallback(() => setHistory([]), [])

  const isLive = status === CALL_STATUS.ACTIVE || status === CALL_STATUS.CONNECTING

  return {
    status,
    isLive,
    turns,
    liveTurn,
    agentSpeaking,
    agentVolume,
    micVolume,
    muted,
    error,
    elapsed,
    appointment,
    flashFields,
    history,
    startCall,
    endCall,
    toggleMute,
    clearLog,
    dismissError: () => setError(null),
  }
}
