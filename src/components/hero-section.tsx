"use client"

import { Button } from "./ui/button"
import "./hero-section.css"
import Link from "next/link"

export function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-background">
        <div className="gradient-animation"></div>
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-content-wrapper">
          {/* Main Heading */}
          <div className="hero-heading">
            <h1 className="hero-title">
              <span className="hero-title-main">NAPSS UNIZIK</span>
              <br />
              <span className="hero-title-accent">SMART ID CARD</span>
            </h1>
            <p className="hero-subtitle">
              The future of student identification is here. Secure, smart, and seamlessly integrated with your
              university experience.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="hero-buttons">
            <Link href="/enrollment">
              <Button variant="primary" size="large">
                Start Enrollment
              </Button>
            </Link>
            <Link href="#use-cases">
              <Button variant="outline" size="large">
                View Use Cases
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow">
          <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
