# GigCX

A GigCXTalent site with an in-browser voice call to the GigCX assistant (a Yellow.ai bot).
Visitors click **Call us** in the header to open a call window and talk to the bot.
They don't need a phone or an app.

## How the call works

- **Call setup:** SIP over WebSocket ([JsSIP](https://jssip.net/)) to the configured SIP server.
- **Audio:** WebRTC between the browser and the voice platform.
- **Caller ID:** `<VITE_CALLER_ID_PREFIX><random id>`. The id is unique per browser tab.

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:5180
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SIP_WS_URL` | yes | SIP-over-WebSocket server URL (`wss://…`) |
| `VITE_SIP_DOMAIN` | yes | SIP domain, used in `sip:<user>@<domain>` addresses |
| `VITE_BOT_ID` | yes | The Yellow.ai bot to call |
| `VITE_SIP_EXTRA_HEADERS` | no | Extra SIP headers on the call request. Separate several with `\|` |
| `VITE_CALLER_ID_PREFIX` | no | Caller ID prefix. Default: `GigCX_webUser_` |

> `VITE_*` values are embedded in the browser bundle at build time. Treat them as public
> configuration, not secrets.

## Build

```bash
npm run build     # output in dist/
npm run preview
```

## Project layout

```
src/
  config.js             reads env vars; per-tab caller ID
  hooks/useSipCall.js   SIP + WebRTC call logic (JsSIP)
  hooks/useAudioLevel.js, useElapsed.js
  components/CallCard.jsx, Icons.jsx
  call/CallWindow.jsx, call.css     floating call window
  site/                 GigCXTalent site sections, header and Call us button
```
