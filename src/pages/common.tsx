import { useEffect, type ReactNode } from "react";
import { Icon } from "../components/Icon";
import type { IconName } from "../lib/icons";

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title === "Home" ? "Alphie's Nursery" : `${title} · Alphie's Nursery`;
  }, [title]);
}

export function PageTitle({ icon, title, sub }: { icon: IconName; title: string; sub?: ReactNode }) {
  usePageTitle(title);
  return (
    <div className="page-title">
      <h1>
        <Icon name={icon} size={52} className="page-title__icon" /> {title}
      </h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}
