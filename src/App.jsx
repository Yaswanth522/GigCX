import { useCallback, useRef, useState } from "react";
import SiteHeader from "./site/SiteHeader.jsx";
import {
  About, Augmented, Clarity, Contact, CtaBand, Hero, Insight, Services, SiteFooter, Solutions, Team,
} from "./site/Sections.jsx";
import CallWindow from "./call/CallWindow.jsx";
import { useSipCall } from "./hooks/useSipCall.js";

export default function App() {
  const [callOpen, setCallOpen] = useState(false);
  const audioRef = useRef(null);
  // Lives here (not in the window) so a call keeps going when the window is closed.
  const call = useSipCall(audioRef);

  const closeCall = useCallback(() => setCallOpen(false), []);

  return (
    <>
      <SiteHeader
        onCallClick={() => setCallOpen((v) => !v)}
        callOpen={callOpen}
        callStatus={call.status}
        callStartedAt={call.startedAt}
      />
      <main>
        <Hero />
        <About />
        <Services />
        <Clarity />
        <Augmented />
        <Solutions />
        <Team />
        <Insight />
        <CtaBand />
        <Contact />
      </main>
      <SiteFooter />

      <CallWindow open={callOpen} onClose={closeCall} call={call} audioRef={audioRef} />
      <audio ref={audioRef} autoPlay />
    </>
  );
}
