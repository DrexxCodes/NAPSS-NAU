"use client"

import { useState } from "react"
import { Menu, X, CreditCard } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import "./navigation.css"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "The Card", href: "#card" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "FAQ", href: "/faq" },
  ]

  return (
    <nav className="navigation">
      <div className="navigation-container">
        <div className="navigation-content">
          <div className="navigation-logo">
            <div className="logo-icon">
              <CreditCard className="logo-icon-svg" />
            </div>
            <span className="logo-text">NAPSS Smart ID</span>
          </div>

          {/* Desktop Navigation */}
          <div className="navigation-desktop">
            <div className="navigation-links">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} className="navigation-link">
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="navigation-actions-desktop">
            <ThemeToggle />
            <Button variant="primary" size="medium" onClick={() => (window.location.href = "/enrollment")}>
              Enroll
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="navigation-mobile-controls">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="mobile-menu-button">
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="menu-icon" aria-hidden="true" />
              ) : (
                <Menu className="menu-icon" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : "mobile-menu-closed"}`}>
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="mobile-menu-link" onClick={() => setIsOpen(false)}>
              {item.name}
            </a>
          ))}
          <div className="mobile-menu-button-container">
            <Button
              variant="primary"
              size="medium"
              onClick={() => setIsOpen(false)}
              className="mobile-menu-enroll-button"
              onClickCapture={() => (window.location.href = "/enrollment")}
            >
              Enroll
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
