import { Navigation } from "../components/navigation"
import { HeroSection } from "../components/hero-section"
import { Footer } from "../components/footer"
import TheCard from "@/components/the-card"
import UseCases from "@/components/use-case"
// import Faq from "@/components/faq"
import "./page.css"

export default function Page() {
  return (
    <main className="main-page">
      <Navigation />
      <HeroSection />
      <TheCard />
      <UseCases />
      {/* <Faq /> */}

      <Footer />
    </main>
  )
}
