// A garland of little flags strung across the top of every room.
const FLAGS = 15;
const COLORS = ["var(--pink)", "var(--blue)", "var(--butter)", "var(--mint)", "var(--lilac)", "var(--peach)"];

export function Bunting() {
  return (
    <div className="bunting" aria-hidden="true">
      <svg className="bunting__rope" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M0 2 Q50 38 100 2" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: FLAGS }, (_, i) => {
        const t = (i + 0.5) / FLAGS;
        // Height of the rope's curve at t, as a fraction of the sag.
        const y = (2 + 72 * t * (1 - t)) / 20;
        return (
          <svg
            key={i}
            className="bunting__flag"
            viewBox="0 0 30 36"
            style={{ left: `${t * 100}%`, "--y": y, "--d": `${(i % 5) * -0.7}s` } as React.CSSProperties}
          >
            <path d="M2 2H28L15 34Z" fill={COLORS[i % COLORS.length]} />
            <circle cx="10" cy="9" r="2.2" />
            <circle cx="20" cy="9" r="2.2" />
            <circle cx="15" cy="17" r="2.2" />
          </svg>
        );
      })}
    </div>
  );
}
