/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

const openMenu = () => {
   navMenu.classList.add('show-menu')
   document.body.classList.add('menu-open')
   if (navToggle) navToggle.setAttribute('aria-expanded', 'true')
}

const closeMenu = () => {
   navMenu.classList.remove('show-menu')
   document.body.classList.remove('menu-open')
   if (navToggle) navToggle.setAttribute('aria-expanded', 'false')
}

if (navToggle) {
   navToggle.addEventListener('click', openMenu)
}

if (navClose) {
   navClose.addEventListener('click', closeMenu)
}

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape') closeMenu()
})

document.addEventListener('click', (event) => {
   if (!navMenu || !navToggle) return
   if (!navMenu.classList.contains('show-menu')) return
   if (navMenu.contains(event.target) || navToggle.contains(event.target)) return
   closeMenu()
})

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll('.nav__link, .nav__contact')

const linkAction = () => {
   closeMenu()
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== HOME TEXT CIRCULAR ===============*/
const homeText = document.querySelector('.home__text')

if (homeText) {
   const characters = homeText.textContent.trim().split('')
   const angle = 360 / characters.length

   homeText.textContent = ''

   characters.forEach((char, index) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.transform = `rotate(${angle * index}deg)`
      homeText.appendChild(span)
   })
}

/*=============== HOME TYPED JS ===============*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (typeof Typed !== 'undefined' && !prefersReducedMotion) {
   new Typed('#home-typed', {
      strings: ['Full-Stack Developer', 'Backend Developer', 'Frontend Developer'],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1600,
      loop: true
   })
}

/*=============== CHANGE HEADER STYLES ===============*/
const header = document.getElementById('header')

const scrollHeader = () => {
   if (window.scrollY >= 50) {
      header.classList.add('bg-header')
   } else {
      header.classList.remove('bg-header')
   }
}
window.addEventListener('scroll', scrollHeader)

/*=============== SWIPER WORK ===============*/
if (typeof Swiper !== 'undefined') {
   new Swiper('.work__swiper', {
      loop: true,
      spaceBetween: 24,
      grabCursor: true,
      slidesPerView: 1,
      autoHeight: true,
      pagination: {
         el: '.swiper-pagination',
         clickable: true
      },
      breakpoints: {
         768: {
            slidesPerView: 2
         },
         1150: {
            slidesPerView: 3
         }
      }
   })
}

/*=============== SERVICES ACCORDION ===============*/
const servicesCards = document.querySelectorAll('.services__card')

const closeServicesInfo = (card) => {
   const info = card.querySelector('.services__info')
   const trigger = card.querySelector('.services__header')
   info.style.height = '0px'
   if (trigger) trigger.setAttribute('aria-expanded', 'false')
}

const openServicesInfo = (card) => {
   const info = card.querySelector('.services__info')
   const trigger = card.querySelector('.services__header')
   info.style.height = `${info.scrollHeight}px`
   if (trigger) trigger.setAttribute('aria-expanded', 'true')
}

servicesCards.forEach((card) => {
   if (card.classList.contains('services-open')) {
      openServicesInfo(card)
   }

   const trigger = card.querySelector('.services__header')
   const toggleCard = () => {
      const isOpen = card.classList.contains('services-open')

      servicesCards.forEach((other) => {
         other.classList.remove('services-open')
         closeServicesInfo(other)
      })

      if (!isOpen) {
         card.classList.add('services-open')
         openServicesInfo(card)
      }
   }

   if (trigger) {
      trigger.addEventListener('click', toggleCard)
   }
})

window.addEventListener('resize', () => {
   servicesCards.forEach((card) => {
      if (card.classList.contains('services-open')) {
         openServicesInfo(card)
      }
   })
})

/*=============== CONTACT FORM ===============*/
const contactForm = document.getElementById('contact-form')
const contactMessage = document.getElementById('contact-message')
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (contactForm) {
   contactForm.addEventListener('submit', (event) => {
      event.preventDefault()

      const name = document.getElementById('user_name').value.trim()
      const email = document.getElementById('user_email').value.trim()
      const message = document.getElementById('user_message').value.trim()

      if (!name || !email || !message) {
         contactMessage.className = 'contact__message error'
         contactMessage.textContent = 'Please fill in all fields.'
         return
      }

      if (!emailPattern.test(email) || message.length < 10) {
         contactMessage.className = 'contact__message error'
         contactMessage.textContent = 'Please enter a valid email and a message of at least 10 characters.'
         return
      }

      const subject = encodeURIComponent(`Portfolio message from ${name}`)
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)

      window.location.href = `mailto:lidia.yirbe@gmail.com?subject=${subject}&body=${body}`

      contactMessage.className = 'contact__message success'
      contactMessage.textContent = 'Opening your email app to send the message.'
      contactForm.reset()

      setTimeout(() => {
         contactMessage.textContent = ''
         contactMessage.className = 'contact__message'
      }, 5000)
   })
}

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
   const scrollUpBtn = document.getElementById('scroll-up')
   if (!scrollUpBtn) return

   if (window.scrollY >= 350) {
      scrollUpBtn.classList.add('show-scroll')
   } else {
      scrollUpBtn.classList.remove('show-scroll')
   }
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
   const scrollY = window.scrollY

   sections.forEach((current) => {
      const sectionHeight = current.offsetHeight
      const sectionTop = current.offsetTop - 80
      const sectionId = current.getAttribute('id')
      const sectionLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`)

      if (!sectionLink) return

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
         document.querySelectorAll('.nav__link').forEach((link) => {
            link.classList.remove('active-link')
         })
         if (sectionLink.classList.contains('nav__link')) {
            sectionLink.classList.add('active-link')
         }
      }
   })
}
window.addEventListener('scroll', scrollActive)

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.getElementById('cursor')
const finePointer = window.matchMedia('(pointer: fine)').matches

if (cursor && finePointer && !prefersReducedMotion) {
   cursor.hidden = false
   let mouseX = 0
   let mouseY = 0

   const moveCursor = () => {
      cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 8}px)`
      requestAnimationFrame(moveCursor)
   }

   window.addEventListener('mousemove', (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
      cursor.classList.remove('cursor--hidden')
   })

   document.addEventListener('mouseleave', () => {
      cursor.classList.add('cursor--hidden')
   })

   moveCursor()

   document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hidden'))
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hidden'))
   })
}

/*=============== SCROLLREVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== 'undefined' && !prefersReducedMotion) {
   const sr = ScrollReveal({
      origin: 'top',
      distance: '48px',
      duration: 1800,
      delay: 240
   })

   sr.reveal('.home__data, .footer__container')
   sr.reveal('.home__images', { delay: 400, origin: 'bottom' })
   sr.reveal('.about__title', { origin: 'left' })
   sr.reveal('.about__data', { origin: 'right' })
   sr.reveal('.work__container, .skills__card, .experience__card, .contact__form, .contact__info', { interval: 80 })
   sr.reveal('.services__card', { interval: 100, origin: 'bottom' })
}
