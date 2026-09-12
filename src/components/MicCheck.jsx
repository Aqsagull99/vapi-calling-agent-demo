import { useEffect, useRef, useState } from 'react'
import { T } from '../config'
import { MicIcon, AlertIcon, CheckIcon } from './Icons'

const TEST_MS = 7000
const SPEECH_THRESHOLD = 0.02 // RMS above this means the mic genuinely heard something

/**
 * Proves whether the browser can hear the user, independently of Vapi.
 * Worth its weight before a client demo: a silent mic looks identical to a
 * broken agent, and `getUserMedia` fails silently on a non-secure origin.
 */
export default function MicCheck() {
  const [state, setState] = useState('idle') // idle | testing | ok | silent | error
  const [level, setLevel] = useState(0)
  const [device, setDevice] = useState('')
  const [message, setMessage] = useState('')
  const [devices, setDevices] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const cleanup = useRef(null)

  // Labels only materialise once mic permission has been granted, so refresh
  // the list on mount and again after every successful test.
  const refreshDevices = async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices()
      setDevices(all.filter((d) => d.kind === 'audioinput' && d.deviceId))
    } catch {
      /* enumeration is a convenience, not a requirement */
    }
  }
  useEffect(() => {
    refreshDevices()
  }, [])

  const stop = () => {
    cleanup.current?.()
    cleanup.current = null
  }
  useEffect(() => stop, [])

  async function run() {
    stop()
    setState('testing')
    setLevel(0)
    setDevice('')
    setMessage('')

    if (!window.isSecureContext) {
      setState('error')
      setMessage(
        `This page is on ${window.location.origin}, which browsers treat as insecure — ` +
          'the microphone is blocked here. Open http://localhost:5173 instead, or deploy over HTTPS.',
      )
      return
    }

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      })
    } catch (err) {
      setState('error')
      const name = err?.name
      setMessage(
        name === 'NotAllowedError'
          ? 'Permission denied. Click the lock icon in the address bar → Microphone → Allow, then reload.'
          : name === 'NotFoundError'
            ? 'No microphone found. Check that one is plugged in and enabled in your OS sound settings.'
            : `${name ?? 'Error'}: ${err?.message ?? 'could not open the microphone.'}`,
      )
      return
    }

    try {
      const label = stream.getAudioTracks()[0]?.label
      if (label) setDevice(label)
    } catch {
      /* label is optional */
    }
    refreshDevices()

    const ctx = new (window.AudioContext ?? window.webkitAudioContext)()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    ctx.createMediaStreamSource(stream).connect(analyser)

    const data = new Uint8Array(analyser.fftSize)
    let raf
    let peak = 0

    const tick = () => {
      analyser.getByteTimeDomainData(data)
      let sum = 0
      for (const v of data) {
        const x = (v - 128) / 128
        sum += x * x
      }
      const rms = Math.sqrt(sum / data.length)
      peak = Math.max(peak, rms)
      setLevel(rms)
      raf = requestAnimationFrame(tick)
    }
    tick()

    const timer = setTimeout(() => {
      stop()
      setState(peak > SPEECH_THRESHOLD ? 'ok' : 'silent')
    }, TEST_MS)

    cleanup.current = () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      stream.getTracks().forEach((t) => t.stop())
      ctx.close().catch(() => {})
      setLevel(0)
    }
  }

  const pct = Math.min(100, Math.round(level * 320))

  return (
    <div className="mic-check">
      {devices.length > 1 && state !== 'testing' && (
        <label className="mic-picker">
          <span>{T.inputDevice}</span>
          <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
            <option value="">{T.systemDefault}</option>
            {devices.map((d, i) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Microphone ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
      )}

      {state === 'testing' ? (
        <>
          <div className="mic-check-bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="mic-check-hint">{T.micSaySomething}</p>
        </>
      ) : (
        <button className="btn btn-ghost mic-check-btn" onClick={run}>
          <MicIcon width={15} height={15} />
          {state === 'idle' ? T.testMic : T.testAgain}
        </button>
      )}

      {state === 'ok' && (
        <p className="mic-check-result is-ok">
          <CheckIcon width={13} height={13} />
          {T.micWorks}{device ? ` — ${device}` : ''}
        </p>
      )}
      {state === 'silent' && (
        <p className="mic-check-result is-warn">
          <AlertIcon width={13} height={13} />
          Heard nothing from <strong>{device || 'this device'}</strong>. Pick a different
          input above and test again. If every device stays flat, the microphone is muted
          or turned down in your OS sound settings.
        </p>
      )}
      {state === 'error' && (
        <p className="mic-check-result is-error">
          <AlertIcon width={13} height={13} />
          {message}
        </p>
      )}
    </div>
  )
}
