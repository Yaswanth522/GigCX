import { useState } from "react";
import {
  ABOUT, CLARITY, CONTACT, CTA, ELASTIC, FOOTER, HERO, IMG, INSIGHT, NAV, SERVICES, SOLUTIONS, TEAM,
} from "./content.js";

/* ---------- small shared bits ---------- */

export const Arrow = () => (
  <svg className="btn-arrow" viewBox="0 0 12 14" aria-hidden="true">
    <path d="M0 0 L12 7 L0 14 Z" fill="currentColor" />
  </svg>
);

const Eyebrow = ({ children, center }) => <h4 className={`eyebrow ${center ? "center" : ""}`}>{children}</h4>;

const Lines = ({ lines }) =>
  lines.map((l, i) => (
    <span key={i}>
      {l}
      {i < lines.length - 1 && <br />}
    </span>
  ));

const CheckBadge = () => (
  <svg viewBox="0 0 24 24" className="check-badge" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 1l2.4 1.8 3-.2 1 2.8 2.6 1.6-.6 2.9L22 12l-1.6 2.1.6 2.9-2.6 1.6-1 2.8-3-.2L12 23l-2.4-1.8-3 .2-1-2.8L3 17l.6-2.9L2 12l1.6-2.1L3 7l2.6-1.6 1-2.8 3 .2z"
    />
    <path d="M7.5 12.2l3 3 6-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ContactIcon = ({ name }) => {
  const paths = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    phone: <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />,
    pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  };
  return (
    <span className="contact-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[name]}
      </svg>
    </span>
  );
};

/* ---------- sections ---------- */

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-copy">
        <h1>
          <Lines lines={HERO.title} />
        </h1>
        <p className="hero-sub">{HERO.subtitle}</p>
        <div className="hero-ctas">
          {HERO.ctas.map((c) => (
            <a key={c} href="#contact" className="btn btn-primary">
              {c} <Arrow />
            </a>
          ))}
        </div>
        <p className="hero-caption">{HERO.caption}</p>
      </div>

      <div className="hero-visual">
        <div className="future-badge" aria-label="The Future of Work">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="ring" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
            </defs>
            <circle cx="100" cy="100" r="96" fill="#003a6c" />
            <circle cx="100" cy="100" r="56" fill="#fff" />
            <text fill="#fff" fontSize="18" fontWeight="700" fontFamily="Outfit, sans-serif">
              <textPath href="#ring" textLength="448" lengthAdjust="spacing">THE FUTURE OF WORK • THE FUTURE OF WORK •</textPath>
            </text>
          </svg>
          <img src={IMG.badgeG} alt="" />
        </div>
        <img className="hero-city" src={IMG.heroCity} alt="" />
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="section section-gray" id="about">
      <div className="container about-grid">
        <div>
          <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
          <h2>{ABOUT.title}</h2>
          <div className="prose">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i}>
                <Lines lines={p.split("\n")} />
              </p>
            ))}
          </div>
          <ul className="features">
            {ABOUT.features.map((f) => (
              <li key={f.title}>
                <CheckBadge />
                <div>
                  <h5>{f.title}</h5>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-primary">
            Talk to Our Experts <Arrow />
          </a>
        </div>
        <div className="about-images">
          <img src={IMG.about1} alt="" />
          <img src={IMG.about2} alt="" />
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="section" id="services">
      <div className="container">
        <Eyebrow center>{SERVICES.eyebrow}</Eyebrow>
        <h2 className="center">
          <Lines lines={SERVICES.title} />
        </h2>
        <div className="grid-3 services">
          {SERVICES.items.map((s) => (
            <article key={s.title} className="service">
              <img src={s.img} alt="" />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Clarity() {
  return (
    <section className="section section-tight" id="gpi">
      <div className="container">
        <h2 className="center">{CLARITY.title}</h2>
        <div className="grid-3">
          {CLARITY.items.map((c) => (
            <article key={c.title} className="clarity-card">
              <div className="clarity-icon">
                <img src={c.img} alt="" />
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>

        <div className="elastic">
          <img src={IMG.elastic} alt="The GigCXTalent Elastic Workforce" />
          <div>
            <h2>{ELASTIC.title}</h2>
            <ul>
              {ELASTIC.items.map(([letter, rest]) => (
                <li key={letter}>
                  <b>{letter}</b>
                  {rest}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Augmented() {
  return (
    <section className="augmented" aria-label="Augmented by AI">
      <img src={IMG.augmented} alt="Augmented by AI" />
    </section>
  );
}

export function Solutions() {
  return (
    <section className="section" id="solutions">
      <div className="container solutions-grid">
        <div>
          <Eyebrow>{SOLUTIONS.eyebrow}</Eyebrow>
          <h2>{SOLUTIONS.title}</h2>
          <p className="muted">{SOLUTIONS.text}</p>
        </div>
        <div className="stats">
          {SOLUTIONS.stats.map(([num, label], i) => (
            <div key={label} className={`stat ${i % 2 === 0 ? "shade" : ""}`}>
              <strong>{num}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Team() {
  const tabNames = Object.keys(TEAM.tabs);
  const [tab, setTab] = useState(tabNames[0]);
  const [idx, setIdx] = useState(0);
  const people = TEAM.tabs[tab];
  const person = people[idx] || people[0];

  return (
    <section className="section section-gray" id="team">
      <div className="container">
        <Eyebrow>{TEAM.eyebrow}</Eyebrow>
        <h2>{TEAM.title}</h2>
        <div className="team-tabs" role="tablist">
          {tabNames.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={t === tab}
              className={t === tab ? "active" : ""}
              onClick={() => {
                setTab(t);
                setIdx(0);
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <article className="team-feature">
          <img src={person.img} alt={person.name} />
          <div>
            <h3>{person.name}</h3>
            <h4>{person.role}</h4>
            <p>{person.bio}</p>
          </div>
        </article>

        <div className="team-thumbs">
          {people.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className={i === idx ? "active" : ""}
              onClick={() => setIdx(i)}
              aria-pressed={i === idx}
            >
              <img src={p.img} alt="" />
              <span>
                <strong>{p.name}</strong>
                <small>{p.role}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Insight() {
  return (
    <section className="section" id="insight">
      <div className="container center">
        <Eyebrow center>{INSIGHT.eyebrow}</Eyebrow>
        <h2 className="center">
          <Lines lines={INSIGHT.title} />
        </h2>
        <p className="muted insight-note">
          Follow GigCXTalent on LinkedIn for the latest industry views, research and expert commentary.
        </p>
        <a href={INSIGHT.more.href} target="_blank" rel="noreferrer" className="btn btn-primary">
          {INSIGHT.more.label} <Arrow />
        </a>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="container cta-band">
      <h4>{CTA.eyebrow}</h4>
      <h2>{CTA.title}</h2>
      <p>{CTA.text}</p>
      <div className="cta-buttons">
        <a href="#contact" className="btn btn-outline-light">
          Talk to Our Experts <Arrow />
        </a>
        <a href="#contact" className="btn btn-light">
          Contact Our Team <Arrow />
        </a>
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
          <h2>{CONTACT.title}</h2>
          <p className="muted">{CONTACT.text}</p>
          <ul>
            {CONTACT.items.map((c) => (
              <li key={c.label}>
                <ContactIcon name={c.icon} />
                <div>
                  <strong>{c.label}</strong>
                  {c.href ? <a href={c.href}>{c.value}</a> : <span>{c.value}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <h2>Send us Message</h2>
          <div className="row-2">
            <input placeholder="First Name*" required aria-label="First name" />
            <input placeholder="Last Name*" required aria-label="Last name" />
          </div>
          <input type="email" placeholder="Email Address*" required aria-label="Email address" />
          <input placeholder="Phone Number" aria-label="Phone number" />
          <textarea placeholder="Message" rows={5} aria-label="Message" />
          <button type="submit" className="btn btn-primary">
            Send Message <Arrow />
          </button>
          {sent && <p className="form-note">Thanks! (Local demo copy – the message was not sent.)</p>}
        </form>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src={IMG.logo} alt="GigCXTalent" />
          {FOOTER.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div>
          <h3>Navigation</h3>
          <ul>
            {NAV.filter((n) => n.label !== "GPI").map((n) => (
              <li key={n.label}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            {FOOTER.quick.map((q) => (
              <li key={q}>
                <a href="#top">{q}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">{FOOTER.copyright}</div>
    </footer>
  );
}
