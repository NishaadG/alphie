import { applyMute } from "../lib/audio";
import { setState, useApp } from "../lib/store";
import { Icon } from "./Icon";

// The three always-visible controls, as big round toy buttons:
// day/night (bull/bear market), Tantrum Mode, and the mute switch.
export function ToyButtons() {
  const muted = useApp((s) => s.muted);
  const market = useApp((s) => s.market);
  const tantrum = useApp((s) => s.chaos);

  const toggleMute = () => {
    applyMute(!muted);
    setState({ muted: !muted });
  };

  return (
    <div className="toy-buttons" role="toolbar" aria-label="Nursery controls">
      <button
        type="button"
        className="toy-btn toy-btn--sun"
        aria-pressed={market === "bear"}
        onClick={() => setState({ market: market === "bull" ? "bear" : "bull" })}
        data-sound={market === "bull" ? "down" : "up"}
        title={market === "bull" ? "Playtime (bull market). Click for bedtime." : "Bedtime (bear market). Click for playtime."}
      >
        <span className="toy-btn__icon">
          <Icon name={market === "bull" ? "sun" : "moon"} size={30} />
        </span>
        <span className="toy-btn__label">{market === "bull" ? "Playtime" : "Bedtime"}</span>
      </button>
      <button type="button" className="toy-btn toy-btn--tantrum" aria-pressed={tantrum} onClick={() => setState({ chaos: !tantrum })} title="Tantrum Mode">
        <span className="toy-btn__icon">
          <Icon name="tantrum" size={30} />
        </span>
        <span className="toy-btn__label">Tantrum</span>
      </button>
      <button
        type="button"
        className="toy-btn toy-btn--mute"
        aria-pressed={muted}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
        onClick={toggleMute}
        data-sound="none"
      >
        <span className="toy-btn__icon">
          <Icon name={muted ? "speakerOff" : "speaker"} size={30} />
        </span>
        <span className="toy-btn__label">{muted ? "Muted" : "Sound"}</span>
      </button>
    </div>
  );
}
