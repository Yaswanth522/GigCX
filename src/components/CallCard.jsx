import { useElapsed } from "../hooks/useElapsed.js";
import { useAudioLevel } from "../hooks/useAudioLevel.js";
import {
  AlertIcon, ChatIcon, CloseIcon, GlobeIcon, LockIcon, MicIcon, MicOffIcon, PhoneIcon,
} from "./Icons.jsx";

const BUSY = ["connecting", "calling", "ringing"];
const BAR_SHAPE = [0.45, 0.7, 1, 0.8, 0.55, 0.9, 0.6];

const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

function statusLine(status, elapsed, duration) {
  switch (status) {
    case "connecting": return "Connecting…";
    case "calling": return "Calling…";
    case "ringing": return "Ringing…";
    case "live": return elapsed || "00:00";
    case "ended": return duration ? `Call ended · ${fmt(duration)}` : "Call ended";
    case "error": return "Call didn't connect";
    default: return "Available now";
  }
}

export default function CallCard({ call, audioRef, onClose }) {
  const { status, message, muted, startedAt, duration, call: startCall, hangUp, toggleMute } = call;
  const elapsed = useElapsed(startedAt);
  const live = status === "live";
  const busy = BUSY.includes(status);
  const level = useAudioLevel(audioRef, live);
  const speaking = level > 0.06;

  const tone = live ? "live" : busy ? "busy" : status === "error" || status === "ended" ? status : "idle";

  return (
    <div className={`cc cc-${tone}`}>
      <div className="cc-top">
        <button type="button" className="cc-close" onClick={onClose} aria-label="Close call window" title="Close">
          <CloseIcon />
        </button>

        <div className={`cc-avatar ${live && speaking ? "speaking" : ""}`}>
          <img src="/gigcx-g.svg" alt="" />
        </div>
        <h2 className="cc-name">GigCX Assistant</h2>
        <p className="cc-status" role="status" aria-live="polite">
          <span className="cc-dot" />
          {statusLine(status, elapsed, duration)}
        </p>
      </div>

      <div className="cc-body">
        {(status === "idle") && (
          <>
            <ul className="cc-points">
              <li><ChatIcon /> Talk naturally, just like a phone call</li>
              <li><GlobeIcon /> No phone or app needed</li>
              <li><LockIcon /> Secure call, right in your browser</li>
            </ul>
            <button type="button" className="cc-btn cc-btn-call" onClick={startCall}>
              <PhoneIcon /> Start call
            </button>
            <p className="cc-note">We'll ask to use your microphone.</p>
          </>
        )}

        {busy && (
          <>
            <p className="cc-waiting">
              Connecting you to the GigCX assistant
              <span className="cc-dots" aria-hidden="true"><i /><i /><i /></span>
            </p>
            <button type="button" className="cc-btn cc-btn-cancel" onClick={hangUp}>
              Cancel
            </button>
          </>
        )}

        {live && (
          <>
            <div className={`cc-wave ${speaking ? "on" : ""}`} aria-hidden="true">
              {BAR_SHAPE.map((k, i) => (
                <span key={i} style={{ transform: `scaleY(${0.15 + Math.min(1, level * 3.2) * k})` }} />
              ))}
            </div>
            <p className="cc-caption">
              {muted ? "You're muted" : speaking ? "Assistant is speaking" : "Listening…"}
            </p>
            <div className="cc-controls">
              <button
                type="button"
                className={`cc-round ${muted ? "on" : ""}`}
                onClick={toggleMute}
                aria-pressed={muted}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              >
                {muted ? <MicOffIcon /> : <MicIcon />}
                <span>{muted ? "Unmute" : "Mute"}</span>
              </button>
              <button type="button" className="cc-round cc-end" onClick={hangUp} aria-label="End call">
                <PhoneIcon />
                <span>End call</span>
              </button>
            </div>
          </>
        )}

        {status === "ended" && (
          <>
            <p className="cc-result">Thanks for calling GigCX!</p>
            <div className="cc-actions">
              <button type="button" className="cc-btn cc-btn-call" onClick={startCall}>
                <PhoneIcon /> Call again
              </button>
              <button type="button" className="cc-btn cc-btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <p className="cc-error">
              <AlertIcon /> {message}
            </p>
            <div className="cc-actions">
              <button type="button" className="cc-btn cc-btn-call" onClick={startCall}>
                <PhoneIcon /> Try again
              </button>
              <button type="button" className="cc-btn cc-btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
