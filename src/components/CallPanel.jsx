import { BRAND, SUGGESTIONS } from '../config'
import { CALL_STATUS } from '../lib/useVapiCall'
import { formatDuration } from '../lib/history'
import { PhoneIcon, HangUpIcon, MicIcon, MicOffIcon, StarIcon } from './Icons'
import MicCheck from './MicCheck'

const BAR_COUNT = 14

function statusLabel(status, agentSpeaking) {
  switch (status) {
    case CALL_STATUS.CONNECTING:
      return 'Connecting…'
    case CALL_STATUS.ENDING:
      return 'Wrapping up…'
    case CALL_STATUS.ACTIVE:
      return agentSpeaking ? `${BRAND.agentName} is speaking` : 'Listening…'
    default:
      return 'Ready to take your call'
  }
}

export default function CallPanel({
  status,
  agentSpeaking,
  agentVolume,
  micVolume,
  muted,
  elapsed,
  onStart,
  onEnd,
  onToggleMute,
  disabled,
}) {
  const idle = status === CALL_STATUS.IDLE
  const active = status === CALL_STATUS.ACTIVE
  const connecting = status === CALL_STATUS.CONNECTING

  const orbClass = [
    'orb',
    connecting && 'is-connecting',
    active && 'is-active',
    agentSpeaking && 'is-speaking',
  ]
    .filter(Boolean)
    .join(' ')

  const litBars = Math.round(Math.min(1, micVolume * 2.2) * BAR_COUNT)

  return (
    <section className="panel call-panel">
      <div className={orbClass} style={{ '--level': agentVolume.toFixed(3) }}>
        <span className="orb-ring orb-ring-1" aria-hidden="true" />
        <span className="orb-ring orb-ring-2" aria-hidden="true" />
        <span className="orb-core" aria-hidden="true">
          <StarIcon width={30} height={30} />
        </span>
      </div>

      <div className="agent-id">
        <h2>{BRAND.agentName}</h2>
        <p>{BRAND.agentRole}</p>
      </div>

      <p className="call-status" aria-live="polite">
        {statusLabel(status, agentSpeaking)}
      </p>

      <div className={`call-timer ${active || connecting ? 'is-visible' : ''}`}>
        {formatDuration(elapsed)}
      </div>

      <div className="call-actions">
        {idle ? (
          <button className="btn btn-call" onClick={onStart} disabled={disabled}>
            <PhoneIcon width={19} height={19} />
            Talk to {BRAND.agentName}
          </button>
        ) : (
          <button
            className="btn btn-hangup"
            onClick={onEnd}
            disabled={status === CALL_STATUS.ENDING}
          >
            <HangUpIcon width={19} height={19} />
            End call
          </button>
        )}

        <button
          className={`btn btn-ghost btn-mute ${muted ? 'is-muted' : ''}`}
          onClick={onToggleMute}
          disabled={!active}
          aria-pressed={muted}
          title={muted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {muted ? <MicOffIcon width={17} height={17} /> : <MicIcon width={17} height={17} />}
          {muted ? 'Muted' : 'Mute'}
        </button>
      </div>

      <div className={`mic-meter ${active ? 'is-visible' : ''}`} aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span key={i} className={i < litBars && !muted ? 'is-lit' : ''} />
        ))}
      </div>

      {idle && <MicCheck />}

      {idle && (
        <div className="suggestions">
          <span className="suggestions-label">Try saying</span>
          {SUGGESTIONS.map((line) => (
            <span key={line} className="suggestion">“{line}”</span>
          ))}
        </div>
      )}
    </section>
  )
}
