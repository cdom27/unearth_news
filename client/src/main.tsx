import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import ArticlePage from "./routes/article";
import ErrorPage from "./routes/error";
import LandingPage from "./routes/landing";
import BrowsePage from "./routes/browse";
import RatingsPage from "./routes/ratings";
import GreetingPage from "./routes/greeting";
import AnalyzePage from "./routes/analyze";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/media-ratings" element={<RatingsPage />} />
        <Route path="/subscribe" element={<GreetingPage />} />
        <Route path="/login" element={<GreetingPage />} />
        <Route path="/methodology" element={<GreetingPage />} />
        <Route path="/trial" element={<GreetingPage />} />
        <Route path="/about" element={<GreetingPage />} />
        <Route path="/coming-soon" element={<GreetingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
