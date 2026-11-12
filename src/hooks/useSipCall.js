import { useCallback, useEffect, useRef, useState } from "react";
import JsSIP from "jssip";
import { CALLER_ID, MISSING_CONFIG, SIP } from "../config.js";

const CONNECT_TIMEOUT_MS = 10000;
// Don't let slow ICE gathering (VPNs, extra network adapters) hold the INVITE back.
const ICE_GATHER_MAX_MS = 2000;
const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

const toUri = (user) => `sip:${user}@${SIP.domain}`;
const debug = (...args) => console.debug("[GigCX call]", ...args);

/** Print every raw SIP message to the browser console (for debugging). */
function traceSocket(socket) {
  const send = socket.send.bind(socket);
  socket.send = (msg) => {
    debug("→\n" + msg);
    return send(msg);
  };
  let handler;
  Object.defineProperty(socket, "ondata", {
    configurable: true,
    get: () => handler,
    set: (fn) => {
      handler = fn
        ? (data) => {
            debug("←\n" + (typeof data === "string" ? data : new TextDecoder().decode(data)));
            fn(data);
          }
        : fn;
    },
  });
  return socket;
}

/** Turn a JsSIP failure into something a visitor can understand. */
function friendlyFailure(e) {
  const C = JsSIP.C.causes;
  switch (e.cause) {
    case C.USER_DENIED_MEDIA_ACCESS:
      return "Microphone access is needed to call";
    case C.CANCELED:
      return "Call cancelled";
    case C.BUSY:
    case C.REJECTED:
    case C.UNAVAILABLE:
    case C.NOT_FOUND:
      return "The assistant is unavailable right now";
    case C.CONNECTION_ERROR:
    case C.REQUEST_TIMEOUT:
    case C.RTP_TIMEOUT:
    case C.NO_ANSWER:
      return "We couldn't connect your call";
    default:
      return "Something went wrong. Please try again";
  }
}

/**
 * Browser voice calls to the GigCX bot over SIP-over-WebSocket + WebRTC (JsSIP).
 * status: idle | connecting | calling | ringing | live | ended | error
 */
export function useSipCall(audioRef) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [duration, setDuration] = useState(0); // seconds of the last finished call

  const uaRef = useRef(null);
  const sessionRef = useRef(null);
  const startedAtRef = useRef(null);
  const cancelledRef = useRef(false); // End pressed before the call was placed

  const stopUA = useCallback(() => {
    try {
      uaRef.current?.stop();
    } catch {
      /* already stopped */
    }
    uaRef.current = null;
  }, []);

  // Hang up and disconnect on unmount / page close.
  useEffect(() => {
    const bye = () => {
      sessionRef.current?.terminate();
      stopUA();
    };
    window.addEventListener("beforeunload", bye);
    return () => {
      window.removeEventListener("beforeunload", bye);
      bye();
    };
  }, [stopUA]);

  const getUA = useCallback(() => {
    return new Promise((resolve, reject) => {
      const existing = uaRef.current;
      if (existing && existing.isConnected()) return resolve(existing);
      stopUA();

      const ua = new JsSIP.UA({
        sockets: [traceSocket(new JsSIP.WebSocketInterface(SIP.wsUrl))],
        uri: toUri(CALLER_ID),
        register: false,
        session_timers: false,
      });
      uaRef.current = ua;

      let done = false;
      const ok = () => !done && ((done = true), resolve(ua));
      const fail = (why) => !done && ((done = true), reject(new Error(why)));

      ua.on("connected", () => {
        debug("websocket connected as", CALLER_ID);
        ok();
      });
      ua.on("disconnected", () => {
        debug("websocket disconnected");
        fail("We couldn't reach the call service");
      });

      ua.start();
      setTimeout(() => fail("We couldn't reach the call service"), CONNECT_TIMEOUT_MS);
    });
  }, [stopUA]);

  const attachRemoteAudio = useCallback(
    (pc) => {
      if (!pc || pc.__gigcx) return;
      pc.__gigcx = true;
      pc.addEventListener("track", (ev) => {
        const el = audioRef.current;
        if (!el) return;
        el.srcObject = ev.streams[0] || new MediaStream([ev.track]);
        el.play().catch(() => {});
      });
    },
    [audioRef]
  );

  const finish = useCallback(
    (nextStatus, msg) => {
      sessionRef.current = null;
      if (audioRef.current) audioRef.current.srcObject = null;
      setDuration(startedAtRef.current ? Math.round((Date.now() - startedAtRef.current) / 1000) : 0);
      startedAtRef.current = null;
      setMuted(false);
      setStartedAt(null);
      setStatus(nextStatus);
      setMessage(msg);
    },
    [audioRef]
  );

  const call = useCallback(async () => {
    if (MISSING_CONFIG.length) {
      setStatus("error");
      setMessage("Calling isn't set up on this site yet");
      return;
    }
    cancelledRef.current = false;
    setStatus("connecting");
    setMessage("");
    setDuration(0);

    try {
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
      probe.getTracks().forEach((t) => t.stop());
    } catch {
      setStatus("error");
      setMessage("Microphone access is needed to call");
      return;
    }
    if (cancelledRef.current) return;

    let ua;
    try {
      ua = await getUA();
    } catch (e) {
      if (!cancelledRef.current) {
        setStatus("error");
        setMessage(e.message);
      }
      return;
    }
    if (cancelledRef.current) return;

    setStatus("calling");
    const session = ua.call(toUri(SIP.botId), {
      mediaConstraints: { audio: true, video: false },
      extraHeaders: SIP.extraHeaders,
      pcConfig: { iceServers: ICE_SERVERS },
      rtcOfferConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false },
    });
    sessionRef.current = session;

    attachRemoteAudio(session.connection);
    session.on("peerconnection", (e) => attachRemoteAudio(e.peerconnection));

    // Send the INVITE once we have a public (srflx) candidate or after ICE_GATHER_MAX_MS.
    let iceTimer = null;
    let iceReleased = false;
    session.on("icecandidate", (e) => {
      if (iceReleased) return;
      const release = () => {
        if (iceReleased) return;
        iceReleased = true;
        clearTimeout(iceTimer);
        e.ready();
      };
      if (e.candidate?.type === "srflx") release();
      else if (!iceTimer) iceTimer = setTimeout(release, ICE_GATHER_MAX_MS);
    });

    session.on("progress", () => setStatus("ringing"));
    session.on("confirmed", () => {
      startedAtRef.current = Date.now();
      setStartedAt(startedAtRef.current);
      setStatus("live");
    });
    session.on("ended", (e) => {
      debug("ended", e.originator, e.cause);
      finish("ended", "Call ended");
    });
    session.on("failed", (e) => {
      debug("failed", e.originator, e.cause, e.message?.status_code);
      if (e.cause === JsSIP.C.causes.CANCELED && e.originator === "local") finish("idle", "");
      else finish("error", friendlyFailure(e));
    });
  }, [getUA, attachRemoteAudio, finish]);

  const hangUp = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.terminate();
    } else {
      // Still asking for the mic / connecting: abandon the attempt.
      cancelledRef.current = true;
      setStatus("idle");
      setMessage("");
    }
  }, []);

  const toggleMute = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    if (s.isMuted().audio) {
      s.unmute({ audio: true });
      setMuted(false);
    } else {
      s.mute({ audio: true });
      setMuted(true);
    }
  }, []);

  const inCall = ["connecting", "calling", "ringing", "live"].includes(status);

  return { status, message, inCall, muted, startedAt, duration, call, hangUp, toggleMute };
}
