import type { SVGProps } from 'react';

const paths = {
  home: <><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></>,
  'home-fill': <path fill="currentColor" stroke="none" d="M12 2.6 2.4 10.5a1 1 0 0 0 .6 1.8H4V20a1.5 1.5 0 0 0 1.5 1.5H9v-6.5h6v6.5h3.5A1.5 1.5 0 0 0 20 20v-7.7h1a1 1 0 0 0 .6-1.8z" />,
  'map-pin': <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /><path d="M5 21h14" /></>,
  'map-pin-fill': <><path fill="currentColor" d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" fill="#fff" stroke="none" /></>,
  newspaper: <><rect x="6" y="3" width="13" height="18" rx="2" /><path d="M6 7H4a1 1 0 0 0-1 1v10.5A2.5 2.5 0 0 0 5.5 21H8M9.5 8h6M9.5 12h6M9.5 16h4" /></>,
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.7 3.2-5.4 3.7-9.4 2.8 1.7 4.3 4.3 4.3 6.5 1-.6 1.6-1.8 1.7-3 2 1.6 3.3 3.7 3.3 5.9 0 3.5-2.6 6.1-6.5 6.1z" />,
  'flame-fill': <path fill="currentColor" d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.7 3.2-5.4 3.7-9.4 2.8 1.7 4.3 4.3 4.3 6.5 1-.6 1.6-1.8 1.7-3 2 1.6 3.3 3.7 3.3 5.9 0 3.5-2.6 6.1-6.5 6.1z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  'user-fill': <><circle cx="12" cy="7.5" r="4.5" fill="currentColor" /><path fill="currentColor" d="M3.5 21.5a8.5 8.5 0 0 1 17 0z" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.8-4.8" /></>,
  locate: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  sliders: <><path d="M6 3v6M6 13v8M12 3v10M12 17v4M18 3v4M18 11v10" /><circle cx="6" cy="11" r="2" /><circle cx="12" cy="15" r="2" /><circle cx="18" cy="9" r="2" /></>,
  navigation: <path fill="currentColor" d="M20.5 3.5 3.8 10.4c-.8.3-.7 1.4.1 1.6l6.6 1.5 1.5 6.6c.2.8 1.3.9 1.6.1z" />,
  'map-fold': <path fill="currentColor" stroke="none" d="M8.5 4 3 6.2v14L8.5 18zm1.5 0v14l4.5 2.2V6.2zM16 6.2v14l5-2.2V4z" />,
  'calendar-check': <><rect x="3" y="3" width="18" height="18" rx="2.5" fill="currentColor" /><path d="m8 12.5 3 3 5.5-6" stroke="#fff" strokeWidth="2.4" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />,
  'heart-fill': <path fill="currentColor" d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />,
  route: <><circle cx="17.5" cy="5" r="2" /><path d="M17.5 7c0 4-11 3-11 8 0 2.5 3 3 5.5 3h7" /><path d="M5 19.5c1.6-1.4 3.2-1.4 4.8 0" strokeWidth="2.2" /></>,
  star: <path fill="currentColor" d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  'clock-fill': <><circle cx="12" cy="12" r="9.5" fill="currentColor" /><path d="M12 7v5.3l3.2 1.9" stroke="#fff" strokeWidth="2" /></>,
  phone: <path fill="currentColor" d="M6.6 3.5 9 3a1 1 0 0 1 1.1.6l1.3 3.2a1 1 0 0 1-.3 1.1l-1.7 1.4a12 12 0 0 0 5.3 5.3l1.4-1.7a1 1 0 0 1 1.1-.3l3.2 1.3a1 1 0 0 1 .6 1.1l-.5 2.4A2 2 0 0 1 18.6 19 15.6 15.6 0 0 1 5 5.4a2 2 0 0 1 1.6-1.9z" />,
  chat: <path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H8z" />,
  'chat-round': <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" />,
  'chevron-left': <path d="m15 5-7 7 7 7" />,
  'chevron-right': <path d="m9 5 7 7-7 7" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  'arrow-right': <path d="M4 12h15m-6-6 6 6-6 6" />,
  'arrow-left': <path d="M20 12H5m6-6-6 6 6 6" />,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h2" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  'eye-off': <><path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c6 0 9.5 6 9.5 6a16.6 16.6 0 0 1-3 3.6M6.4 7.3A16 16 0 0 0 2.5 12S6 18 12 18a9 9 0 0 0 4-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  'image-plus': <><rect x="3" y="5" width="15" height="15" rx="2" /><circle cx="8" cy="10" r="1.5" /><path d="m3 17 4.5-4.5 4 4 2.5-2.5 4 4M19 2v6M16 5h6" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z" /><path fill="currentColor" stroke="none" d="m12 8 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" /></>,
  sparkle: <><path d="M12 3.5 14 6l3-.4.4 3L20 10.5l-1.6 2.6.8 3-3 .7-1.2 2.8L12 18.4l-3 1.2-1.2-2.8-3-.7.8-3L4 10.5l2.6-1.9.4-3 3 .4z" /><path d="M8.5 13.5v-3l2 3v-3M14 10.5h-1.5v3H14M12.5 12H14" strokeWidth="1.2" /></>,
  translate: <><path d="M3 5h9M7.5 3v2M5 5c.5 3 3 5.5 6 7M10 5c-.5 3-3 5.5-6 7" /><path d="m12 21 4-10 4 10M13.5 17.5h5" /></>,
  calendar: <><rect x="3" y="4.5" width="18" height="16.5" rx="2" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" /></>,
  'calendar-list': <><rect x="3.5" y="4.5" width="17" height="16" rx="2" /><path d="M3.5 9h17M8 2.5v4M16 2.5v4M7 13h7M7 16.5h10" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6" /></>,
  ticket: <><path d="M3 8V6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5V8a2.5 2.5 0 0 0 0 5v4.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V13a2.5 2.5 0 0 0 0-5z" /><path d="M8 9.5h8M8 13h5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5" /><path d="M20 3.5v5h-5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  'alert-circle': <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.5" /></>,
  'x-circle': <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  trophy: <><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" /><path d="M7.5 6H4.5a3 3 0 0 0 3 4M16.5 6h3a3 3 0 0 1-3 4M12 13.5V17M8.5 20h7M9.5 17h5v3h-5z" /></>,
  gift: <><rect x="3.5" y="8" width="17" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.5 9 8 12 8zm0 0s1.5-4.5 4-3.5S15 8 12 8z" /></>,
  book: <><path d="M3 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9-.5V19c-2.5-1.5-6-1.5-9 .5-3-2-6.5-2-9-.5z" /><path d="M12 6v13.5" /></>,
  bell: <><path d="M12 14.5c4 0 7 1.2 7 2.7V18H5v-.8c0-1.5 3-2.7 7-2.7z" /><circle cx="12" cy="8" r="4" /><path d="M8 4.5 6 2.5M16 4.5l2-2" /></>,
  crown: <path d="M4 18h16M4.5 15.5 3 7l5 3.5L12 4l4 6.5L21 7l-1.5 8.5z" />,
  social: <><path d="M14 4.5 9.5 18M5.5 9l4-1.5M15 12.5l4.5-1.5" /><circle cx="17.5" cy="6" r="2" /><path d="M5 20c2-3 4.5-3 6.5-1.5S16 21 19 18" /></>,
  'pass': <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h5M7 14h3M15 9.5v5" strokeDasharray="1.5 1.5" /></>,
  minus: <path d="M5 12h14" />,
  list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="2.4" />,
  share: <><circle cx="18" cy="5.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18.5" r="2.5" /><path d="m8.2 10.8 7.6-4M8.2 13.2l7.6 4" /></>,
  court: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M12 5v14M3 12h18" /></>,
  'level': <><path d="M12 3c-4 0-7 3-7 6.5 0 5 7 11.5 7 11.5s7-6.5 7-11.5C19 6 16 3 12 3z" fill="currentColor" stroke="none" opacity="0.2" /><path d="M9 10.5 11 12.5l4-4" /></>,
  logout: <path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16.5 5.5 12 10 7.5M5.5 12H15" />,
  zoom: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.8-4.8M8 10.5h5M10.5 8v5" /></>,
} as const;

export type IconName = keyof typeof paths;

interface Props extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, strokeWidth = 1.8, ...rest }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {paths[name]}
    </svg>
  );
}
