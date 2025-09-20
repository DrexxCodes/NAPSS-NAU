import Link from "next/link"
import {Navigation} from "@/components/navigation"
import {Footer} from "@/components/footer"
import "../use-case.css"

export default function PaymentUseCasePage() {
  return (
    <div className="use-case-page">
      <Navigation />
      {/* Hero Section with Parallax */}
      <section className="use-case-hero">
        <div className="parallax-container">
          <div className="parallax-image" style={{ backgroundImage: "url(/pay.jpg)" }}></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Payment Use Case</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="use-case-content">
        <div className="content-container">
          <h2 className="content-title">Using Smart Card to Pay in NAPSS</h2>

          <p className="content-paragraph">
            Transform your payment experience at NAPSS with our revolutionary NFC-powered smart cards. Gone are the days
            of carrying cash or worrying about lost wallets. With a simple tap of your smart card, you can seamlessly
            pay for cafeteria meals, library services, printing, parking, and all campus facilities. The card integrates
            with your student account, automatically deducting payments and providing real-time balance updates. This
            contactless payment system not only enhances convenience but also ensures secure transactions with advanced
            encryption technology. Join the digital revolution and experience the future of campus payments today.
          </p>

          <div className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Ready to Go Cashless?</h3>
              <p className="cta-subtitle">
                Join thousands of students already enjoying seamless, secure payments across campus. 
                Get your smart card today and experience the future of student transactions.
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