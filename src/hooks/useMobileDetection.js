import { useState, useEffect } from 'react'

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Target mobile phones only (tablets are acceptable)
      return window.innerWidth <= 480
    }

    // Initial check
    setIsMobile(checkMobile())

    // Monitor window resize for responsive layout changes
    const handleResize = () => setIsMobile(checkMobile())

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}