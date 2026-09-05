import { Component } from 'react'
import { AlertIcon } from './Icons'

/**
 * A crash in front of a client should never be a black screen. This keeps the
 * branding on screen, says something calm, and offers a one-click recovery.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[Northstar demo] render crash:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="crash">
        <div className="crash-card">
          <AlertIcon width={22} height={22} />
          <h2>The demo hit an unexpected error</h2>
          <p>Reloading usually clears it. The details are in the browser console.</p>
          <pre>{String(this.state.error?.message ?? this.state.error)}</pre>
          <button className="btn btn-call" onClick={() => window.location.reload()}>
            Reload the demo
          </button>
        </div>
      </div>
    )
  }
}
