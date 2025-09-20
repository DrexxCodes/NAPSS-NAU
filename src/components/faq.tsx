"use client"

import { useState } from "react"
import "./faq.css"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: string
}

const faqData: FAQItem[] = [
  {
    id: "what-is-nfc",
    category: "Technology",
    icon: "📱",
    question: "What is NFC technology and how does it work?",
    answer: "NFC (Near Field Communication) is a short-range wireless communication technology that allows devices to exchange data when they're within 4cm of each other. Your NFC ID card contains a tiny chip that can store information and transmit it to NFC-enabled devices like smartphones, tablets, or card readers when tapped."
  },
  {
    id: "what-info-stored",
    category: "Data & Security",
    icon: "🔒",
    question: "What information is stored on my NFC ID card?",
    answer: "Your NFC ID card securely stores essential information including your full name, registration number, academic level, department, photo, enrollment status, and a unique digital signature. All sensitive data is encrypted and cannot be modified without proper authorization."
  },
  {
    id: "how-to-use",
    category: "Usage",
    icon: "👆",
    question: "How do I use my NFC ID card?",
    answer: "Simply tap your NFC ID card on any NFC-enabled device or reader. For smartphones, enable NFC in your settings and hold your card near the back of the phone. The device will instantly read your information and display your student profile, verify your identity, or grant access to authorized areas."
  },
  {
    id: "compatibility",
    category: "Technology",
    icon: "📲",
    question: "Which devices are compatible with NFC ID cards?",
    answer: "Most modern smartphones (iPhone 7+, Android devices from 2012+), tablets, laptops with NFC capability, and dedicated NFC card readers are compatible. Popular devices include iPhone, Samsung Galaxy, Google Pixel, and most Android phones. Check your device settings for NFC functionality."
  },
  {
    id: "security-concerns",
    category: "Data & Security",
    icon: "🛡️",
    question: "How secure is my data on the NFC card?",
    answer: "Very secure! Your data is protected through multiple layers: 256-bit encryption, digital signatures, tamper-proof chips, and authentication protocols. The card cannot be cloned or modified without specialized equipment and authorization. Reading requires physical proximity (4cm), making unauthorized access extremely difficult."
  },
  {
    id: "lost-card",
    category: "Support",
    icon: "🆘",
    question: "What should I do if I lose my NFC ID card?",
    answer: "Immediately report the loss to the registrar's office or IT department. Your card will be deactivated within minutes to prevent misuse. You can request a replacement card, which typically takes 2-3 business days to process. There may be a replacement fee depending on your institution's policy."
  },
  {
    id: "battery-needed",
    category: "Technology",
    icon: "🔋",
    question: "Does my NFC ID card need batteries or charging?",
    answer: "No! NFC cards are completely passive devices that don't require any power source. They draw energy from the NFC reader or device you tap them on. This means your card will work indefinitely without any maintenance, charging, or battery replacement."
  },
  {
    id: "damage-water",
    category: "Support",
    icon: "💧",
    question: "What happens if my card gets wet or damaged?",
    answer: "NFC cards are designed to be durable and water-resistant. Light water exposure (rain, spills) won't damage the card. However, avoid submerging in water, extreme heat, or physical damage like bending or scratching the chip area. If damaged, contact support for a replacement."
  },
  {
    id: "privacy-concerns",
    category: "Data & Security",
    icon: "👁️",
    question: "Can anyone read my card without permission?",
    answer: "While NFC cards can be read by compatible devices, several factors protect your privacy: extremely short range (4cm), encrypted data that requires authorization to decode, audit logs of all access attempts, and the ability to disable cards remotely. Most casual attempts to read your card will only show basic, non-sensitive information."
  },
  {
    id: "update-info",
    category: "Usage",
    icon: "✏️",
    question: "How do I update my information on the card?",
    answer: "Information updates must be processed through your institution's registrar or IT department. You cannot update the card yourself. Common updates include name changes, photo updates, or status changes. The process typically involves submitting a request with proper documentation."
  },
  {
    id: "multiple-cards",
    category: "Usage",
    icon: "🎴",
    question: "Can I have multiple NFC ID cards or backup cards?",
    answer: "Most institutions issue one primary card per student. However, you may be able to request a backup card for specific circumstances (frequent travel, high-risk activities, etc.). Each card has a unique identifier, and all cards linked to your account can be managed and deactivated independently if needed."
  },
  {
    id: "card-lifespan",
    category: "Support",
    icon: "⏰",
    question: "How long does an NFC ID card last?",
    answer: "NFC cards are built to last 5-10 years under normal use. The chip can typically handle over 100,000 read cycles. Cards may need replacement due to physical wear, policy changes, graduation, or technology updates rather than chip failure. Your institution will notify you when renewal is needed."
  }
]

const categories = ["All", "Technology", "Data & Security", "Usage", "Support"]

export default function FAQ() {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: string) => {
    setActiveItem(activeItem === id ? null : id)
  }

  const getCategoryCount = (category: string) => {
    if (category === "All") return faqData.length
    return faqData.filter(item => item.category === category).length
  }

  return (
    <section className="faq-section">
      <div className="faq-container">
        {/* Header */}
        <div className="faq-header">
          <div className="faq-title-group">
            <h2 className="faq-title">
              Frequently Asked Questions
              <span className="title-accent">📋</span>
            </h2>
            <p className="faq-subtitle">
              Everything you need to know about NFC powered student ID cards
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="faq-controls">
          <div className="search-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="clear-search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
                <span className="category-count">({getCategoryCount(category)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || activeCategory !== "All") && (
          <div className="results-summary">
            <p>
              Showing <strong>{filteredFAQs.length}</strong> result{filteredFAQs.length !== 1 ? 's' : ''}
              {searchTerm && <> for "<em>{searchTerm}</em>"</>}
              {activeCategory !== "All" && <> in <strong>{activeCategory}</strong></>}
            </p>
            {filteredFAQs.length === 0 && (
              <div className="no-results">
                <span className="no-results-icon">🤔</span>
                <p>No questions found. Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        )}

        {/* FAQ Items */}
        <div className="faq-list">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className={`faq-item ${activeItem === item.id ? 'active' : ''}`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="faq-question-btn"
                aria-expanded={activeItem === item.id}
              >
                <div className="question-content">
                  <span className="question-icon">{item.icon}</span>
                  <span className="question-text">{item.question}</span>
                  <span className="category-tag">{item.category}</span>
                </div>
                <span className={`expand-icon ${activeItem === item.id ? 'rotated' : ''}`}>
                  ▼
                </span>
              </button>
              
              <div className={`faq-answer ${activeItem === item.id ? 'expanded' : ''}`}>
                <div className="answer-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="faq-footer">
          <div className="support-cta">
            <h3>Still have questions? 🤝</h3>
            <p>Can't find what you're looking for? Our support team is here to help!</p>
            <div className="support-actions">
              <a href="/contact" className="support-btn primary">
                <span className="btn-icon">💬</span>
                Contact Support
              </a>
              <a href="/docs" className="support-btn secondary">
                <span className="btn-icon">📖</span>
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}