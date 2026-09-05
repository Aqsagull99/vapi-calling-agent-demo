# Northstar Dental Studio — AI Front Desk

A client-ready demo of a Vapi voice agent that answers a call, qualifies the caller, and
books an appointment — with the transcript and the booking filling in live on screen.

```
┌──────────────┬────────────────────────┬──────────────────┐
│  Aria        │  Live transcript       │  Appointment     │
│  ◉ orb       │  ✦ Aria: How can I…    │  Patient  ✎      │
│  [Talk]      │      You: A cleaning   │  Date     ✎      │
│  ▁▃▅▇▅▃▁     │  ✦ Aria: Have you…     │  ✓ Confirmed     │
│              │                        ├──────────────────┤
│  Try saying… │                        │  Recent calls    │
└──────────────┴────────────────────────┴──────────────────┘
```

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the two values
npm run dev                  # http://localhost:5173
```

The app runs without credentials — you'll see the UI plus an amber banner telling you what
is missing. **Follow [`VAPI_SETUP.md`](./VAPI_SETUP.md)** to create the assistant and get
the two values. That file also contains the full system prompt and the tool definitions.

## How it works

Everything is client-side. There is no backend, no webhook, and no server to keep running
during the presentation.

| Piece | Where |
|---|---|
| Vapi client, all event wiring, all call state | `src/lib/useVapiCall.js` |
| `tool-calls` → appointment card state | `src/lib/appointment.js` |
| Branding, hero copy, prompt chips | `src/config.js` |
| Call history in `localStorage` | `src/lib/history.js` |
| All styling (tokens at the top) | `src/styles.css` |

### The Vapi events we listen to

| Event | What the UI does |
|---|---|
| `call-start` / `call-end` | Flips call state, starts the timer, writes the history entry |
| `message` → `transcript` (`partial`) | Renders the greyed, italic in-progress bubble with a caret |
| `message` → `transcript` (`final`) | Promotes it to a permanent turn |
| `message` → `tool-calls` | Fills the appointment card, flashing each field that changed |
| `speech-start` / `speech-end` | Switches the status line between "Aria is speaking" and "Listening…" |
| `volume-level` | Scales and glows the orb with the agent's voice |
| `local-volume-level` | Drives the caller's microphone meter |
| `error` / `call-start-failed` | Shows a readable red banner instead of failing silently |

### Why the appointment card works with no backend

The two Vapi tools are declared **`async: true`**, so Vapi fires them and lets the
conversation continue rather than waiting on a server response. The browser receives them
as `tool-calls` client messages and updates the card from the arguments. `appointment.js`
normalizes the field names, so the assistant can call them `full_name` or `patient` and it
still lands in the right row.

## Re-branding for a different client

Open `src/config.js`. Change `BRAND`, `HERO`, and `SUGGESTIONS` — that's the whole visible
identity. Then rewrite the practice facts in the system prompt in `VAPI_SETUP.md`. The
accent colour is two lines in `src/styles.css` (`--mint`, `--sky`, `--accent-grad`).

Swap the star glyph for a real logo by replacing `<StarIcon>` inside
`src/components/TopBar.jsx` with an `<img>`.

## Deploying (for sharing a link with the client)

Microphone access needs HTTPS, so a deployed URL is the only way to demo from a phone or
another machine.

```bash
npm run build
npx vercel deploy --prod      # or: npx netlify deploy --prod --dir=dist
```

Set `VITE_VAPI_PUBLIC_KEY` and `VITE_VAPI_ASSISTANT_ID` in the host's environment variables
before building there. Both are browser-safe by design; the Vapi **private** key never
touches this project.

## Presenting it

- Use a headset. Laptop speakers into a laptop mic causes the agent to interrupt itself.
- Have the transcript panel visible — watching the words appear is what sells it.
- Wait for the green **Confirmed** card before you stop talking; that's the payoff shot.
- Rehearse the script at the bottom of `VAPI_SETUP.md` at least twice.
- Keep a second browser tab on the Vapi dashboard's call log — showing the recording and
  the structured call data afterwards is a strong closer.

## Known limits (worth saying out loud to a client)

- The appointment is written to the screen, not to a real calendar. Wiring it to Google
  Calendar, Dentrix, or a CRM is a webhook away — that's the natural phase-two ask.
- Call history lives in `localStorage`, so it is per-browser and clears with site data.
- Web mic only. Real phone numbers need a Vapi number and a small backend to hold the
  private key.
