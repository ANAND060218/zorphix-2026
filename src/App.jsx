import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import EventsPage from './components/EventsPage'
import Cart from './components/Cart'
import Profile from './components/Profile'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// Admin Components
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminQueries from './components/admin/AdminQueries'
import AdminUsers from './components/admin/AdminUsers'
import AdminRoute from './components/admin/AdminRoute'

import Background from './components/Background'
import CurrencyBackground from './components/CurrencyBackground'
import CoinBackground from './components/CoinBackground'
import { Toaster } from 'react-hot-toast'
import './App.css'

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-mono">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#97b85d',
              secondary: '#111',
            },
          },
          error: {
            iconTheme: {
              primary: '#e33e33',
              secondary: '#111',
            },
          },
        }}
      />

      {/* Hide backgrounds and navbar for admin pages */}
      {!isAdminPage && (
        <>
          <Background />
          <CurrencyBackground />
          <CoinBackground />
        </>
      )}

      <div className="relative z-10">
        <ScrollToTop />
        {!isAdminPage && <Navbar />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/queries" element={
            <AdminRoute>
              <AdminDashboard>
                <AdminQueries />
              </AdminDashboard>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminDashboard>
                <AdminUsers />
              </AdminDashboard>
            </AdminRoute>
          } />
        </Routes>

        {!isAdminPage && <Footer />}
      </div>
    </div>
  )
}

export default App