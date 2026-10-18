import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/vt323/400.css";
import "@fontsource/sniglet/400.css";
import "@fontsource/sniglet/800.css";
import "@fontsource/gaegu/400.css";
import "@fontsource/gaegu/700.css";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/toys.css";
import "./styles/story.css";
import "./styles/widgets.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
