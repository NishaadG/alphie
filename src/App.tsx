import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { Buddy } from "./components/Buddy";
import { ChaosLayer } from "./components/ChaosLayer";
import { EggLayer } from "./components/EggLayer";
import { Footer } from "./components/Footer";
import { HeightChart } from "./components/HeightChart";
import { Peekaboo } from "./components/Peekaboo";
import { SiteHeader } from "./components/SiteHeader";
import { SparkleTrail } from "./components/SparkleTrail";
import { Ticker } from "./components/Ticker";
import { ToyButtons } from "./components/ToyButtons";
import { installClickSounds } from "./lib/clickSounds";
import { recordVisit, type VisitMemory } from "./lib/memory";
import { usePath } from "./lib/router";
import { useApp } from "./lib/store";
import { roomFor, wallpaper } from "./lib/wallpaper";
import Home from "./pages/Home";

const Playroom = lazy(() => import("./pages/Playroom"));
const ToyPage = lazy(() => import("./pages/ToyPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StorybookPage = lazy(() => import("./pages/Rooms").then((m) => ({ default: m.StorybookPage })));
const NapRoomPage = lazy(() => import("./pages/Rooms").then((m) => ({ default: m.NapRoomPage })));
const MonitorPage = lazy(() => import("./pages/Rooms").then((m) => ({ default: m.MonitorPage })));
const GuestbookPage = lazy(() => import("./pages/Rooms").then((m) => ({ default: m.GuestbookPage })));

// Read once per page load (outside React so StrictMode can't count it twice).
const memory: VisitMemory = recordVisit();

function Page({ path }: { path: string }) {
  if (path === "/") return <Home memory={memory} />;
  if (path === "/playroom") return <Playroom />;
  if (path.startsWith("/toys/")) return <ToyPage slug={path.slice(6)} />;
  if (path === "/storybook") return <StorybookPage />;
  if (path === "/nap-room") return <NapRoomPage />;
  if (path === "/monitor") return <MonitorPage />;
  if (path === "/guestbook") return <GuestbookPage />;
  return <NotFound />;
}

export default function App() {
  const [booted, setBooted] = useState(false);
  const path = usePath();
  const market = useApp((s) => s.market);
  const tantrum = useApp((s) => s.chaos);

  useEffect(() => installClickSounds(), []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.market = market;
    root.classList.toggle("chaos", tantrum);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", market === "bull" ? "#fff8f1" : "#2a2350");
  }, [market, tantrum]);

  const room = roomFor(path);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.room = room;
    root.style.setProperty("--paper", wallpaper(room, market === "bear"));
  }, [room, market]);

  const onBooted = useCallback(() => setBooted(true), []);

  return (
    <>
      {!booted && <BootScreen onDone={onBooted} fast={memory.visits > 0} />}
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="sky" aria-hidden="true" />
      <Ticker />
      <SiteHeader />
      <ChaosLayer />
      <main id="main" className="page" key={path}>
        <Suspense fallback={<p className="loading crayon">Crawling over…</p>}>
          <Page path={path} />
        </Suspense>
      </main>
      <HeightChart />
      <Footer />
      <ToyButtons />
      <Buddy />
      <SparkleTrail />
      <Peekaboo />
      <EggLayer />
    </>
  );
}
