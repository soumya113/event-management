import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

async function enableMocking() {
  // if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCK === "true") {
    const { worker } = await import("./mocks/browser");

    await worker.start({
      onUnhandledRequest: "bypass",
    });
  // }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
  );
});