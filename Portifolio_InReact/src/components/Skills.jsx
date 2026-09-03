import { skillGroups } from '../data/content'

function Skills() {
  return (
    <section className="skills section" id="skills">
      <h2 className="section__title">My <span>Skills</span></h2>

      <p className="skills__description container">
        Technologies I use in coursework and projects, grouped by how I typically apply them.
      </p>

      <div className="skills__container container grid">
        {skillGroups.map((group) => (
          <article key={group.title} className="skills__card">
            <h3 className="skills__title">
              <i className={group.titleIcon}></i> {group.title}
            </h3>
            <ul className="skills__list">
              {group.items.map((item) => (
                <li key={item.name} className="skills__item">
                  {item.image ? (
                    <img src={item.image} alt="" width="32" height="32" />
                  ) : (
                    <i className={item.icon}></i>
                  )}
                  {' '}{item.name}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Skills
