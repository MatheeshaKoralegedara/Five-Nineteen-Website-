// Vector rebuild of the Five Nineteen wordmark. textLength stretches each line
// to the same width, matching the stacked logo; fill follows currentColor.
const W = 385;

export function Logo({ byline = true, className = "" }: { byline?: boolean; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${byline ? 194 : 167}`}
      className={className}
      role="img"
      aria-label="Five Nineteen by Matheesha Koralegedara"
      fill="currentColor"
      style={{ fontFamily: "var(--font-montserrat), Arial, sans-serif" }}
    >
      <text x="0" y="96" fontSize="136" fontWeight="800" textLength={W} lengthAdjust="spacingAndGlyphs">
        FIVE
      </text>
      <text x="0" y="166" fontSize="79" fontWeight="800" textLength={W} lengthAdjust="spacingAndGlyphs">
        NINETEEN
      </text>
      {byline && (
        <text x="1" y="193" fontSize="21.5" fontWeight="600" textLength={W - 2} lengthAdjust="spacingAndGlyphs">
          BY MATHEESHA KORALEGEDARA
        </text>
      )}
    </svg>
  );
}
