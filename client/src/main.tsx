import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import ArticlePage from "./routes/article";
import ErrorPage from "./routes/error";
import LandingPage from "./routes/landing";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
