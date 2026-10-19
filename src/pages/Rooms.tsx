import { AskAlphie } from "../components/AskAlphie";
import { Crib3D } from "../components/Crib3D";
import { Guestbook } from "../components/Guestbook";
import { Nightlight } from "../components/Nightlight";
import { Story } from "../components/Story";
import { Link } from "../lib/router";
import { LullabyBox } from "../toys/LullabyBox";
import { PageTitle } from "./common";

export function StorybookPage() {
  return (
    <>
      <PageTitle icon="book" title="Storybook" sub="Scroll down and follow Alphie's crawl through her very first year." />
      <Story />
    </>
  );
}

export function NapRoomPage() {
  return (
    <>
      <PageTitle icon="moon" title="Nap Room" sub="Shhh… Alphie's crib, in 3D. Try the Bedtime button for the starry version, then shine the nightlight on her dreams." />
      <div className="row row--two">
        <Crib3D />
        <LullabyBox />
      </div>
      <Nightlight />
    </>
  );
}

export function MonitorPage() {
  return (
    <>
      <PageTitle icon="monitor" title="Baby Monitor" sub="Alphie's listening! Ask her about her toys, Beta, or what a random walk is." />
      <div className="monitor-wrap">
        <AskAlphie />
      </div>
    </>
  );
}

export function GuestbookPage() {
  return (
    <>
      <PageTitle icon="pencil" title="Guestbook" sub="Leave Alphie a little note. She can't read yet, but her mum reads them all to her." />
      <Guestbook />
      <p className="caption center">
        Done signing? Go play in the <Link to="/playroom">Playroom</Link>, or check your <Link to="/stickers">sticker chart</Link>!
      </p>
    </>
  );
}
