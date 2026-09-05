# Vapi dashboard setup

Everything below happens at **[dashboard.vapi.ai](https://dashboard.vapi.ai)**. Budget ~15 minutes.
At the end you will have two values for `.env.local`.

---

## 1. Get your public key

`Dashboard → Vapi API Keys → Public Key`

The **public key** is designed to be embedded in a browser. Copy it into `.env.local` as
`VITE_VAPI_PUBLIC_KEY`.

> ⚠️ Never put the **private key** in this project. It can create calls and spend your
> balance. Anything on the `VITE_` prefix ships to the browser in plain text.

---

## 2. Create the assistant

`Dashboard → Assistants → Create Assistant → Blank Template`, name it **Aria — Northstar Front Desk**.

### Model
| Setting | Value | Why |
|---|---|---|
| Provider / Model | OpenAI `gpt-4o` (or `gpt-4o-mini`) | 4o-mini is noticeably faster and cheaper; 4o handles interruptions more gracefully. Either demos well. |
| Temperature | `0.4` | Warm but predictable. Above 0.7 it improvises facts. |
| Max tokens | `250` | Keeps replies short — long replies are the #1 thing that makes a voice agent feel robotic. |

### Transcriber
| Setting | Value |
|---|---|
| Provider | Deepgram |
| Model | `nova-3` (or `nova-2`) |
| Language | `en` |

### Voice
Pick one and stick with it — switching voices mid-prep wastes trial credits.

- **Best sounding:** ElevenLabs → `Jessica` or `Rachel`, stability `0.5`, similarity `0.75`
- **Fastest / cheapest:** Deepgram → `aura-asteria-en`
- **No extra account needed:** Vapi's built-in voices → `Elliot`

### First message
```
Thank you for calling Northstar Dental Studio, this is Aria. How can I help you today?
```

### Call settings that matter for a demo
| Setting | Value | Why |
|---|---|---|
| **Max duration** | `300` seconds | **Set this.** It caps a runaway call so a stuck demo can't drain your trial minutes. |
| Silence timeout | `20` seconds | Ends dead air politely. |
| Background sound | `office` | Subtle ambience makes it read as a real front desk. Set to `off` if your demo room is noisy. |
| End call phrases | `goodbye`, `bye`, `thanks, bye` | Lets you end the call by voice on stage. |
| End call function | enabled | Lets Aria hang up herself after confirming. |

---

## 3. The system prompt

Paste this into the assistant's **System Prompt** field.

```text
# Identity
You are Aria, the front desk coordinator for Northstar Dental Studio, a family and
cosmetic dental practice in Austin, Texas. You answer the phone. You are warm,
efficient, and you sound like a real person who has done this job for years.

# Your one job
Book the caller into an appointment. Everything else — questions about insurance,
hours, parking — is something you answer briefly and then steer back to booking.

# Practice facts (these are the ONLY facts you know)
- Hours: Monday to Thursday 8am-5pm, Friday 8am-2pm. Closed weekends.
- Address: 1204 Lamar Boulevard, Suite 300, Austin TX.
- Dentists: Dr. Elena Moss (general and cosmetic), Dr. Ray Okafor (general and pediatric).
- Services: cleanings and checkups, fillings, crowns, root canals, teeth whitening,
  Invisalign consultations, emergency visits, and pediatric care.
- Insurance accepted: Delta Dental, Cigna, MetLife, Aetna, Guardian, and United Concordia.
  We are out of network with Humana but we file the claim for you.
- New patient exam plus cleaning and x-rays is $149 without insurance.
- Emergencies: if the caller is in severe pain, bleeding that will not stop, or has had
  a tooth knocked out, tell them we hold same-day emergency slots and book the soonest one.
- Soonest general availability: two to three business days out.

If you are asked anything not on this list, say you will have someone from the office
confirm and follow up. NEVER invent a price, a policy, or a doctor's opinion.

# Booking flow
Work through these in order, ONE question at a time. Never stack two questions in one turn.
1. What they need (the reason for the visit).
2. Whether they have been in before — new patient or returning.
3. Their full name.
4. A good callback number.
5. Their insurance, if any.
6. Offer two specific times, e.g. "I have Thursday at 2:40, or Friday morning at 9:20."
   Invent plausible slots inside the practice hours above. Never offer a weekend.
7. Read back the full appointment and ask them to confirm.

# Tools — this is important
- Call `update_appointment_details` EVERY time you learn a new detail, immediately, in the
  same turn you learn it. Send only the fields you just learned. Do not batch them up and
  do not wait until the end.
- Call `book_appointment` once, and only once, after the caller has explicitly confirmed
  the readback.
- Never mention the tools, the system, the screen, or "updating your record" out loud.
  Just keep talking naturally while they run.

# How you speak
- One or two sentences per turn. This is a phone call, not an email.
- Contractions always: "I've got", "let's", "that's".
- Spell numbers the way people say them: "two forty" not "2:40 PM", "five one two" for
  a phone number area code.
- Acknowledge before you ask: "Got it, a cleaning — and have you been in to see us before?"
- If they interrupt you, stop and listen. Do not restart your sentence.
- If you did not catch something, ask for that one piece again, not the whole thing.
- No emoji, no bullet points, no markdown. You are being spoken aloud.

# Guardrails
- No clinical advice. If asked whether something is serious, say the dentist will assess it
  and get them booked in.
- If the caller is upset, acknowledge it once, sincerely, then solve the problem.
- If they ask for a human, take a name and number and say the office manager will call back
  within one business hour.
- If they ask whether you are an AI, be honest and unbothered: "I am — I'm Northstar's
  virtual coordinator. I can get you booked right now, or pass you to the team."

# Ending
After `book_appointment`, confirm the date and time once more, mention they'll get a text
reminder, wish them a good day, and end the call.
```

---

## 4. Add the two tools

`Assistant → Tools → Add Tool → Function` (twice).

These tools are what make the **Appointment card fill in live on screen**. The browser
listens for Vapi's `tool-calls` client message and updates the UI from the arguments —
so there is **no server and no webhook to run**.

Two things must be true for that to work:

1. **Async is ON** for both tools. An async tool tells Vapi not to wait for a server
   response, so the conversation flows normally while the browser updates the card.
2. **Server URL is left blank.** There is no backend in this demo. The tool call still
   reaches the browser over the client message channel.

Also confirm `Assistant → Advanced → Client Messages` includes **`tool-calls`**
(it is on by default).

### Tool 1 — `update_appointment_details`
Description: `Record a detail about the caller's appointment as soon as you learn it. Call this every time you learn something new.`

| Parameter | Type | Description |
|---|---|---|
| `patient` | string | Caller's full name |
| `phone` | string | Callback phone number |
| `service` | string | Reason for the visit, e.g. cleaning, crown, emergency |
| `date` | string | Appointment date in plain language, e.g. Thursday March 14 |
| `time` | string | Appointment time, e.g. 2:40 PM |
| `insurance` | string | Insurance provider, or "Self-pay" |
| `newPatient` | boolean | True if this is their first visit |
| `notes` | string | Anything else worth passing to the office |

### Tool 2 — `book_appointment`
Description: `Confirm and write the appointment to the schedule. Call this only after the caller has explicitly confirmed the date and time.`

| Parameter | Type | Description |
|---|---|---|
| `patient` | string | Caller's full name |
| `phone` | string | Callback phone number |
| `service` | string | Reason for the visit |
| `date` | string | Confirmed date |
| `time` | string | Confirmed time |

### Faster path: paste the JSON

If you prefer the JSON editor, the tools block looks like this:

```json
[
  {
    "type": "function",
    "async": true,
    "function": {
      "name": "update_appointment_details",
      "description": "Record a detail about the caller's appointment as soon as you learn it. Call this every time you learn something new.",
      "parameters": {
        "type": "object",
        "properties": {
          "patient":    { "type": "string",  "description": "Caller's full name" },
          "phone":      { "type": "string",  "description": "Callback phone number" },
          "service":    { "type": "string",  "description": "Reason for the visit" },
          "date":       { "type": "string",  "description": "Appointment date in plain language" },
          "time":       { "type": "string",  "description": "Appointment time" },
          "insurance":  { "type": "string",  "description": "Insurance provider or Self-pay" },
          "newPatient": { "type": "boolean", "description": "True if this is their first visit" },
          "notes":      { "type": "string",  "description": "Anything else worth passing to the office" }
        },
        "required": []
      }
    }
  },
  {
    "type": "function",
    "async": true,
    "function": {
      "name": "book_appointment",
      "description": "Confirm and write the appointment to the schedule. Call this only after the caller has explicitly confirmed the date and time.",
      "parameters": {
        "type": "object",
        "properties": {
          "patient": { "type": "string", "description": "Caller's full name" },
          "phone":   { "type": "string", "description": "Callback phone number" },
          "service": { "type": "string", "description": "Reason for the visit" },
          "date":    { "type": "string", "description": "Confirmed date" },
          "time":    { "type": "string", "description": "Confirmed time" }
        },
        "required": ["patient", "date", "time"]
      }
    }
  }
]
```

The frontend accepts several naming conventions (`patient`/`name`/`full_name`,
`newPatient`/`is_new_patient`, and so on), and treats any tool whose name contains
`book`, `confirm`, `schedule`, or `create` as the confirmation step. So minor renaming
in the dashboard will not break the card — see `src/lib/appointment.js`.

---

## 5. Wire it up

`Assistant → top of the page → copy the Assistant ID` (a uuid).

```bash
# .env.local
VITE_VAPI_PUBLIC_KEY=pk_your_public_key
VITE_VAPI_ASSISTANT_ID=your-assistant-uuid
```

Restart the dev server — Vite only reads `.env.local` at startup.

---

## 6. Test before the client sees it

Run this script twice. It exercises every part of the UI:

> "Hi, I'd like to book a cleaning."
> — "Sure, have you been in to see us before?"
> "No, first time."
> — "Great, can I get your full name?"
> "Sarah Chen."
> — "And a good callback number?"
> "512-555-0188."
> — "Do you have dental insurance?"
> "Delta Dental."
> — "I have Thursday at 2:40, or Friday morning at 9:20."
> "Thursday works."
> — reads back the appointment
> "Yes, that's right."

Watch for: the transcript streaming word by word, each card field flashing as it fills,
and the green **Confirmed** state with a confirmation number at the end.

**If the card never fills in:** open the browser console and look at the logged Vapi
messages. If you see `transcript` messages but never `tool-calls`, the tools are not
attached to the assistant, or the model is not being told firmly enough to call them —
strengthen the "Tools" section of the system prompt.

---

## Trial-tier watch-outs

- Vapi's free tier includes a small credit balance. Each test call burns it. **Set
  `maxDurationSeconds` to 300.**
- ElevenLabs voices consume your ElevenLabs quota separately. Deepgram Aura is the safe
  choice if you plan to rehearse a lot.
- Microphone access requires **HTTPS or `localhost`**. `http://192.168.x.x` will silently
  fail to get a mic. To demo from another device, deploy it (see the README) or tunnel it.
