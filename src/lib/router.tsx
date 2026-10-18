import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

// A very small History-API router: real URLs (/playroom, /toys/bottle),
// no full page reloads. vercel.json rewrites deep links to index.html.
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") window.addEventListener("popstate", emit);

export function navigate(to: string): void {
  if (to === window.location.pathname) return;
  window.history.pushState({}, "", to);
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  emit();
}

export function usePath(): string {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => window.location.pathname.replace(/\/+$/, "") || "/",
  );
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest} />;
}
