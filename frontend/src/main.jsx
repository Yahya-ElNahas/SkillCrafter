import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import App from "./pages/App";
import AchievementsPage from "./pages/AchievementsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import Dashboard from "./pages/Dashboard";
import { MusicProvider } from "./components/MusicContext";

function AppRouter() {
  return (
    <BrowserRouter>
      <MusicProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/app" element={<App />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MusicProvider>
    </BrowserRouter>
  );
}

// mount router
const rootEl = document.getElementById("root");
if (!rootEl) {
  // helpful error if your index.html doesn't have #root
  throw new Error("Cannot find #root element in document. Ensure your index.html includes <div id=\"root\"></div>.");
}
createRoot(rootEl).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);