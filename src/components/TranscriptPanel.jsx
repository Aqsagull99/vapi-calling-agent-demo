import { useEffect, useRef } from 'react'
import { BRAND } from '../config'
import { CALL_STATUS } from '../lib/useVapiCall'
import { WaveIcon } from './Icons'

function Bubble({ role, text, live }) {
  const isAgent = role === 'assistant'
  return (
    <li className={`turn ${isAgent ? 'from-agent' : 'from-caller'} ${live ? 'is-live' : ''}`}>
      <span className="turn-avatar" aria-hidden="true">
        {isAgent ? '✦' : 'You'}
      </span>
      <div className="turn-body">
        <span className="turn-who">{isAgent ? BRAND.agentName : 'Caller'}</span>
        <p className="turn-text">
          {text}
          {live && <span className="caret" aria-hidden="true" />}
        </p>
      </div>
    </li>
  )
}

export default function TranscriptPanel({ turns, liveTurn, status }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns, liveTurn])

  const empty = turns.length === 0 && !liveTurn
  const live = status === CALL_STATUS.ACTIVE

  return (
    <section className="panel transcript-panel">
      <header className="panel-head">
        <h3>Live transcript</h3>
        <span className={`live-tag ${live ? 'is-live' : ''}`}>
          <span className="live-dot" aria-hidden="true" />
          {live ? 'Live' : 'Idle'}
        </span>
      </header>

      <div className="transcript-scroll" ref={scrollRef} aria-live="polite" aria-atomic="false">
        {empty ? (
          <div className="transcript-empty">
            <WaveIcon width={26} height={26} />
            <p>The conversation appears here, word by word, as it happens.</p>
            <span>Press “Talk to {BRAND.agentName}” to begin.</span>
          </div>
        ) : (
          <ul className="turns">
            {turns.map((turn) => (
              <Bubble key={turn.id} role={turn.role} text={turn.text} />
            ))}
            {liveTurn && <Bubble role={liveTurn.role} text={liveTurn.text} live />}
          </ul>
        )}
      </div>

      <footer className="panel-foot">
        <span>{turns.length} turns</span>
        <span className="dot-sep" aria-hidden="true">•</span>
        <span>Transcribed in real time by Deepgram via Vapi</span>
      </footer>
    </section>
  )
}
