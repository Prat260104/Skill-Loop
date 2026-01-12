import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import Hero from './components/Hero'
import Features from './components/Features'
import IntroAnimation from './components/IntroAnimation'

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <ThemeProvider>
      {showIntro ? (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      ) : (
        <div className="relative animate-fadeIn">
          <ThemeToggle />
          <Hero />
          <Features />
        </div>
      )}
    </ThemeProvider>
  )
}

export default App
