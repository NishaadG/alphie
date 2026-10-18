import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

// The height chart on the nursery wall (wide screens only). Alphie's mark is
// at 74 cm, and a little baby climbs the chart as you scroll down the page.
export function HeightChart() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll events already arrive once per frame, so just write the variable.
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      ref.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="height-chart" ref={ref} aria-hidden="true">
      <div className="height-chart__ruler">
        {[0, 25, 50, 75, 100].map((cm) => (
          <span key={cm} className="height-chart__num" style={{ bottom: `${cm}%` }}>
            {cm}
          </span>
        ))}
        <span className="height-chart__mark crayon" style={{ bottom: "74%" }}>
          Alphie
        </span>
        <span className="height-chart__you">
          <Icon name="baby" size={30} />
        </span>
      </div>
      <span className="height-chart__cap crayon">how tall?</span>
    </div>
  );
}
