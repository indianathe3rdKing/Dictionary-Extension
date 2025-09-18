import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";

// Render the app without ChakraProvider — styling is handled via Tailwind and the
// `src/components/ui` (shadcn style) primitives.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
