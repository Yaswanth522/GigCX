import { useEffect, useState } from "react";
import { PhoneIcon } from "../components/Icons.jsx";
import { useElapsed } from "../hooks/useElapsed.js";

const HINT_KEY = "gigcx-call-hint-seen";
const HINT_DELAY_MS = 1200;

const hintSeen = () => {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
};
const markHintSeen = () => {
  try {
    localStorage.setItem(HINT_KEY, "1");
  } catch {
    /* storage blocked: hint may show again next visit */
  }
};

/**
 * Header button that opens the call window.
 * - Idle: "Call us" with a green phone, plus a one-time hint explaining it.
 * - Connecting/ringing: "Calling…"
 * - Live: "On call · mm:ss" in green.
 */
export default function CallButton({ open, status, startedAt, onClick }) {
  const elapsed = useElapsed(startedAt);
  const [showHint, setShowHint] = useState(false);

  const live = status === "live";
  const busy = ["connecting", "calling", "ringing"].includes(status);

  // Show the hint once, shortly after the page loads, for first-time visitors.
  useEffect(() => {
    if (hintSeen()) return;
    const id = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  // Opening the call window counts as having seen the hint.
  useEffect(() => {
    if (open && showHint) {
      setShowHint(false);
      markHintSeen();
    }
  }, [open, showHint]);

  const dismiss = () => {
    setShowHint(false);
    markHintSeen();
  };

  const label = live ? "On call" : busy ? "Calling…" : "Call us";
  const sub = live ? elapsed : busy ? "Connecting" : "";
  const state = live ? "live" : busy ? "busy" : "idle";

  return (
    <div className="callbtn-wrap">
      <button
        type="button"
        className={`callbtn ${state} ${open ? "open" : ""}`}
        onClick={onClick}
        aria-expanded={open}
        aria-label={live ? `On call, ${elapsed}. Open call window` : "Call us – start a voice call"}
      >
        <span className="callbtn-icon">
          <PhoneIcon />
        </span>
        <span className="callbtn-text">
          <strong>{label}</strong>
          {sub && <small>{sub}</small>}
        </span>
      </button>

      {showHint && !open && (
        <div className="call-hint" role="dialog" aria-label="Call us">
          <button type="button" className="call-hint-close" onClick={dismiss} aria-label="Dismiss">
            ✕
          </button>
          <p className="call-hint-title">Prefer to talk?</p>
          <p className="call-hint-text">Call us right from your browser — no phone needed. Just allow your microphone.</p>
          <button type="button" className="call-hint-cta" onClick={onClick}>
            <PhoneIcon /> Start a call
          </button>
        </div>
      )}
    </div>
  );
}
