import { experiences } from '../data/content'

function Experience() {
  return (
    <section className="experience section" id="experience">
      <h2 className="section__title"><span>Education</span> &amp; Work</h2>

      <div className="experience__container container grid">
        {experiences.map((item) => (
          <article key={item.title} className="experience__card">
            <span className="experience__date">{item.date}</span>
            <h3 className="experience__title">{item.title}</h3>
            <p className="experience__place">{item.place}</p>
            <p className="experience__text">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Experience
