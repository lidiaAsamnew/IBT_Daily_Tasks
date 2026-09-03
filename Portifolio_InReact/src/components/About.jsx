function About() {
  return (
    <section className="about section" id="about">
      <div className="about__container container grid">
        <h2 className="about__title">
          About Me: Software Engineering student who enjoys
          {' '}<span>full-stack</span> and <span>backend</span> development,
          and is focused on building useful software.
        </h2>

        <div className="about__data">
          <p className="about__description">
            I am Lidia Asamnew, a Software Engineering student at Addis Ababa University
            (expected graduation 2027). I work on web applications and APIs across
            frontend and backend, and I keep learning by building projects in class and on my own.
            If you want to collaborate, look through my work and get in touch.
          </p>

          <a href="#contact" className="button">
            Contact me <i className="ri-arrow-right-up-line"></i>
          </a>
        </div>
      </div>
    </section>
  )
}

export default About
