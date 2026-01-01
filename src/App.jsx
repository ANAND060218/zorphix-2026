import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import EventsPage from './components/EventsPage'
import Register from './components/Register'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App