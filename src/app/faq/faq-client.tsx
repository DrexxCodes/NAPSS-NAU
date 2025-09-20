"use client"

import { useState } from "react"

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
    answer: "Your digital card stores two types of data. One is your digital ID url that allows for dynamic information to be handled and accessed securely. The second is on demand data such as your name, student Reg number that is used to verify identity"
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
    answer: "Immediately report the loss to any NAPSS Official. Your card will be deactivated within minutes to prevent misuse. You can request a replacement card, which typically takes 2-3 business days to process. There may be a replacement fee."
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
    answer: "Please note that the card uses a chip to work, the chip is engraved inside the card and as such while light splashes of water may not affect functionality, the card is NOT waterproof. If card is damaged, bent or no longer responds when tapped, please report to NAPSS Official for a replacement."
  },
  {
    id: "privacy-concerns",
    category: "Data & Security",
    icon: "👁️",
    question: "Can anyone read my card without permission?",
    answer: "Well, if you tap the card on ANY NFC enabled device, the data can be read. However, the card is designed to only share minimal information (like your name and student ID) unless you authenticate yourself through a secure app or system. Unauthorized reading from a distance is not possible due to the 4cm range limitation. Sensitive operations like payments require bank level authentication."
  },
  {
    id: "update-info",
    category: "Usage",
    icon: "✏️",
    question: "How do I update my information on the card?",
    answer: "We will provide a dashboard for you to be able to make some form of additional data to the cloud database, we however may not allow for changing of Bio data, if need be contact a NAPSS official."
  },
  {
    id: "multiple-cards",
    category: "Usage",
    icon: "🎴",
    question: "Can I have multiple NFC ID cards or backup cards?",
    answer: "If you want a backup NFC Card, probably to use as a smart business card please contact any official to put you in contact with the card issuer."
  },
  {
    id: "Getting-key",
    category: "API",
    icon: "🔑",
    question: "How can I get the NAPSS IDMS API Key?",
    answer: "The API is actually available already. We have't started issuing keys or released an official docs yet. To get the API key, you will need to register for an account on the NAPSS developer portal (coming soon). Once registered, you can apply for an API key by providing some basic information about your intended use case. The key will be emailed to you after approval."
  },
  {
    id: "card-lifespan",
    category: "Support",
    icon: "⏰",
    question: "How long does an NFC ID card last?",
    answer: "NFC cards are built to last 5-10 years under normal use. The chip can typically handle over 100,000 read cycles. Cards may need replacement due to physical wear, policy changes, graduation, or technology updates rather than chip failure. We however cap card at 6 years all things equal."
  },
  {
    id: "card-price",
    category: "Pricing",
    icon: "💰",
    question: "How much is the card?",
    answer: "While an official price isn't given yet, the card is not however free but estimated cost shouldn't be more than NGN 3,000."
  }
]

const categories = ["All", "Technology", "Data & Security", "Usage", "Support", "API", "Pricing"]

export default function FAQClient() {
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
            {searchTerm && <> for <em>{searchTerm}</em></>}
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
          <h3>Still have questions? 🤔</h3>
          <p>Can&apos;t find what you&apos;re looking for? Our support team is here to help!</p>
          <div className="support-actions">
            <a href="https://wa.me/+2348123927685" className="support-btn primary">
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
  )
}