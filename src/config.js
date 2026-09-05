/**
 * Everything client-facing lives here. Swap these five values and the demo
 * re-brands for a different vertical without touching a component.
 */
export const BRAND = {
  name: 'Northstar Dental Studio',
  tagline: 'Family & Cosmetic Dentistry · Austin, TX',
  agentName: 'Aria',
  agentRole: 'AI Front Desk Coordinator',
  phone: '(512) 555-0142',
}

export const HERO = {
  eyebrow: 'Live demo',
  title: 'Every call answered. Every appointment booked.',
  subtitle:
    'Aria picks up on the first ring, qualifies the caller, and writes the appointment straight into the schedule — day or night.',
  stats: [
    { value: '0.7s', label: 'Average pickup' },
    { value: '24/7', label: 'Always staffed' },
    { value: '100%', label: 'Calls answered' },
  ],
}

/** Prompt chips shown under the call button, to give the presenter a script. */
export const SUGGESTIONS = [
  'Hi, I’d like to book a cleaning',
  'Do you take Delta Dental?',
  'Can I get in on Thursday afternoon?',
]

/**
 * Trimmed on purpose. A stray space pasted into a hosting provider's
 * environment-variable field becomes `Bearer  <key>` in the auth header, and
 * Vapi answers `400 failed to extract key` — which surfaces in the browser as
 * an unhelpful "Failed to fetch". Cost an afternoon once; never again.
 */
export const VAPI_PUBLIC_KEY = (import.meta.env.VITE_VAPI_PUBLIC_KEY ?? '').trim()
export const VAPI_ASSISTANT_ID = (import.meta.env.VITE_VAPI_ASSISTANT_ID ?? '').trim()
export const IS_CONFIGURED = Boolean(VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID)
