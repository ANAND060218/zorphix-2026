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

import { useEffect } from 'react'

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Console Easter Egg - runs once on app load
  useEffect(() => {
    console.log(`
                             ###
                            ###
                           ###
        __________________###_
        \\\\ ################### \\\\
    /###/\\\\    __________#######\\\\
   /###/  \\\\##/         ###  \\\\###\\\\
  /###/    \\\\/  ###    ###    \\\\###\\\\
 /###/        ###    ###      \\\\###\\\\
 \\\\###\\\\       ###    ###       /###/
  \\\\###\\\\     ###    ###   /\\\\  /###/
   \\\\###\\\\___### _________/  \\\\/###/
    \\\\###################### \\\\
     \\\\__ ### ________________\\\\
           ###
          ###
         ###
    `);

    console.log(`
 ███████╗  ██████╗  ██████╗  ██████╗  ██╗  ██╗   ██╗ ██╗  ██╗
 ╚══███╔╝ ██╔═══██╗ ██╔══██╗ ██╔══██╗ ██║  ██║   ██║ ╚██╗██╔╝
  ███╔╝   ██║   ██║ ██████╔╝ ██████╔╝ ███████║   ██║   ╚███╔╝ 
███╔╝     ██║   ██║ ██╔══██╗ ██╔══    ██╔══██║   ██║   ██╔██╗ 
███████╗  ╚██████╔╝ ██║  ██║ ██║      ██║  ██║   ██║  ██╔╝ ██╗
╚══════╝   ╚═════╝  ╚═╝  ╚═╝ ╚═╝      ╚═╝  ╚═╝   ╚═╝  ╚═╝  ╚═╝
    `);

    console.log('%c👋 Welcome, Curious Human.', 'font-size: 16px; font-weight: bold;');
    console.log('%cYou\'ve opened the Developer Console.', 'font-size: 14px;');
    console.log('');
    console.log('%c💀 Welcome to the Dark Side of ZORPHIX.', 'font-size: 14px; color: #e33e33;');
    console.log('');
    console.log('%c⚠️ Warning:', 'font-size: 14px; color: #ffa500; font-weight: bold;');
    console.log('This site is not built by developers.😉');
    console.log('not Secured by logic.');
    console.log('not Protected by curiosity.');
    console.log('not Broken only by normal human or imagination or by you 😉.');
    console.log('');
    console.log('%c🔐 No exploits here.', 'color: #97b85d;');
    console.log('%c🧠 No vulnerabilities exposed.', 'color: #97b85d;');
    console.log('%c🚀 Only innovation, code & creativity.', 'color: #97b85d;');
    console.log('');
    console.log('If you\'re here to:');
    console.log('%c✔ Learn — Welcome.', 'color: #97b85d;');
    console.log('%c✔ Explore — Respect.', 'color: #97b85d;');
    console.log('%c✔ Hack — Sorry, wrong universe.', 'color: #e33e33;');
    console.log('');
    console.log('%c🎯 ZORPHIX Symposium — Where Coders Rise.', 'font-size: 16px; font-weight: bold; color: #e33e33;');
  }, []);


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

