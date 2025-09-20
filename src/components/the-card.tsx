"use client"

import { useEffect, useRef, useState } from "react"
import "./the-card.css"

export default function TheCard() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} id="card" className={`the-card-section ${isVisible ? "animate-in" : ""}`}>
      <div className="the-card-container">
        <div className="the-card-content">
          <div className="the-card-text">
            <h2 className="the-card-title">The Smart Card</h2>
            <div className="the-card-description">
              <p>
                Experience the future of university identification with our revolutionary NFC-powered smart cards. These
                cutting-edge cards will completely digitize departmental operations, transforming manual processes into
                seamless, efficient digital interactions.
              </p>
              <p>
                Under the visionary leadership of the <strong>Achor Armstrong administration</strong>, NAPSS will
                proudly become the <strong>first university in the South East</strong> to adopt and implement this
                groundbreaking smart card system, setting a new standard for educational technology in the region.
              </p>
              <p>
                While maintaining the familiar appearance of a traditional ID card, our smart cards are equipped with
                advanced NFC technology. Simply tap your card on any scanner throughout the campus to instantly access
                and retrieve your personal data, attendance records, academic information, and much more.
              </p>
              <div className="the-card-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Instant data access with a simple tap</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Secure NFC encryption technology</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Seamless integration with campus systems</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌟</span>
                  <span>First implementation in South East Nigeria</span>
                </div>
              </div>
            </div>
          </div>
          <div className="the-card-image">
            <div className="card-mockup">
              <div className="smart-card">
                <div className="card-header">
                  <div className="university-logo"></div>
                  <div className="university-text">
                    <div className="uni-name">NAPSS UNIZIK</div>
                    <div className="uni-subtitle">Smart ID Card</div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="student-photo"></div>
                  <div className="student-info">
                    <div className="info-line">Peter Parker Chukwuma</div>
                    <div className="info-line">Political Science</div>
                    <div className="info-line">2024/2025</div>
                  </div>
                </div>
                <div className="nfc-chip">
                  <div className="chip-icon">📡</div>
                  <div className="chip-waves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { TheCard }
