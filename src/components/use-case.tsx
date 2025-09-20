"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import "./use-case.css"

const UseCases = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const useCases = [
    {
      image: "/pay.jpg",
      title: "Payment",
      description: "Seamless payment processing",
      slug: "payment",
    },
    {
      image: "/id.webp",
      title: "Identification",
      description: "Secure identity verification",
      slug: "identification",
    },
    {
      image: "/event.jpg",
      title: "Departmental Events",
      description: "Event access and management",
      slug: "departmental-events",
    },
    {
      image: "/identity.webp",
      title: "NAPSS IDMS",
      description: "Identity management system",
      slug: "napss-idms",
    },
  ]

  return (
    <section className="use-cases-section">
      <div className="use-cases-container">
        <div className="use-cases-header">
          <h2 className="use-cases-title">Smart Card Use Cases</h2>
          <p className="use-cases-subtitle">
            Discover the versatile applications of our NFC-powered smart cards
          </p>
        </div>

        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`use-case-card ${
                hoveredIndex !== null && hoveredIndex !== index ? "grayscale" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="use-case-image-container">
                <Image
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  width={400}   // adjust width based on your layout
                  height={250}  // adjust height based on your layout
                  className="use-case-image"
                />
                <div className="use-case-overlay">
                  <div className="use-case-content">
                    <h3 className="use-case-card-title">{useCase.title}</h3>
                    <p className="use-case-description">{useCase.description}</p>
                    <Link href={`/use-case/${useCase.slug}`}>
                      <button className="view-button">View</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCases
