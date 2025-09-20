"use client"

import "./stu.css"

export default function StudentIDPage() {
  return (
    <div className="student-id-page">
      <div className="page-container">
        <div className="header-section">
          <div className="title-group">
            <h1 className="page-title">
              Welcome to NAPSS Unizik
              <span className="title-highlight">Student Digital ID Center</span>
            </h1>
            <p className="page-subtitle">Access official student identification cards powered by NFC technology</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🆔</div>
              <h3>Digital Identity</h3>
              <p>Secure, verified student identification</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>NFC Enabled</h3>
              <p>Tap-to-access technology integration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Encrypted Data</h3>
              <p>Military-grade security protocols</p>
            </div>
          </div>
        </div>

        <div className="security-section">
          <div className="security-badge">
            <div className="glowing-shield">
              <div className="shield-outer">
                <div className="shield-inner">
                  <div className="shield-icon">🛡️</div>
                  <div className="security-rings">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                    <div className="ring ring-3"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="security-text">
              <h2>Secured by</h2>
              <div className="company-name">
                <span className="company-text">Cyblack</span>
                <span className="company-highlight">Systems</span>
              </div>
              <p className="security-subtitle">Advanced Digital Identity Protection</p>
            </div>
          </div>
        </div>

        <div className="access-info">
          <div className="info-card">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <h3>How to Access Your Digital ID</h3>
              <p>
                Your digital ID can be accessed at:
                <code className="url-example">site.com/stu/[your-registration-number]</code>
              </p>
              <p className="info-note">Replace [your-registration-number] with your actual registration number</p>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Secure</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">NFC</div>
            <div className="stat-label">Enabled</div>
          </div>
        </div>
      </div>
    </div>
  )
}
