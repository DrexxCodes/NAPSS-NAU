import "./footer.css"

export function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Enrollment", href: "/enrollment" },
  ]

  const useCases = [
    { name: "Identification", href: "#identification" },
    { name: "Dept Events", href: "#dept-events" },
    { name: "Payment", href: "#payment" },
    { name: "NAPSS IDMS", href: "#napss-ids" },
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo and Description */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-circle">
                <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="logo-title">NAPSS Smart ID</h3>
              </div>
            </div>
            <p className="footer-description">
              NAPSS NAU Smart Identification Card - Revolutionizing student identification and campus services with
              cutting-edge technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div className="footer-section">
            <h4 className="footer-heading">Use Cases</h4>
            <ul className="footer-links">
              {useCases.map((useCase) => (
                <li key={useCase.name}>
                  <a href={useCase.href} className="footer-link">
                    {useCase.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} NAPSS UNIZIK Smart ID Card. All rights reserved.
          </div>
          <div className="footer-credit">
            Developed by <span className="credit-highlight">Drexx Codes</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
