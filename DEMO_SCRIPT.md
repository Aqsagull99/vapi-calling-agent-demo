# Client demo run sheet

Open this on your phone or a second screen during the presentation.

---

## Frame it first (30 seconds, before you touch anything)

Say this out loud before the demo, or the client will misread the whole thing:

> "What you're looking at is your front desk. When a patient calls your clinic, this
> is who picks up. I'm going to play the patient. Watch the right-hand side of the
> screen while I talk — the booking fills itself in."

**The direction of the call is the single thing clients get backwards.** The agent
does not call anyone. It *answers* for the clinic.

---

## Pre-flight (5 minutes before, every time)

| Check | How |
|---|---|
| Open the deployed URL, not localhost | `https://vapi-calling-agent-demo.vercel.app` |
| Microphone works | Click **Test my microphone**, speak, wait for the green ✓ |
| Headset on | Speakers cause the agent to interrupt itself |
| Clear the call log | **Clear** in the Recent calls panel, so history starts empty |
| One rehearsal call | Never demo cold |
| Second tab: Vapi dashboard call log | For the closing move |

---

## The main demo — 3 minutes

Say each line, then **stop talking and let Aria finish**. She asks one question at a
time. Interrupting mid-sentence is the most common way a live demo sounds broken.

| # | You say | What to point at |
|---|---|---|
| 1 | "Hi, I'd like to book a cleaning." | — |
| 2 | "No, first time." | — |
| 3 | "Sarah Chen." | **Patient row fills in** — "that just wrote itself" |
| 4 | "512-555-0188." | Callback row fills |
| 5 | **"Actually — do you take Delta Dental?"** | *The money moment. See below.* |
| 6 | "Great, let's do the cleaning then." | — |
| 7 | *(she offers two times)* "Thursday works." | Date and time rows fill together |
| 8 | *(she reads the appointment back)* "Yes, that's right." | **Card turns green — Confirmed + reference number** |

### Why step 5 matters

That is the step that separates this from a phone menu. Aria answers the insurance
question from the clinic's real policy list, then **returns to the booking on her own**
without losing any of the details she already collected.

Say this while it happens:

> "Notice she didn't lose her place. A phone tree would have dumped the caller back to
> the main menu."

### The close

When the green Confirmed card appears:

> "That call took ninety seconds and cost about six cents. It happened at 2am on a
> Sunday as easily as on a Tuesday morning."

---

## Optional second call — the emergency path (45 seconds)

Run this only if they're engaged and you have time. It shows judgement, not just
form-filling.

> "Hi — I think I chipped a tooth and it's really painful."

Aria should recognise the urgency, offer a same-day emergency slot, and skip the
leisurely questions. Point out:

> "She changed her behaviour based on what she heard. That's the difference between a
> script and an agent."

---

## Questions clients ask, and the honest answers

| They ask | You say |
|---|---|
| "Does it work on our real phone number?" | Yes. We attach a number and it answers there — this browser version is just so you could see the screen. |
| "Does it write into our actual calendar?" | Right now it writes to this screen. Connecting it to your practice software is the next step, and it's a small one. |
| "What if it doesn't know an answer?" | It says it'll have the office confirm and follow up. It's specifically built not to invent prices or policies — that's the biggest risk with these systems, and we've closed it. |
| "Can callers tell it's AI?" | Some do. If they ask directly, she says so honestly and offers to pass them to a human. Pretending is where these projects go wrong. |
| "What does it cost to run?" | Around six cents a minute of conversation. A missed new-patient call is worth hundreds. |
| "Can it speak Urdu?" | Yes — the voice and transcription both support other languages. It's a configuration change, not a rebuild. |

---

## If something goes wrong mid-demo

| Symptom | Do this, out loud, without panic |
|---|---|
| She doesn't hear you | "Let me switch my mic" — end call, run **Test my microphone**, restart |
| She talks over herself | Your speakers are feeding the mic. Put the headset on |
| Card stays empty | Keep going. Finish the booking verbally, then show the Vapi dashboard transcript instead |
| Call drops | "Let's run that again" — a second call is normal in a live demo, don't apologise twice |

Never debug in front of the client. Move to the dashboard call log and talk over it.

---

## The phase-two ask

End by naming what comes next, so the conversation has somewhere to go:

1. **A real phone number** — patients dial it directly
2. **Calendar / practice-software integration** — bookings land in the real schedule
3. **After-hours only** — cheapest starting point: staff take daytime calls, Aria takes
   nights and weekends
4. **Follow-up calls** — appointment reminders and no-show recovery, outbound

Option 3 is the easiest first yes. It is small, low-risk, and it pays for itself with
one recovered patient.
