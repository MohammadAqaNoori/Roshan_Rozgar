/**
 * ExperienceGauge — skill-gauge icon for the onboarding experience step.
 * Renders a semicircular gauge with a needle pointing to one of four positions.
 *
 * level 1 → needle low-left  (1–2 yrs)
 * level 2 → needle mid-left  (3–5 yrs)
 * level 3 → needle mid-right (6–10 yrs)
 * level 4 → needle low-right (10+ yrs)
 *
 * Color is inherited via currentColor — set it on the parent element.
 * The gauge does NOT flip in RTL; needle direction is always left → right.
 */

const NEEDLE = {
  1: { x: 8.8,  y: 22.2 },
  2: { x: 13.2, y: 17.8 },
  3: { x: 20.8, y: 17.8 },
  4: { x: 25.2, y: 22.2 },
};

export function ExperienceGauge({ level }) {
  const n = NEEDLE[level] ?? NEEDLE[1];
  return (
    <svg
      width="40"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
      focusable="false"
      /* Prevent CSS transforms from flipping this in RTL layouts */
      style={{ direction: 'ltr', display: 'block' }}
    >
      {/* Background arc */}
      <path
        d="M5 26A12 12 0 0 1 29 26"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Needle */}
      <path
        d={`M17 26L${n.x} ${n.y}`}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Pivot dot */}
      <circle cx="17" cy="26" r="2.5" fill="currentColor" />
    </svg>
  );
}
