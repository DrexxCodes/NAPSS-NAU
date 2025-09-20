import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import FAQClient from "./faq-client"
import "./faq.css"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "NAPSS Smart ID FAQ",
  description: "Common questions about NFC student ID cards",
  keywords: ["FAQ", "Campus Payments", "Student Card"],
}

export default function FAQ() {
  return (
    <section className="faq-section">
      <Navigation />
      <FAQClient />
      <Footer />
    </section>
  )
}