import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Home from "../pages/public/Home"
import About from "../pages/public/About"
import Features from "../pages/public/Features"
import Contact from "../pages/public/Contact"

import Login from "../pages/auth/Login"
import Signup from "../pages/auth/Signup"

import Chat from "../pages/chat/Chat"
import Settings from "../pages/user/Settings"

import Dashboard from "../pages/admin/Dashboard"
import MainLayout from "../layouts/MainLayout"
import ProtectedRoute from "../components/ProtectedRoute"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Interactive App Routes (Protected) */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:convId" element={<Chat />} />

        <Route path="/settings" element={
            <ProtectedRoute>
                <Settings />
            </ProtectedRoute>
        } />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter