import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerBg, setHeaderBg] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu()
    }

    const onClick = (event) => {
      if (!menuOpen) return
      const menu = document.getElementById('nav-menu')
      const toggle = document.getElementById('nav-toggle')
      if (!menu || !toggle) return
      if (menu.contains(event.target) || toggle.contains(event.target)) return
      closeMenu()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => {
      setHeaderBg(window.scrollY >= 50)

      const sections = document.querySelectorAll('section[id]')
      const scrollY = window.scrollY

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 80
        const sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header${headerBg ? ' bg-header' : ''}`} id="header">
      <nav className="nav container" aria-label="Primary">
        <a href="#home" className="nav__logo" onClick={closeMenu}>
          Lidia
        </a>

        <div className={`nav__menu${menuOpen ? ' show-menu' : ''}`} id="nav-menu">
          <ul className="nav__list">
            {navLinks.map((link) => {
              const isActive = link.className === 'nav__link' && activeSection === link.href.slice(1)

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`${link.className}${isActive ? ' active-link' : ''}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <button
            className="nav__close"
            id="nav-close"
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <i className="ri-close-large-line"></i>
          </button>
        </div>

        <button
          className="nav__toggle"
          id="nav-toggle"
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          onClick={() => setMenuOpen(true)}
        >
          <i className="ri-menu-line"></i>
        </button>
      </nav>
    </header>
  )
}

export default Navbar
