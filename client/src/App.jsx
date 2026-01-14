import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import IntroAnimation from './components/IntroAnimation'
import MouseSpotlight from './components/MouseSpotlight'

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ThemeProvider>
      {showIntro ? (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      ) : (
        <div className="flex flex-col min-h-screen animate-fadeIn cursor-none">
          {/* Added cursor-none above to hide default cursor if desired, or keep both */}
          <MouseSpotlight />
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <Features />
            <HowItWorks />
          </main>
          <Footer />
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
