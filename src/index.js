import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { DialogueProvider } from './features/DialogueContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     <BrowserRouter>
     <DialogueProvider>
      <App />
    </DialogueProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();