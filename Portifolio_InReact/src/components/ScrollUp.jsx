import { useEffect, useState } from 'react'

function ScrollUp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY >= 350)
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#home"
      className={`scrollup${visible ? ' show-scroll' : ''}`}
      id="scroll-up"
      aria-label="Scroll to top"
    >
      <i className="ri-arrow-up-line"></i>
    </a>
  )
}

export default ScrollUp
