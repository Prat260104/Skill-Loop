import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import IntroAnimation from './components/IntroAnimation'
import MouseSpotlight from './components/MouseSpotlight'
import Signup from './components/Signup'
import Login from './components/Login'

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ThemeProvider>
      <Router>
        {showIntro ? (
          <IntroAnimation onComplete={() => setShowIntro(false)} />
        ) : (
          <div className="flex flex-col min-h-screen animate-fadeIn cursor-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
            <MouseSpotlight />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={
                  <>
                    <div id="hero"><Hero /></div>
                    <div id="features"><Features /></div>
                    <div id="how-it-works"><HowItWorks /></div>
                  </>
                } />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
            <Footer />
          </div>
        )}
      </Router>
    </ThemeProvider>
  )
}

export default App
