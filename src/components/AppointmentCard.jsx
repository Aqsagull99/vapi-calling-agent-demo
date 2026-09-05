import { CheckIcon, CalendarIcon } from './Icons'

const FIELDS = [
  { key: 'patient', label: 'Patient', placeholder: 'Awaiting name' },
  { key: 'phone', label: 'Callback', placeholder: 'Awaiting number' },
  { key: 'service', label: 'Reason for visit', placeholder: 'Awaiting reason' },
  { key: 'date', label: 'Date', placeholder: 'Not set' },
  { key: 'time', label: 'Time', placeholder: 'Not set' },
  { key: 'insurance', label: 'Insurance', placeholder: 'Not provided' },
  { key: 'newPatient', label: 'Patient type', placeholder: 'Unknown' },
]

const STATUS_COPY = {
  idle: { label: 'Awaiting call', className: '' },
  collecting: { label: 'Collecting details', className: 'is-collecting' },
  confirmed: { label: 'Confirmed', className: 'is-confirmed' },
}

export default function AppointmentCard({ appointment, flashFields }) {
  const meta = STATUS_COPY[appointment.status] ?? STATUS_COPY.idle
  const confirmed = appointment.status === 'confirmed'

  return (
    <section className={`panel appointment-card ${confirmed ? 'is-confirmed' : ''}`}>
      <header className="panel-head">
        <h3>
          <CalendarIcon width={15} height={15} />
          Appointment
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
            <strong>Booked &amp; written to the schedule</strong>
            <span>Confirmation {appointment.confirmation}</span>
          </div>
        </div>
      )}
    </section>
  )
}
