import { useEffect, useState } from 'react'
import { contactDetails } from '../data/content'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Contact() {
  const [form, setForm] = useState({
    user_name: '',
    user_email: '',
    user_message: ''
  })
  const [status, setStatus] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!status.text) return undefined
    const timer = setTimeout(() => {
      setStatus({ type: '', text: '' })
    }, 5000)
    return () => clearTimeout(timer)
  }, [status])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = form.user_name.trim()
    const email = form.user_email.trim()
    const message = form.user_message.trim()

    if (!name || !email || !message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' })
      return
    }

    if (!emailPattern.test(email) || message.length < 10) {
      setStatus({
        type: 'error',
        text: 'Please enter a valid email and a message of at least 10 characters.'
      })
      return
    }

    const subject = encodeURIComponent(`Portfolio message from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)

    window.location.href = `mailto:lidia.yirbe@gmail.com?subject=${subject}&body=${body}`

    setStatus({ type: 'success', text: 'Opening your email app to send the message.' })
    setForm({ user_name: '', user_email: '', user_message: '' })
  }

  return (
    <section className="contact section" id="contact">
      <h2 className="section__title">Contact <span>Me</span></h2>

      <div className="contact__container container grid">
        <form className="contact__form" id="contact-form" onSubmit={handleSubmit}>
          <div className="contact__group">
            <label className="contact__label" htmlFor="user_name">Name</label>
            <input
              className="contact__input"
              type="text"
              name="user_name"
              id="user_name"
              placeholder="Your name"
              required
              minLength={2}
              autoComplete="name"
              value={form.user_name}
              onChange={handleChange}
            />
          </div>

          <div className="contact__group">
            <label className="contact__label" htmlFor="user_email">Email</label>
            <input
              className="contact__input"
              type="email"
              name="user_email"
              id="user_email"
              placeholder="you@email.com"
              required
              autoComplete="email"
              value={form.user_email}
              onChange={handleChange}
            />
          </div>

          <div className="contact__group">
            <label className="contact__label" htmlFor="user_message">Message</label>
            <textarea
              className="contact__input contact__area"
              name="user_message"
              id="user_message"
              placeholder="Write your message"
              required
              minLength={10}
              autoComplete="off"
              value={form.user_message}
              onChange={handleChange}
            ></textarea>
          </div>

          <p
            className={`contact__message${status.type ? ` ${status.type}` : ''}`}
            id="contact-message"
            role="status"
          >
            {status.text}
          </p>

          <button type="submit" className="button contact__button">
            Send Message <i className="ri-send-plane-2-line"></i>
          </button>
        </form>

        <div className="contact__info">
          {contactDetails.map((item) => (
            <article key={item.title} className="contact__card">
              <i className={`${item.icon} contact__icon`}></i>
              <div>
                <h3 className="contact__card-title">{item.title}</h3>
                {item.href ? (
                  <a
                    className="contact__address"
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="contact__address">{item.label}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact
