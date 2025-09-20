import Link from "next/link"
import {Navigation} from "@/components/navigation"
import {Footer} from "@/components/footer"
import "../use-case.css"

export default function IDMSUseCase() {
  return (
    <div className="use-case-page">
      <Navigation />
      {/* Hero Section with Parallax */}
      <section className="use-case-hero">
        <div className="parallax-container">
          <div className="parallax-image" style={{ backgroundImage: "url(/id.webp)" }}></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">API Use Case</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="use-case-content">
        <div className="content-container">
          <h2 className="content-title">NAPSS NAU Identity Management Service</h2>

          <p className="content-paragraph">
            If you don't know what IDMS is, it's basically a system that helps manage and secure digital identities within an organization. In the context of NAPSS, IDMS is used to manage the identities and data of students. Aside from a physical card, we also issue a digital ID card on NAPSS Cloud Servers secured by Cyblack and with this you can upload your results and scholarships can be applied for on the portal and investors can use the API to see your data!
          </p>

          <div className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Ready to be seen?</h3>
              <p className="cta-subtitle">
                Enroll for the NAPSS smart card and let your data do the talking.
              </p>
              
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