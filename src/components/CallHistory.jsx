import { formatClock, formatDuration } from '../lib/history'
import { CheckIcon, PhoneIcon, TrashIcon } from './Icons'

export default function CallHistory({ history, onClear }) {
  return (
    <section className="panel history-panel">
      <header className="panel-head">
        <h3>Recent calls</h3>
        {history.length > 0 && (
          <button className="link-btn" onClick={onClear} title="Clear the demo log">
            <TrashIcon width={13} height={13} />
            Clear
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <p className="history-empty">No calls yet. Completed calls are logged here.</p>
      ) : (
        <ul className="history-list">
          {history.map((entry) => {
            const booked = entry.outcome === 'booked'
            return (
              <li key={entry.id} className={booked ? 'is-booked' : ''}>
                <span className="history-icon" aria-hidden="true">
                  {booked ? <CheckIcon width={13} height={13} /> : <PhoneIcon width={13} height={13} />}
                </span>
                <div className="history-body">
                  <span className="history-title">
                    {entry.patient || 'Unidentified caller'}
                    {entry.service ? ` · ${entry.service}` : ''}
                  </span>
                  <span className="history-sub">
                    {formatClock(entry.startedAt)} · {formatDuration(entry.seconds)} ·{' '}
                    {booked ? entry.slot || 'Booked' : 'No booking'}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
