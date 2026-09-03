import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import { homePhoto, typedStrings } from '../data/content'

const circleText = 'EXPLORE - WORK - SCROLL -'
const circleChars = circleText.split('')
const circleAngle = 360 / circleChars.length

function Home() {
  const typedRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !typedRef.current) return undefined

    const typed = new Typed(typedRef.current, {
      strings: typedStrings,
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1600,
      loop: true
    })

    return () => typed.destroy()
  }, [])

  return (
    <section className="home section" id="home">
      <div className="home__container container grid">
        <div className="home__data">
          <h3 className="home__subtitle">Hi! I&apos;m Lidia — Addis Ababa, Ethiopia</h3>

          <h1 className="home__title">
            Software Engineer &amp;<br />
            <span ref={typedRef} id="home-typed">Full-Stack Developer</span>
          </h1>

          <p className="home__description">
            I build web applications and backend systems as a Software Engineering student
            at Addis Ababa University, with a focus on full-stack, backend, and frontend development.
          </p>

          <a href="#work" className="button">
            View my work <i className="ri-arrow-right-line"></i>
          </a>
        </div>

        <div className="home__images">
          <div className="blob-big home__blob"></div>

          <div className="home__image">
            <img
              src={homePhoto}
              alt="Decorative portrait from the site template"
              className="home__img"
              width="460"
              height="520"
            />
          </div>

          <div className="home__info">
            <p className="home__text">
              {circleChars.map((char, index) => (
                <span key={`${char}-${index}`} style={{ transform: `rotate(${circleAngle * index}deg)` }}>
                  {char}
                </span>
              ))}
            </p>
            <a href="#about" className="home__scroll" aria-label="Scroll to about section">
              <i className="ri-arrow-down-line"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
