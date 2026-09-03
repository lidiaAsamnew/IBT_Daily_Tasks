import { useEffect } from 'react'
import ScrollReveal from 'scrollreveal'
import About from './components/About'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Home from './components/Home'
import Navbar from './components/Navbar'
import ScrollUp from './components/ScrollUp'
import Services from './components/Services'
import Skills from './components/Skills'
import Work from './components/Work'

function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const sr = ScrollReveal({
      origin: 'top',
      distance: '48px',
      duration: 1800,
      delay: 240,
      reset: false
    })

    sr.reveal('.home__data, .footer__container')
    sr.reveal('.home__images', { delay: 400, origin: 'bottom' })
    sr.reveal('.about__title', { origin: 'left' })
    sr.reveal('.about__data', { origin: 'right' })
    sr.reveal('.work__container, .skills__card, .experience__card, .contact__form, .contact__info', { interval: 80 })
    sr.reveal('.services__card', { interval: 100, origin: 'bottom' })

    return () => {
      sr.destroy()
    }
  }, [])

  return (
    <>
      <a href="#home" className="skip-link">Skip to content</a>
      <CustomCursor />
      <Navbar />

      <main className="main">
        <Home />
        <About />
        <Work />
        <Services />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />
      <ScrollUp />
    </>
  )
}

export default App
