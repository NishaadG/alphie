import { useEffect, type ReactNode } from "react";

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title === "Home" ? "Alphie's Nursery" : `${title} · Alphie's Nursery`;
  }, [title]);
}

export function PageTitle({ icon, title, sub }: { icon: string; title: string; sub?: ReactNode }) {
  usePageTitle(title);
  return (
    <div className="page-title">
      <h1>
        <span aria-hidden="true">{icon}</span> {title}
      </h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}
