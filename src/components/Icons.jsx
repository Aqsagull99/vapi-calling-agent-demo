const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)

export const HangUpIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2.5 12.6a15 15 0 0 1 19 0" />
    <path d="M6.3 15.4 8 13.6a2 2 0 0 0 .4-2.2 9 9 0 0 1-.5-1.7" />
    <path d="M17.7 15.4 16 13.6a2 2 0 0 1-.4-2.2c.2-.5.4-1.1.5-1.7" />
    <path d="M8.4 15.4a2 2 0 0 1-.6 1.4l-1 1a2 2 0 0 1-2.9 0l-.8-.9" />
    <path d="M15.6 15.4c0 .5.2 1 .6 1.4l1 1a2 2 0 0 0 2.9 0l.8-.9" />
  </svg>
)

export const MicIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </svg>
)

export const MicOffIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M15 9V5a3 3 0 0 0-5.9-.8M9 9v2a3 3 0 0 0 4.6 2.5" />
    <path d="M5 11a7 7 0 0 0 10.6 6M19 11a7 7 0 0 1-.6 2.8M12 18v4" />
    <path d="m3 3 18 18" />
  </svg>
)

export const StarIcon = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 1.6 14 9l7.4 2-7.4 2-2 7.4-2-7.4L2.6 11 10 9Z" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m20 6-11 11-5-5" />
  </svg>
)

export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export const TrashIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />
  </svg>
)

export const AlertIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 2.7 19a1 1 0 0 0 .9 1.5h16.8a1 1 0 0 0 .9-1.5L12 3.5Z" />
    <path d="M12 9v5M12 17.5v.01" />
  </svg>
)

export const WaveIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 10v4M8 6v12M12 3v18M16 6v12M20 10v4" />
  </svg>
)
