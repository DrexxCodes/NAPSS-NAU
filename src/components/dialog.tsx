"use client"

import { useEffect, useState } from "react"
import "./dialog.css"

interface StudentData {
  level: string
  surname: string
  firstName: string
  lastName: string
  registrationNumber: string
  phoneNumber: string
  dateOfBirth: string
  yearOfAdmission: string
  gender: string
  schoolEmail: string
}

// interface Level {
//   id: string
//   name: string
//   active: boolean
//   order?: number
// }

interface DialogProps {
  type: 'confirmation' | 'enrolling' | 'success' | 'error'
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  studentData?: StudentData
  selectedLevelName?: string
  error?: string
}

export default function Dialog({ 
  type, 
  isOpen, 
  onClose, 
  onConfirm, 
  studentData, 
  selectedLevelName,
  error 
}: DialogProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  useEffect(() => {
    if (type === 'enrolling' && isOpen) {
      setProgress(0)
      setCurrentStep("Validating student data...")
      
      const steps = [
        { step: "Validating student data...", duration: 800 },
        { step: "Creating enrollment record...", duration: 1200 },
        { step: "Adding to level database...", duration: 1000 },
        { step: "Generating student ID...", duration: 600 },
        { step: "Finalizing enrollment...", duration: 400 }
      ]

      let currentProgress = 0
      let stepIndex = 0

      const progressInterval = setInterval(() => {
        if (stepIndex < steps.length) {
          const currentStepData = steps[stepIndex]
          setCurrentStep(currentStepData.step)
          
          const stepProgress = 100 / steps.length
          const targetProgress = (stepIndex + 1) * stepProgress

          const progressIncrement = setInterval(() => {
            currentProgress += 2
            setProgress(Math.min(currentProgress, targetProgress))
            
            if (currentProgress >= targetProgress) {
              clearInterval(progressIncrement)
              stepIndex++
              
              if (stepIndex >= steps.length) {
                clearInterval(progressInterval)
                // Call onConfirm after animation completes
                setTimeout(() => {
                  if (onConfirm) onConfirm()
                }, 500)
              }
            }
          }, 50)
        }
      }, 100)

      return () => {
        clearInterval(progressInterval)
      }
    }
  }, [type, isOpen, onConfirm])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && type !== 'enrolling') {
      onClose()
    }
  }

  const formatStudentName = () => {
    if (!studentData) return ""
    return `${studentData.surname} ${studentData.firstName} ${studentData.lastName}`
  }

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className={`dialog ${type === 'enrolling' ? 'enrolling-dialog' : ''}`}>
        {type === 'confirmation' && (
          <>
            <div className="dialog-header">
              <div className="greeting-emoji">👋</div>
              <h3>Wagwan, {studentData?.firstName}!</h3>
            </div>
            
            <div className="confirmation-content">
              <p className="confirmation-intro">
                Please confirm your enrollment details below:
              </p>
              
              <div className="student-card">
                <div className="student-avatar">
                  <span>{studentData?.firstName?.charAt(0)}{studentData?.surname?.charAt(0)}</span>
                </div>
                
                <div className="student-details">
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{formatStudentName()}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Level:</span>
                    <span className="detail-value level-badge">{selectedLevelName}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Registration Number:</span>
                    <span className="detail-value reg-number">{studentData?.registrationNumber}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{studentData?.schoolEmail}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{studentData?.phoneNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="warning-notice">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <strong>Important Notice:</strong> This enrollment can only be done once per registration number. 
                  Please ensure all details are accurate before proceeding.
                </div>
              </div>
            </div>
            
            <div className="dialog-actions">
              <button onClick={onClose} className="dialog-btn secondary">
                <span className="btn-icon">🔍</span>
                Let me check again
              </button>
              <button onClick={onConfirm} className="dialog-btn primary">
                <span className="btn-icon">✨</span>
                All good, enroll me!
              </button>
            </div>
          </>
        )}

        {type === 'enrolling' && (
          <>
            <div className="enrolling-content">
              <div className="enrolling-animation">
                <div className="pulse-circle">
                  <div className="inner-circle">
                    <span className="enrolling-icon">🎓</span>
                  </div>
                </div>
              </div>
              
              <h3 className="enrolling-title">Enrolling {studentData?.firstName}...</h3>
              
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div className="progress-shine"></div>
                </div>
                <div className="progress-text">{Math.round(progress)}%</div>
              </div>
              
              <div className="current-step">
                <div className="step-icon">⚡</div>
                <span>{currentStep}</span>
              </div>
              
              <div className="enrolling-particles">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`particle particle-${i + 1}`}></div>
                ))}
              </div>
            </div>
          </>
        )}

        {type === 'success' && (
          <>
            <div className="success-animation">
              <div className="success-checkmark">
                <div className="check-icon">✅</div>
                <div className="success-ripple"></div>
              </div>
            </div>
            
            <div className="success-content">
              <h3 className="success-title">Enrollment Successful! 🎉</h3>
              
              <div className="success-message">
                <p>
                  <strong>{formatStudentName()}</strong> has been successfully enrolled 
                  in <span className="level-highlight">{selectedLevelName}</span>
                </p>
              </div>
              
              <div className="success-details">
                <div className="detail-chip">
                  <span className="chip-label">Registration ID:</span>
                  <span className="chip-value">{studentData?.registrationNumber}</span>
                </div>
                <div className="detail-chip">
                  <span className="chip-label">Academic Level:</span>
                  <span className="chip-value">{selectedLevelName}</span>
                </div>
                <div className="detail-chip">
                  <span className="chip-label">Status:</span>
                  <span className="chip-value status-active">Active</span>
                </div>
              </div>
              
              <div className="next-steps">
                <h4>What&apos;s Next?</h4>
                <ul>
                  <li>📧 Wait for email confirmation when virtual ID is available</li>
                  <li>🎟 Sign up on Spotix if you're yet to</li>
                  <li>📣 Stay tuned for the date we start encoding smart ID</li>
                </ul>
              </div>
            </div>
            
            <div className="dialog-actions">
              <button onClick={onClose} className="dialog-btn primary full-width">
                <span className="btn-icon">🚀</span>
                Awesome, let&apos;s go!
              </button>
            </div>
          </>
        )}

        {type === 'error' && (
          <>
            <div className="error-animation">
              <div className="error-icon">❌</div>
            </div>
            
            <div className="error-content">
              <h3 className="error-title">Enrollment Failed</h3>
              <p className="error-message">{error}</p>
              
              <div className="error-suggestions">
                <h4>What you can do:</h4>
                <ul>
                  {error?.includes("already been enrolled") ? (
                    <>
                      <li>Double-check your registration number for typos</li>
                      <li>Contact the registrar if you believe this is an error</li>
                      <li>Use a different registration number if this is a new enrollment</li>
                      <li>Check if you&apos;ve already completed enrollment previously</li>
                    </>
                  ) : (
                    <>
                      <li>Check your internet connection</li>
                      <li>Verify all form fields are correctly filled</li>
                      <li>Try again in a few minutes</li>
                      <li>Contact support if the problem persists</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="dialog-actions">
              <button onClick={onClose} className="dialog-btn primary">
                <span className="btn-icon">🔄</span>
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}