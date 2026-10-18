import { ICONS, type IconName } from "../lib/icons";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
  label?: string; // give one only when the icon carries meaning on its own
}

// One of Alphie's hand-drawn sticker icons. The outline colour follows the
// theme (--icon-ink), so they still read at bedtime.
export function Icon({ name, size = 28, className = "", label }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`icon ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      fill="none"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: "var(--icon-ink)" }}
      // Static markup from icons.ts, never user input.
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}
