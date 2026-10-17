import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/vt323/400.css";
import "./styles/global.css";
import "./styles/components.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
