import { useState, useEffect } from 'react'

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Multi-layer detection for comprehensive mobile detection
      const screenCheck = window.innerWidth <= 768 || window.innerHeight <= 600
      const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // If ANY mobile indicator is true, consider it mobile
      return screenCheck || userAgentCheck || touchCheck
    }

    // Initial check
    setIsMobile(checkMobile())

    // Continuous monitoring for window resize and orientation changes
    const handleResize = () => setIsMobile(checkMobile())
    const handleOrientationChange = () => {
      // Small delay to account for orientation change animation
      setTimeout(() => setIsMobile(checkMobile()), 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return isMobile
}