import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Remove platform-injected "Made with Emergent" badge
const removeBadge = () => {
  document.querySelectorAll('#emergent-badge, a[href*="emergent.sh"], a[id*="emergent"]').forEach(el => el.remove());
};
removeBadge();
// MutationObserver to catch any re-injection
const observer = new MutationObserver(removeBadge);
observer.observe(document.body, { childList: true, subtree: true });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
