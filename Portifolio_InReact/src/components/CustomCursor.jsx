import { useEffect, useRef } from 'react'

function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    if (!cursor || !finePointer || prefersReducedMotion) return undefined

    cursor.hidden = false
    let mouseX = 0
    let mouseY = 0
    let frameId = 0

    const moveCursor = () => {
      cursor.style.transform = `translate(${mouseX - 8}px, ${mouseY - 8}px)`
      frameId = requestAnimationFrame(moveCursor)
    }

    const onMouseMove = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
      cursor.classList.remove('cursor--hidden')
    }

    const onMouseLeave = () => {
      cursor.classList.add('cursor--hidden')
    }

    const onMouseOver = (event) => {
      if (event.target.closest('a, button')) {
        cursor.classList.add('cursor--hidden')
      }
    }

    const onMouseOut = (event) => {
      if (event.target.closest('a, button')) {
        cursor.classList.remove('cursor--hidden')
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    frameId = requestAnimationFrame(moveCursor)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return <div className="cursor" id="cursor" hidden ref={cursorRef}></div>
}

export default CustomCursor
