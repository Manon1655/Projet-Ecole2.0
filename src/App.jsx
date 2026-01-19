import { Routes, Route } from "react-router-dom";

import Intro from "./pages/Intro";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
