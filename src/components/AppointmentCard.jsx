import { T } from '../config'
import { CheckIcon, CalendarIcon } from './Icons'

const FIELDS = ['patient', 'phone', 'service', 'date', 'time', 'insurance', 'newPatient'].map(
  (key) => ({ key, label: T.fields[key][0], placeholder: T.fields[key][1] }),
)

const STATUS_COPY = {
  idle: { label: T.awaitingCall, className: '' },
  collecting: { label: T.collecting, className: 'is-collecting' },
  confirmed: { label: T.confirmed, className: 'is-confirmed' },
}

export default function AppointmentCard({ appointment, flashFields }) {
  const meta = STATUS_COPY[appointment.status] ?? STATUS_COPY.idle
  const confirmed = appointment.status === 'confirmed'

  return (
    <section className={`panel appointment-card ${confirmed ? 'is-confirmed' : ''}`}>
      <header className="panel-head">
        <h3>
          <CalendarIcon width={15} height={15} />
          {T.appointment}
        </h3>
        <span className={`booking-status ${meta.className}`}>
          {confirmed && <CheckIcon width={13} height={13} />}
          {meta.label}
        </span>
      </header>

      <dl className="fields">
        {FIELDS.map((field) => {
          const value = appointment[field.key]
          return (
            <div
              key={field.key}
              className={`field ${value ? 'is-set' : ''} ${
                flashFields.includes(field.key) ? 'is-flash' : ''
              }`}
            >
              <dt>{field.label}</dt>
              <dd>{value || <span className="field-placeholder">{field.placeholder}</span>}</dd>
            </div>
          )
        })}
      </dl>

      {appointment.notes && <p className="field-notes">“{appointment.notes}”</p>}

      {confirmed && (
        <div className="confirmation">
          <CheckIcon width={16} height={16} />
          <div>
            <strong>{T.booked}</strong>
            <span>{T.confirmation} {appointment.confirmation}</span>
          </div>
        </div>
      )}
    </section>
  )
}
