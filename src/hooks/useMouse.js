import { useEffect } from 'react'
import { useMotionValue } from 'framer-motion'

/** Raw pointer position (clientX / clientY) as MotionValues + a 0/1 "pointer is on page" flag. */
export default function useMouse() {
  const x = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const y = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  const visible = useMotionValue(0)

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      visible.set(1)
    }
    const leave = () => visible.set(0)
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
    }
  }, [x, y, visible])

  return { x, y, visible }
}
