import { IS_CONFIGURED } from './config'
import { useVapiCall } from './lib/useVapiCall'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import CallPanel from './components/CallPanel'
import TranscriptPanel from './components/TranscriptPanel'
import AppointmentCard from './components/AppointmentCard'
import CallHistory from './components/CallHistory'
import { SetupNotice, ErrorNotice, InsecureOriginNotice } from './components/Notices'

export default function App() {
  const call = useVapiCall()

  return (
    <div className={`app ${call.isLive ? 'is-live' : ''}`}>
      <div className="glow" aria-hidden="true" />

      <div className="shell">
        <TopBar status={call.status} />

        {!window.isSecureContext && <InsecureOriginNotice />}
        {!IS_CONFIGURED && <SetupNotice />}
        {call.error && <ErrorNotice message={call.error} onDismiss={call.dismissError} />}

        <Hero />

        <main className="grid">
          <div className="col col-left">
            <CallPanel
              status={call.status}
              agentSpeaking={call.agentSpeaking}
              agentVolume={call.agentVolume}
              micVolume={call.micVolume}
              muted={call.muted}
              elapsed={call.elapsed}
              onStart={call.startCall}
              onEnd={call.endCall}
              onToggleMute={call.toggleMute}
              disabled={!IS_CONFIGURED}
            />
          </div>

          <div className="col col-center">
            <TranscriptPanel
              turns={call.turns}
              liveTurn={call.liveTurn}
              status={call.status}
            />
          </div>

          <div className="col col-right">
            <AppointmentCard appointment={call.appointment} flashFields={call.flashFields} />
            <CallHistory history={call.history} onClear={call.clearLog} />
          </div>
        </main>

        <footer className="site-foot">
          <span>Voice orchestration by Vapi · Speech by Deepgram · Voice by ElevenLabs</span>
          <span>Demo build — no patient data is stored.</span>
        </footer>
      </div>
    </div>
  )
}
