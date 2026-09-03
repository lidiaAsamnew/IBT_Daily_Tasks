import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { works } from '../data/content'
import 'swiper/css'
import 'swiper/css/pagination'

function Work() {
  return (
    <section className="work section" id="work">
      <h2 className="section__title">View My <span>Work</span></h2>

      <div className="work__container container">
        <Swiper
          className="work__swiper"
          modules={[Pagination]}
          loop
          spaceBetween={24}
          grabCursor
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1150: { slidesPerView: 3 }
          }}
        >
          {works.map((work) => (
            <SwiperSlide key={work.number} className="work__card">
              {work.icon ? (
                <div className="work__image work__image--icon" aria-hidden="true">
                  <i className={work.icon}></i>
                </div>
              ) : (
                <div className="work__image">
                  <img src={work.image} alt="" className="work__img" width="400" height="220" />
                </div>
              )}
              <span className="work__number">{work.number}</span>
              <h3 className="work__name">{work.name}</h3>
              <p className="work__description">{work.description}</p>
              <ul className="work__tags">
                {work.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {work.github ? (
                <a
                  className="work__link"
                  href={work.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <i className="ri-github-fill"></i>
                </a>
              ) : null}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Work
