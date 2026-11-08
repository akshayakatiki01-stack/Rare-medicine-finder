import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "./index.css";
import App from "./App.jsx";

// Register Progressive Web App Service Worker
const updateSW = registerSW({
immediate: true,

onRegistered() {
console.log("RareMed Finder Service Worker registered!");
},

onRegisterError(error) {
console.error("Service Worker registration failed:", error);
},
});

createRoot(document.getElementById("root")).render( <StrictMode> <App /> </StrictMode>
);
