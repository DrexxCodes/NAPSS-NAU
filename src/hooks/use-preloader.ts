"use client"

import { useEffect, useState } from "react"

interface UsePreloaderOptions {
  minLoadTime?: number // Minimum time to show preloader (in ms)
  maxLoadTime?: number // Maximum time to show preloader (in ms)
  delay?: number // Delay before hiding preloader (in ms)
}

export function usePreloader(options: UsePreloaderOptions = {}) {
  const { minLoadTime = 1000, maxLoadTime = 5000, delay = 300 } = options

  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    let progressInterval: NodeJS.Timeout

    // Simulate loading progress
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const progressValue = Math.min((elapsed / minLoadTime) * 100, 95)
      setProgress(progressValue)
    }

    progressInterval = setInterval(updateProgress, 50)

    const handleLoad = () => {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(minLoadTime - elapsed, 0)

      // Complete progress
      setProgress(100)

      setTimeout(() => {
        setTimeout(() => {
          setIsLoading(false)
        }, delay)
      }, remainingTime)
    }

    // Check if page is already loaded
    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)

      // Fallback timer
      const fallbackTimer = setTimeout(() => {
        setProgress(100)
        setTimeout(() => {
          setIsLoading(false)
        }, delay)
      }, maxLoadTime)

      return () => {
        window.removeEventListener("load", handleLoad)
        clearTimeout(fallbackTimer)
        clearInterval(progressInterval)
      }
    }

    return () => {
      clearInterval(progressInterval)
    }
  }, [minLoadTime, maxLoadTime, delay])

  return { isLoading, progress }
}
