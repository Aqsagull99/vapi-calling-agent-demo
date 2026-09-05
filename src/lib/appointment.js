/**
 * Turns Vapi `tool-calls` client messages into the booking card's state.
 *
 * The assistant's tools are declared `async: true` in the Vapi dashboard, so
 * Vapi fires them at the browser and lets the conversation continue instead of
 * waiting on a server for a result. That is what lets the card fill in live
 * with no backend of our own.
 */

export const EMPTY_APPOINTMENT = {
  status: 'idle', // idle → collecting → confirmed
  patient: '',
  phone: '',
  service: '',
  date: '',
  time: '',
  insurance: '',
  newPatient: '',
  notes: '',
  confirmation: '',
}

/** Tool argument names we accept, in every casing an LLM realistically emits. */
const FIELD_ALIASES = {
  patient: ['patient', 'name', 'fullname', 'full_name', 'patientname', 'patient_name', 'caller', 'callername'],
  phone: ['phone', 'phonenumber', 'phone_number', 'callback', 'callbacknumber', 'contact'],
  service: ['service', 'reason', 'appointmenttype', 'appointment_type', 'treatment', 'visittype', 'visit_type'],
  date: ['date', 'preferreddate', 'preferred_date', 'appointmentdate', 'appointment_date', 'day'],
  time: ['time', 'preferredtime', 'preferred_time', 'appointmenttime', 'appointment_time', 'slot'],
  insurance: ['insurance', 'insuranceprovider', 'insurance_provider', 'payer', 'plan'],
  newPatient: ['newpatient', 'new_patient', 'isnewpatient', 'is_new_patient', 'firstvisit'],
  notes: ['notes', 'note', 'details', 'comments', 'additionalinfo', 'additional_info'],
  confirmation: ['confirmation', 'confirmationnumber', 'confirmation_number', 'confirmationcode', 'reference'],
}

const LOOKUP = Object.entries(FIELD_ALIASES).reduce((acc, [field, aliases]) => {
  aliases.forEach((alias) => { acc[alias] = field })
  return acc
}, {})

const CONFIRM_TOOLS = ['book', 'confirm', 'schedule', 'create']

const normalizeKey = (key) => String(key).toLowerCase().replace(/[\s_-]/g, '')

function normalizeValue(field, value) {
  if (value === null || value === undefined || value === '') return ''
  if (field === 'newPatient') {
    if (typeof value === 'boolean') return value ? 'New patient' : 'Returning patient'
    const v = String(value).toLowerCase()
    if (['true', 'yes', 'y', 'new'].includes(v)) return 'New patient'
    if (['false', 'no', 'n', 'returning', 'existing'].includes(v)) return 'Returning patient'
  }
  return String(value).trim()
}

/** Vapi sends arguments as a JSON string, but tolerate an object too. */
function parseArguments(fn) {
  const raw = fn?.arguments
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function makeConfirmationCode() {
  return `NS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

/**
 * @param {object} current  previous appointment state
 * @param {object} message  a Vapi client message of type 'tool-calls' | 'function-call'
 * @returns {{ appointment: object, changed: string[] }}
 */
export function applyToolCall(current, message) {
  const calls =
    message?.toolCallList ??
    message?.toolCalls ??
    (message?.functionCall ? [{ function: message.functionCall }] : [])

  let next = { ...current }
  const changed = []

  for (const call of calls) {
    const fn = call?.function ?? call
    const toolName = String(fn?.name ?? '').toLowerCase()
    const args = parseArguments(fn)

    for (const [key, value] of Object.entries(args)) {
      const field = LOOKUP[normalizeKey(key)]
      if (!field) continue
      const clean = normalizeValue(field, value)
      if (!clean || clean === next[field]) continue
      next[field] = clean
      changed.push(field)
    }

    if (next.status === 'idle' && changed.length) next.status = 'collecting'

    if (CONFIRM_TOOLS.some((word) => toolName.includes(word))) {
      next.status = 'confirmed'
      if (!next.confirmation) {
        next.confirmation = makeConfirmationCode()
        changed.push('confirmation')
      }
      changed.push('status')
    }
  }

  return { appointment: next, changed }
}

export const isBooked = (appointment) => appointment.status === 'confirmed'
