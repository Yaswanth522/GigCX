import { useEffect } from "react";
import CallCard from "../components/CallCard.jsx";

/**
 * Floating call window opened from the header "Call us" button.
 * Closing it only hides the window; an active call keeps running
 * (the header button shows "On call · mm:ss") until the user ends it.
 */
export default function CallWindow({ open, onClose, call, audioRef }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`cw ${open ? "open" : ""}`} role="dialog" aria-label="Call GigCX" aria-hidden={!open}>
      <CallCard call={call} audioRef={audioRef} onClose={onClose} />
    </div>
  );
}
