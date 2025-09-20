import Link from "next/link"
import {Navigation} from "@/components/navigation"
import {Footer} from "@/components/footer"
import "../use-case.css"

export default function DepartmentalEventsUseCase() {
  return (
    <div className="use-case-page">
      <Navigation />
      {/* Hero Section with Parallax */}
      <section className="use-case-hero">
        <div className="parallax-container">
          <div className="parallax-image" style={{ backgroundImage: "url(/event.jpg)" }}></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Events Use Case</h1>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="use-case-content">
        <div className="content-container">
          <h2 className="content-title">Using Smart Card to Access Events</h2>

          <p className="content-paragraph">
            No more carrying paper tickets for NAPSS related events. Your smart card serves as your ticket to access various departmental events, seminars, and workshops. Simply tap your card at the entrance to gain entry, making the process quick and hassle-free. This system not only enhances security by ensuring that only authorized NAPSSITES can attend events but also provides a seamless experience for you. Embrace the convenience and efficiency of using your smart card for all your event access in the department. Even if event is paid, you can easily load money onto your card and use it to pay for entry, eliminating the need for cash transactions.
          </p>

          <div className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">Ready for Event Check-in?</h3>
              <p className="cta-subtitle">
                No dull, rush now to enroll for your NAPSS Smart ID Card and unlock a world of convenience and security. Live like you are in the future!
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