# GoHighLevel Voice AI Actions

Two SMS actions. The first confirms bookings. The second exists so that callers who do **not** book still end up in the CRM with a thread open. Most calls to this number come from paid ads and the Google Business Profile, so an anonymous hangup is spend that produced nothing.

Build both. The confirmation action alone still loses every price shopper.

> **On merge tags:** use the tag icon in the Message input field to insert real variables. Do not type tag syntax by hand. If a tag name is wrong it does not fail loudly, it sends the customer a text with literal curly braces in it. Where this file marks a spot for a tag, click the icon and pick from the list. If the variable you want is not offered, leave it out.

## Three kinds of variable, do not mix them up

| Kind | Example | Behaviour |
|---|---|---|
| Custom value | `{{custom_values.marketing__website_booking_page_url}}` | Static, set once in Settings > Custom Values, identical in every message. Good for the booking URL, address, hours. |
| Contact field | `{{contact.first_name}}` | Per person. Resolves whenever the contact record has the field filled. |
| Appointment field | `{{appointment.start_time}}` | Per booking. **Only resolves when an actual appointment record exists in context.** See below. |

## Appointment date and time in the confirmation text

The tags exist and are exactly what you want:

| Tag | Renders as |
|---|---|
| `{{appointment.start_time}}` | `Wed, Nov 5, 2025 3:30 PM` (date and time together, usually the only one you need) |
| `{{appointment.only_start_date}}` | `Wed, Nov 5, 2025` |
| `{{appointment.only_start_time}}` | `3:30 PM` |
| `{{appointment.add_to_calendar}}` | Link that drops it into the caller's own calendar |
| `{{appointment.reschedule_link}}` | Self-serve reschedule link |
| `{{appointment.cancellation_link}}` | Self-serve cancel link |
| `{{appointment.meeting_location}}` | Location set on the calendar |

**The catch:** HighLevel only resolves appointment tags when the execution context knows which appointment is being referenced. Their support docs are explicit that this requires an Appointment or Customer Booked Appointment trigger. A Voice AI Send SMS action is not that trigger. It will only work if the agent's **Book Appointment** action created a real calendar record earlier in the same call, and even then it is undocumented behaviour.

**So build it this way instead:**

1. Wire the Voice AI **Book Appointment** action to a real calendar. This is what creates the appointment record.
2. Move the booking confirmation SMS out of the Voice AI action and into a **Workflow** triggered by **Customer Booked Appointment**. Appointment tags are guaranteed to resolve there, because that is the officially supported path.
3. Keep the Voice AI Send SMS action for Quote Follow Up only. That message needs no appointment tags, so it has nothing to break.

This also means the confirmation fires for online bookings from the website, not just phone calls. One workflow covers both.

**Watch for the double text.** Voice AI already sends its own confirmation by default once an appointment is booked, something like "Great, you are booked for 12th August at 6pm". There is a checkbox in the Book Appointment action to turn it off. Turn it off, or the caller gets two confirmations and it reads as spam.

**If you skip the calendar wiring entirely** and the agent is only taking details for the team to confirm later, then no appointment record exists, appointment tags have nothing to fill, and you should use the no-tag version of the message below. That is the version that is safe today.

---

## ACTION 1: Booking Confirmation

### Action name

```
Booking Confirmation
```

### Message input

Safe version, no merge tags required, works for both in-shop and mobile bookings:

```
Silverback Detailing: you're booked. We've got your appointment locked in exactly as we discussed on the call.

Coming to the shop? We're at 981 Main St W, Hamilton ON. Open 7 days, 10am to 9pm.

Need to change anything, just reply to this text or call 905-519-6290.

See you soon.
```

**Full version. This is the one to use.** It belongs in a Customer Booked Appointment workflow, not in the Voice AI action, because that is the only place the appointment tags are guaranteed to resolve.

```
Silverback Detailing: you're booked, {{contact.first_name}}.

{{appointment.start_time}}

Add it to your calendar: {{appointment.add_to_calendar}}

Coming to us? We're at 981 Main St W, Hamilton ON.
Need to change anything? Reply here or call 905-519-6290.
```

Notes on this message:

- Insert both tags with the tag picker. Never type the syntax by hand.
- `{{appointment.start_time}}` already contains the date and the time. Do not also add `only_start_date` and `only_start_time`, that is what produces "Wed, Nov 5, 2025 3:30 PM Wed, Nov 5, 2025 3:30 PM".
- Keep the calendar link alone on its line so it stays tappable and does not get swallowed by surrounding text.
- "Coming to us?" is deliberate. It gives the shop address without asserting the appointment is in-shop, so the same message is correct for mobile bookings at the customer's address.
- Roughly 250 characters once the tags resolve, so about two SMS segments.

Optional: add `Need to move it? {{appointment.reschedule_link}}` for self-serve rescheduling. It cuts no-shows, but it does not enforce the 24 hour cancellation policy in `business.ts`, so leave it out if every change should go through a person.

### When should the sms delivery take place?

```
Send immediately after the caller has verbally agreed to a specific service, date, and time, AND you have captured their full name and mobile number. All four are required.

Do not send for: price questions with no booking, callers still deciding, requests for a photo quote, cancellations, reschedules, complaints, or wrong numbers. Those callers get the Quote Follow Up action instead. Never send both actions on the same call.
```

### What to say before sending sms

Set the toggle to **Static Sentence** and use:

```
Perfect, I'm sending that to you by text right now.
```

If you prefer **Prompt**, use this instead:

```
Tell the caller warmly that you are texting them the confirmation right now, in your own words, under 12 words.
```

---

## ACTION 2: Quote Follow Up

**This is the one that stops the leak.** Create it as a second Send SMS action.

### Action name

```
Quote Follow Up
```

### Message input

```
Silverback Detailing here, thanks for the call.

Prices start at: headlight restoration 120, exterior detail 150, interior detail 180, paint correction 800, ceramic coating 1200. Final price depends on your vehicle's size and condition.

Want an exact number? Text a few photos of the car to this number, on WhatsApp or regular text, and we'll send a quote back.

981 Main St W, Hamilton ON. Open 7 days, 10am to 9pm. 905-519-6290.
```

### When should the sms delivery take place?

```
Send when the caller asked about pricing, availability, or a service but did NOT commit to a specific date and time, AND you captured their name and mobile number. This covers price shoppers, "I'll think about it", photo quote requests, and callers who ran out of time.

Do not send if the caller booked, since they get the Booking Confirmation instead. Do not send to wrong numbers, sales calls, or complaints. Never send both actions on the same call.
```

### What to say before sending sms

Set the toggle to **Static Sentence** and use:

```
I'm texting you the pricing now so you've got it in writing.
```

---

## Why both actions need the same two inputs

Neither action can fire without a **name** and a **mobile number**. That is why the system prompt has a NEVER LOSE THE LEAD section placed above the call flow, with the number requested as a favour rather than a form:

> "What's the best number for you? I'll text you the details so you've got them in writing."

Phrasing it that way is what makes this work. "Can I get your number?" gets refused. "I'll text you the details" gets accepted, because the caller is receiving something.

---

## Before you go live

- **Test both triggers.** Call once and book. Call again and only ask a price. Confirm exactly one text arrives each time and it is the right one. Overlapping trigger descriptions cause double texts, which read as spam.
- **Check the phone number format** the SMS sends from. It should be the business number, so replies land where someone reads them.
- **Watch for replies.** Action 2 invites a photo reply. If nobody is monitoring that inbox, the follow up creates a worse impression than sending nothing.
- **Opt-out language.** These are transactional texts the caller triggered by phoning in, so they sit differently from marketing blasts. If you later use this number for promos, add STOP language and check your A2P registration.
- **Keep prices in sync.** Action 2 hardcodes starting prices. When `lib/config/business.ts` changes, update this file, `knowledge-base.md`, and the live GHL action together, or the texts will quote stale numbers.
