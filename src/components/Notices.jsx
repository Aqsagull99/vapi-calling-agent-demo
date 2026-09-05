import { AlertIcon } from './Icons'

export function SetupNotice() {
  return (
    <div className="notice notice-setup">
      <AlertIcon width={17} height={17} />
      <div>
        <strong>Add your Vapi credentials to go live.</strong>
        <span>
          Put <code>VITE_VAPI_PUBLIC_KEY</code> and <code>VITE_VAPI_ASSISTANT_ID</code> in{' '}
          <code>.env.local</code>, then restart <code>npm run dev</code>. See{' '}
          <code>VAPI_SETUP.md</code>.
        </span>
      </div>
    </div>
  )
}

export function ErrorNotice({ message, onDismiss }) {
  // Belt and braces: never let a non-string reach React and blank the page.
  const text = typeof message === 'string' ? message : 'An unexpected error occurred.'
  return (
    <div className="notice notice-error" role="alert">
      <AlertIcon width={17} height={17} />
      <div>
        <strong>Call could not connect</strong>
        <span>{text}</span>
      </div>
      <button className="link-btn" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  )
}

export function InsecureOriginNotice() {
  return (
    <div className="notice notice-setup">
      <AlertIcon width={17} height={17} />
      <div>
        <strong>The microphone is blocked on this address.</strong>
        <span>
          You opened <code>{window.location.origin}</code>. Browsers only allow microphone
          access on <code>https://</code> or <code>localhost</code>, and they fail silently —
          the agent will greet you and then hear nothing. Open{' '}
          <code>http://localhost:5173</code> instead.
        </span>
      </div>
    </div>
  )
}
