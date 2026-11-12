const PHONE_PATH =
  "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z";

const Stroke = ({ children, width = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={PHONE_PATH} />
  </svg>
);

export const MicIcon = () => (
  <Stroke>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" />
  </Stroke>
);

export const MicOffIcon = () => (
  <Stroke>
    <path d="M3 3l18 18" />
    <path d="M9 9v2a3 3 0 0 0 5.1 2.1M15 9.3V5a3 3 0 0 0-5.7-1.3" />
    <path d="M5 10v1a7 7 0 0 0 11.6 5.3M19 10v1c0 .9-.2 1.8-.5 2.6M12 18v4" />
  </Stroke>
);

export const ChatIcon = () => (
  <Stroke width={1.8}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
  </Stroke>
);

export const LockIcon = () => (
  <Stroke width={1.8}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Stroke>
);

export const GlobeIcon = () => (
  <Stroke width={1.8}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Stroke>
);

export const AlertIcon = () => (
  <Stroke>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5h.01" />
  </Stroke>
);

export const CloseIcon = () => (
  <Stroke>
    <path d="M6 6l12 12M18 6L6 18" />
  </Stroke>
);
