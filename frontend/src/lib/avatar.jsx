/**
 * Avatar SVG component — generates a face avatar from LOOKS config.
 */
import { LOOKS } from './data';

export function Avatar({ id, size = 64, radius }) {
  const L = LOOKS[id] || LOOKS.imran;
  const r = radius ?? Math.round(size * 0.28);

  let hair = null;
  if (L.hair === 'short') {
    hair = <path d="M19.5 26c0-8 5.5-12.5 12.5-12.5S44.5 18 44.5 26c-1.5-3.5-4-5.5-6.5-6-3 1.8-9 2.5-14 1.6-2 1-3.6 2.4-4.5 4.4z" fill={L.hc} />;
  }
  if (L.hair === 'cap') {
    hair = (<>
      <path d="M19 25c0-8 5.8-12.5 13-12.5S45 17 45 25z" fill={L.cap} />
      <path d="M30 24.5h21c0 1.8-1.5 2.8-3.5 2.8H30z" fill={L.cap} />
      <circle cx="32" cy="13.4" r="1.6" fill={L.cap} />
    </>);
  }
  if (L.hair === 'topi') {
    hair = <path d="M20.5 22.5c1-5.5 5.6-8.5 11.5-8.5s10.5 3 11.5 8.5c-3.6-1.2-7.4-1.8-11.5-1.8s-7.9.6-11.5 1.8z" fill="#F7F4EE" stroke="#D9D2C7" strokeWidth=".8" />;
  }

  const beard = L.beard
    ? <path d="M21.5 29c.4 7 4.8 11.5 10.5 11.5S42.1 36 42.5 29c-1.5 3-4 4.6-6.2 4.6-1.4-1-2.6-1.4-4.3-1.4s-2.9.4-4.3 1.4c-2.2 0-4.7-1.6-6.2-4.6z" fill={L.hc} />
    : null;

  let dupatta = null;
  if (L.hair === 'dupatta') {
    dupatta = <path d="M17 30c0-11 6.5-17.5 15-17.5S47 19 47 30c0 6-1 11-3 14l-3-4c1.4-3 2-6.6 2-10.3 0-7-4.6-12-11-12s-11 5-11 12c0 3.7.6 7.3 2 10.3l-3 4c-2-3-3-8-3-14z" fill={L.dup} />;
  }

  return (
    <span className="ava" style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${r}px` }}>
      <svg viewBox="0 0 64 64" aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }}>
        <rect width="64" height="64" fill={L.bg} />
        <path d="M8 64c0-13 10.5-20 24-20s24 7 24 20z" fill={L.shirt} />
        <path d="M27 38h10v8c-1.5 1.6-3.2 2.4-5 2.4S28.5 47.6 27 46z" fill={L.skin} opacity=".92" />
        <circle cx="32" cy="27" r="11.5" fill={L.skin} />
        {hair}
        {beard}
        {dupatta}
        <circle cx="28" cy="27" r="1.1" fill="#1d1410" />
        <circle cx="36" cy="27" r="1.1" fill="#1d1410" />
      </svg>
    </span>
  );
}

export default Avatar;
