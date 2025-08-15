import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";  // Adjust the path as necessary
import "./index.css";  // Optional: Add styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
