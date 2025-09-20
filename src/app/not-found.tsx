"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import "./404.css"

export default function Custom404() {
  const router = useRouter()
  const [currentUrl, setCurrentUrl] = useState("")
  const [typedText, setTypedText] = useState("")
  const [showError, setShowError] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [] = useState<"url" | "clearing" | "drexx" | "clearing2">("url")

  useEffect(() => {
    // Get the current URL
    const url = window.location.pathname + window.location.search
    setCurrentUrl(url)
  }, [])

  useEffect(() => {
    if (currentUrl) {
      const runTypingLoop = () => {
        const texts = [currentUrl, "Developed by Drexx"]
        let currentTextIndex = 0
        let currentCharIndex = 0
        let isDeleting = false

        const typeLoop = () => {
          const currentText = texts[currentTextIndex]

          if (!isDeleting) {
            // Typing forward
            if (currentCharIndex < currentText.length) {
              setTypedText(currentText.slice(0, currentCharIndex + 1))
              currentCharIndex++
              setTimeout(typeLoop, 100)
            } else {
              // Finished typing, wait then start deleting
              setTimeout(() => {
                isDeleting = true
                typeLoop()
              }, 2000)
            }
          } else {
            // Deleting backward
            if (currentCharIndex > 0) {
              setTypedText(currentText.slice(0, currentCharIndex - 1))
              currentCharIndex--
              setTimeout(typeLoop, 50)
            } else {
              // Finished deleting, switch to next text
              isDeleting = false
              currentTextIndex = (currentTextIndex + 1) % texts.length
              setTimeout(typeLoop, 500)
            }
          }
        }

        typeLoop()
      }

      // Start the animation after a brief delay
      const startTimeout = setTimeout(() => {
        runTypingLoop()
        // Show error animation after first cycle
        setTimeout(() => setShowError(true), 3000)
        setTimeout(() => setShowMessage(true), 3500)
      }, 500)

      return () => clearTimeout(startTimeout)
    }
  }, [currentUrl])

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-header">
          <h1 className="error-code">
            4<span className="bounce-1">0</span>
            <span className="bounce-2">4</span>
          </h1>
          <div className="glitch-text">PAGE NOT FOUND</div>
        </div>

        <div className="url-display">
          <span className="url-label">Requested URL:</span>
          <div className="url-field">
            <span className="typed-url">{typedText}</span>
            <span className="cursor">|</span>
          </div>
        </div>

        {showError && (
          <div className="error-animation">
            <div className="error-icon">⚠️</div>
            <div className="error-bars">
              <div className="error-bar"></div>
              <div className="error-bar"></div>
              <div className="error-bar"></div>
            </div>
          </div>
        )}

        {showMessage && (
          <div className="error-message fade-in">
            <p>
              Oh, um, I don&apos;t think the page you&apos;re looking for is accessible on this server. Might be a broken link or
              maybe you typed something wrong.
            </p>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={handleGoHome} className="home-button">
            <span>Take Me Home</span>
            <div className="button-glow"></div>
          </button>
        </div>

        <div className="background-animation">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
      </div>
    </div>
  )
}
