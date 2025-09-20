import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import "../use-case.css"

export default function IdentityUseCasePage() {
  return (
    <div className="use-case-page">
      <Navigation />
      {/* Hero Section with Parallax */}
      <section className="use-case-hero">
        <div className="parallax-container">
          <div className="parallax-image" style={{ backgroundImage: "url(/identity.webp)" }}></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Identity Use Case</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="use-case-content">
        <div className="content-container">
          <h2 className="content-title">Using Smart Card for Basic ID</h2>

          <p className="content-paragraph">
            {
              "Don't let the name \"smart card\", make you forget that the card is a physical ID card which will have your name, picture, department and all the existing features of your normal ID card but here is the kicker. You can use the card to access the departmental library and get books to take out just by tapping card on the reader! All those films you use to watch how people in schools abroad use smart cards, it's now in NAPSS"
            }
          </p>

          <div className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Ready for Organization?</h3>
              <p className="cta-subtitle">Get and enroll for the NAPSS smart card and tap into possibilites.</p>

              <Link href="/enrollment">
                <button className="cta-button">Get Your Smart Card Now!</button>
              </Link>

              <div className="cta-features">
                <div className="cta-feature">Instant Setup</div>
                <div className="cta-feature">Secure Payments</div>
                <div className="cta-feature">Real-Time Balance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
