import { useState } from "react";
import { IMG, NAV } from "./content.js";
import { Arrow } from "./Sections.jsx";
import CallButton from "./CallButton.jsx";

export default function SiteHeader({ onCallClick, callOpen, callStatus, callStartedAt }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-row">
        <a href="#top" className="site-logo" aria-label="GigCXTalent home">
          <img src={IMG.logo} alt="GigCXTalent" />
        </a>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Main">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <CallButton open={callOpen} status={callStatus} startedAt={callStartedAt} onClick={onCallClick} />
          <a href="#contact" className="btn btn-primary header-cta">
            Talk to Our Experts <Arrow />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
