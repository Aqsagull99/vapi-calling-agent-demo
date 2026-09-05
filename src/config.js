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

export const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY ?? ''
export const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID ?? ''
export const IS_CONFIGURED = Boolean(VAPI_PUBLIC_KEY && VAPI_ASSISTANT_ID)
