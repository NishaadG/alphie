import { Link } from "../lib/router";
import { STICKERS } from "../lib/stickers";
import { useApp } from "../lib/store";
import { Icon } from "./Icon";

// "New sticker!" pops up whenever you find a secret or reach a milestone.
export function StickerToast() {
  const toast = useApp((s) => s.toast);
  const found = useApp((s) => s.found.length);
  const sticker = STICKERS.find((s) => s.id === toast);
  return (
    <div className="sticker-toast-wrap" role="status" aria-live="polite">
      {sticker && (
        <Link to="/stickers" className="sticker-toast" key={sticker.id}>
          <Icon name={sticker.icon} size={46} className="sticker-toast__icon" />
          <span>
            <b>New sticker: {sticker.name}!</b>
            <small>
              {found} of {STICKERS.length} on your sticker chart
            </small>
          </span>
        </Link>
      )}
    </div>
  );
}

// The room dims while Alphie naps.
export function NapOverlay() {
  const napping = useApp((s) => s.napping);
  if (!napping) return null;
  return (
    <div className="nap-overlay" aria-hidden="true">
      <p className="nap-overlay__text crayon">shhh… Alphie is napping. Wiggle your mouse to wake her.</p>
    </div>
  );
}
