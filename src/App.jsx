import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import EventsPage from './components/EventsPage'
import Profile from './components/Profile'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Background from './components/Background'
import CurrencyBackground from './components/CurrencyBackground'
import CoinBackground from './components/CoinBackground'
import { Toaster } from 'react-hot-toast'
import './App.css'

const App = () => {
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
      <Background />
      <CurrencyBackground />
      <CoinBackground />
      <div className="relative z-10">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App