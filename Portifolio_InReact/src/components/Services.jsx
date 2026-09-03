import { useEffect, useRef, useState } from 'react'
import { services } from '../data/content'

function Services() {
  const [openIndex, setOpenIndex] = useState(0)
  const infoRefs = useRef([])

  const setInfoHeight = (index, open) => {
    const info = infoRefs.current[index]
    if (!info) return
    info.style.height = open ? `${info.scrollHeight}px` : '0px'
  }

  useEffect(() => {
    services.forEach((_, index) => {
      setInfoHeight(index, index === openIndex)
    })
  }, [openIndex])

  useEffect(() => {
    const onResize = () => {
      if (openIndex === null) return
      setInfoHeight(openIndex, true)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [openIndex])

  const toggleCard = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section className="services section" id="service">
      <h2 className="section__title"><span>What</span> I Do</h2>

      <div className="services__container container grid">
        {services.map((service, index) => {
          const isOpen = openIndex === index

          return (
            <article
              key={service.id}
              className={`services__card${isOpen ? ' services-open' : ''}`}
            >
              <button
                className="services__header"
                type="button"
                aria-expanded={isOpen}
                aria-controls={service.id}
                onClick={() => toggleCard(index)}
              >
                <div>
                  <span className="services__number">{service.number}</span>
                  <h3 className="services__name">{service.name}</h3>
                </div>
                <i className="ri-add-line services__icon" aria-hidden="true"></i>
              </button>

              <div
                className="services__info"
                id={service.id}
                ref={(el) => {
                  infoRefs.current[index] = el
                }}
              >
                <p className="services__description">{service.description}</p>
                <ul className="services__list">
                  {service.items.map((item) => (
                    <li key={item} className="services__item">{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Services
