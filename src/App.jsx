import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/Authpage";
import CreateListingPage from "./pages/CreateListingPage";
import AgenciesPage from "./pages/AgenciesPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./context/Authcontext";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage  from "./pages/ResetPasswordPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import LegalPage from "./pages/LegalPage";
import BottomNav from "./components/BottomNav";
import MapSearchPage from "./pages/MapSearchPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProfilePage from "./pages/ProfilePage";
import AdvertisePage from "./pages/AdvertisePage";
import { FavoritesProvider } from "./context/FavoritesContext";

const googleClientId = String(import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "").trim();

function AppRoutes() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/elan" element={<ListingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/elan/yerlesdir" element={<CreateListingPage />} />
            <Route path="/agencies" element={<AgenciesPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />
            <Route path="/elan/:id" element={<ListingDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/rules" element={<LegalPage type="rules" />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />
            <Route path="/map" element={<MapSearchPage />} />
            <Route path="/advertise" element={<AdvertisePage />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

function App() {
  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppRoutes />
      </GoogleOAuthProvider>
    );
  }
  return <AppRoutes />;
}

export default App;