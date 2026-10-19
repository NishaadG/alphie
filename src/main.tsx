import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/fredoka/latin-400.css";
import "@fontsource/fredoka/latin-600.css";
import "@fontsource/vt323/latin-400.css";
import "@fontsource/sniglet/latin-400.css";
import "@fontsource/sniglet/latin-800.css";
import "@fontsource/gaegu/latin-400.css";
import "@fontsource/gaegu/latin-700.css";
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
