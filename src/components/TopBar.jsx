import { BRAND, T } from '../config'
import { StarIcon, PhoneIcon } from './Icons'

export default function TopBar({ status }) {
  const online = status !== 'idle'
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <StarIcon width={20} height={20} />
        </span>
        <span className="brand-text">
          <span className="brand-name">{BRAND.name}</span>
          <span className="brand-tagline">{BRAND.tagline}</span>
        </span>
      </div>

      <div className="topbar-right">
        <span className="phone-chip">
          <PhoneIcon width={14} height={14} />
          {BRAND.phone}
        </span>
        <span className={`status-pill ${online ? 'is-live' : ''}`}>
          <span className="status-dot" aria-hidden="true" />
          {online ? T.agentOnCall : T.agentAvailable}
        </span>
      </div>
    </header>
  )
}
