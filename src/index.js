import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch((error) => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
