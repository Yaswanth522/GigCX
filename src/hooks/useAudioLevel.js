import { useEffect, useState } from "react";

/**
 * Live loudness (0..1) of the stream playing in `audioRef` while `active`.
 * Used to animate the "assistant is speaking" bars.
 */
export function useAudioLevel(audioRef, active) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!active) {
      setLevel(0);
      return;
    }
    let ctx, analyser, source, raf, stream;
    let lastPush = 0;
    const data = new Uint8Array(256);

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const current = audioRef.current?.srcObject;
      if (current && current !== stream) {
        // (Re)connect when the remote stream appears or changes.
        try {
          source?.disconnect();
          ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
          analyser = analyser || Object.assign(ctx.createAnalyser(), { fftSize: 512, smoothingTimeConstant: 0.6 });
          source = ctx.createMediaStreamSource(current);
          source.connect(analyser); // analyser only; playback stays on the <audio> element
          stream = current;
          ctx.resume?.();
        } catch {
          return;
        }
      }
      if (!analyser || t - lastPush < 66) return; // ~15 updates/sec is plenty
      lastPush = t;
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 2; i < 64; i++) sum += data[i]; // voice-ish range
      setLevel(Math.min(1, sum / (62 * 160)));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      try {
        source?.disconnect();
        ctx?.close();
      } catch {
        /* ignore */
      }
    };
  }, [active, audioRef]);

  return level;
}
