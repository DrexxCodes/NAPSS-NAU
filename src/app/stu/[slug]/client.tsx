"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import "../stu.css"

interface StudentData {
  surname: string
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  schoolEmail: string
  registrationNumber: string
  yearOfAdmission: string
  level: string
  stuPic?: string
  createdAt: { seconds: number; nanoseconds: number } | null
  status: string
}

interface StudentIDCardClientProps {
  slug: string
}

export default function StudentIDCardClient({ slug }: StudentIDCardClientProps) {
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to calculate current class based on admission year
  const calculateClass = (yearOfAdmission: string): string => {
    const admissionYear = Number.parseInt(yearOfAdmission)
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // getMonth() returns 0-11

    // Calculate base difference
    let classDifference = currentYear - admissionYear

    // Check if current month is September (9) or later
    if (currentMonth >= 9) {
      classDifference += 1
    }

    // Convert to level format
    const classLevel = classDifference * 100

    // Ensure it doesn't go beyond typical university levels
    if (classLevel > 500) return "Graduate"
    if (classLevel < 100) return "Pre-degree"

    return `${classLevel} Level`
  }

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!slug) return

      try {
        setLoading(true)
        const studentDocRef = doc(db, "enrollments", slug)
        const docSnap = await getDoc(studentDocRef)

        if (docSnap.exists()) {
          const data = docSnap.data() as StudentData
          setStudent(data)
          setError(null)
        } else {
          setStudent(null)
          setError("not_found")
        }
      } catch (err) {
        console.error("Error fetching student data:", err)
        setError("fetch_error")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [slug])

  if (loading) {
    return (
      <div className="student-id-page">
        <div className="loading-container">
          <div className="id-card-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-logo"></div>
              <div className="skeleton-title"></div>
            </div>
            <div className="skeleton-photo"></div>
            <div className="skeleton-content">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line medium"></div>
            </div>
          </div>
          <div className="loading-text">
            <div className="loading-spinner"></div>
            <p>Retrieving student information...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error === "not_found") {
    return (
      <div className="student-id-page">
        <div className="error-container">
          <div className="error-icon">🤔</div>
          <h2 className="error-title">Hmmm, looks like they&apos;re not on here.</h2>
          <p className="error-message">Either they never enrolled or they&apos;re not a NAPSSITE.</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="retry-btn">
              🔄 Try Again
            </button>
            <a href="/enrollment" className="enroll-btn">
              📝 Enroll Now
            </a>
          </div>
          <div className="search-info">
            <p>
              Searched for: <code className="search-term">{slug}</code>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error === "fetch_error") {
    return (
      <div className="student-id-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Connection Error</h2>
          <p className="error-message">
            Unable to retrieve student information. Please check your connection and try again.
          </p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  if (!student) return null

  const currentClass = calculateClass(student.yearOfAdmission)

  return (
    <div className="student-id-page">
      <div className="id-card-container">
        <div className="digital-id-card">
          {/* Card Header */}
          <div className="card-header">
            <div className="institution-logo">
              <div className="logo-circle">
                <span className="logo-text">NAPSS</span>
              </div>
            </div>
            <div className="institution-info">
              <h1 className="institution-name">NAPSS UNIZIK</h1>
              <p className="card-type">Student Digital ID</p>
            </div>
            <div className="nfc-indicator">
              <div className="nfc-symbol">📶</div>
              <span className="nfc-text">NFC</span>
            </div>
          </div>

          {/* Student Photo */}
          <div className="photo-section">
            <div className="photo-container">
              <Image
                src={student.stuPic || "/pfp.png"}
                alt={`${student.firstName} ${student.surname}`}
                className="student-photo"
                width={150}
                height={150}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/pfp.png"
                }}
              />
              <div className="photo-border"></div>
            </div>
          </div>

          {/* Student Information */}
          <div className="student-info">
            <div className="name-section">
              <h2 className="student-name">
                {student.surname.toUpperCase()}, {student.firstName} {student.lastName}
              </h2>
            </div>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Registration No:</span>
                <span className="info-value reg-number">{student.registrationNumber}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Class:</span>
                <span className="info-value class-badge">{currentClass}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Gender:</span>
                <span className="info-value">{student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{student.phoneNumber}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value email">{student.schoolEmail}</span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="card-footer">
            <div className="security-features">
              <div className="security-item">
                <span className="security-icon">🔒</span>
                <span className="security-text">Encrypted</span>
              </div>
              <div className="security-item">
                <span className="security-icon">✅</span>
                <span className="security-text">Verified</span>
              </div>
              <div className="security-item">
                <span className="security-icon">📱</span>
                <span className="security-text">NFC Ready</span>
              </div>
            </div>

            <div className="validity-info">
              <p className="validity-text">
                Status: <span className="status-active">{student.status.toUpperCase()}</span>
              </p>
              <p className="issued-text">Issued: {new Date().getFullYear()}</p>
            </div>
          </div>

          {/* Holographic Effect */}
          <div className="holographic-overlay"></div>
        </div>

        {/* Additional Info */}
        <div className="card-actions">
          <button className="action-btn share-btn">
            <span className="btn-icon">🔗</span>
            Share ID
          </button>
          <button className="action-btn print-btn" onClick={() => window.print()}>
            <span className="btn-icon">🖨️</span>
            Print
          </button>
          <button className="action-btn download-btn">
            <span className="btn-icon">💾</span>
            Save
          </button>
        </div>

        {/* Powered By */}
        <div className="powered-by">
          <p>
            🛡️ Secured by <strong>Cyblack Systems</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
