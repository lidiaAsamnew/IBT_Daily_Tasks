const footerLinks = [
  { href: '#work', label: 'Work' },
  { href: '#service', label: 'What I Do' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' }
]

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container container">
        <h2 className="footer__title">
          Let’s talk about software — frontend, backend, or full-stack.
        </h2>

        <ul className="footer__links">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <ul className="footer__social">
          <li>
            <a
              href="https://github.com/lidiaAsamnew"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="ri-github-fill"></i>
            </a>
          </li>
          <li>
            <a href="mailto:lidia.yirbe@gmail.com" aria-label="Email">
              <i className="ri-mail-fill"></i>
            </a>
          </li>
          <li>
            <a href="tel:+251900024893" aria-label="Phone">
              <i className="ri-phone-fill"></i>
            </a>
          </li>
        </ul>

        <p className="footer__copy">&copy; 2026 Lidia Asamnew. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
