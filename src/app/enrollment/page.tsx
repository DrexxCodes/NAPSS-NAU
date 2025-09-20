"use client"

import { useState, useEffect } from "react"
import { Navigation }from "@/components/navigation"
import Image from "next/image"
import Preloader from "@/components/preloader"
import EnrollmentForm from "@/components/enrollment-form"
import "./enrollment.css"

export default function EnrollmentPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate page load time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Preloader />
  }

  return (
    <div className="enrollment-page">
      <Navigation />
      <main className="enrollment-main">
        <div className="enrollment-container">
          <div className="enrollment-header">
            <Image 
              src="/napss.png" 
              alt="NAPSS Logo" 
              width={60}
              height={60}
              className="napss-logo"
              priority
            />
            <h2 className="napss-title">NAPSS UNIZIK</h2>
          </div>
          <h1 className="enrollment-title">Smart ID Card Enrollment Center</h1>
          <EnrollmentForm />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}
