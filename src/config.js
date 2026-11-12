// Call configuration, read from environment variables at build time (see .env.example).
// Note: VITE_* values are embedded in the browser bundle — they are config, not secrets.
const env = import.meta.env;

const list = (value) =>
  (value || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

export const SIP = {
  wsUrl: env.VITE_SIP_WS_URL,
  domain: env.VITE_SIP_DOMAIN,
  botId: env.VITE_BOT_ID,
  extraHeaders: list(env.VITE_SIP_EXTRA_HEADERS),
};

const CALLER_ID_PREFIX = env.VITE_CALLER_ID_PREFIX || "GigCX_webUser_";

/** Names of required variables that are missing (empty when config is complete). */
export const MISSING_CONFIG = [
  ["VITE_SIP_WS_URL", SIP.wsUrl],
  ["VITE_SIP_DOMAIN", SIP.domain],
  ["VITE_BOT_ID", SIP.botId],
]
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (MISSING_CONFIG.length) {
  console.error(`[GigCX call] Missing config: ${MISSING_CONFIG.join(", ")}. Copy .env.example to .env and fill it in.`);
}

const SESSION_KEY = "gigcx-session-id";

function newId() {
  try {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  } catch {
    return Math.random().toString(36).slice(2, 14);
  }
}

/**
 * Unique ID for this browser-tab session: stays the same across reloads in the
 * same tab, new for every new tab/window.
 */
function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = newId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return newId();
  }
}

export const CALLER_ID = `${CALLER_ID_PREFIX}${sessionId()}`;
