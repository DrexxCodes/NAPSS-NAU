"use client"

import { useState, useEffect } from "react"
import { fetchLevels, submitEnrollment, checkRegistrationExists } from "@/lib/firebase"
import Dialog from "./dialog"
import "./enrollment-form.css"

// Extend Window interface for the timeout
declare global {
  interface Window {
    regValidationTimeout?: NodeJS.Timeout
  }
}

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

interface Level {
  id: string
  name: string
  active: boolean
  order?: number
}

export default function EnrollmentForm() {
  const [selectedLevel, setSelectedLevel] = useState("")
  const [showFields, setShowFields] = useState(false)
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoadingLevels, setIsLoadingLevels] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regNumberError, setRegNumberError] = useState<string | null>(null)
  const [isCheckingReg, setIsCheckingReg] = useState(false)
  
  // Dialog states
  const [dialogState, setDialogState] = useState<{
    type: 'confirmation' | 'enrolling' | 'success' | 'error'
    isOpen: boolean
  }>({
    type: 'confirmation',
    isOpen: false
  })

  const [formData, setFormData] = useState<StudentData>({
    level: "",
    surname: "",
    firstName: "",
    lastName: "",
    registrationNumber: "",
    phoneNumber: "",
    dateOfBirth: "",
    yearOfAdmission: "",
    gender: "",
    schoolEmail: "",
  })

  useEffect(() => {
    const loadLevels = async () => {
      try {
        setIsLoadingLevels(true)
        const fetchedLevels = await fetchLevels()
        setLevels(fetchedLevels as Level[])
        setError(null)
      } catch (err) {
        console.error("Failed to fetch levels:", err)
        setError("Failed to load levels. Please refresh the page.")
        // Fallback levels with proper structure
        setLevels([
          { id: "100", name: "100 Level", active: true, order: 1 },
          { id: "200", name: "200 Level", active: true, order: 2 },
          { id: "300", name: "300 Level", active: false, order: 3 },
          { id: "400", name: "400 Level", active: true, order: 4 },
          { id: "500", name: "500 Level", active: true, order: 5 },
        ])
      } finally {
        setIsLoadingLevels(false)
      }
    }

    loadLevels()
  }, [])

  const handleLevelChange = (levelId: string) => {
    setSelectedLevel(levelId)
    setFormData((prev) => ({ ...prev, level: levelId }))
    setShowFields(true)
  }

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Clear any existing registration number errors when user starts typing
    if (regNumberError && field === 'registrationNumber') {
      setRegNumberError(null)
    }
  }

  // Function to validate registration number format and check if it exists
  const validateRegistrationNumber = async (regNumber: string) => {
    if (!regNumber.trim()) return true // Allow empty during typing
    
    // Check format first
    if (!regNumber.match(/^[A-Z0-9\/]+$/)) {
      setRegNumberError("Registration number should only contain uppercase letters, numbers, and forward slashes.")
      return false
    }
    
    // Check if it already exists in database
    try {
      setIsCheckingReg(true)
      const exists = await checkRegistrationExists(regNumber)
      if (exists) {
        setRegNumberError(`This registration number is already enrolled`)
        return false
      }
      setRegNumberError(null)
      return true
    } catch (err) {
      console.error("Error checking registration number:", err)
      setRegNumberError("Unable to verify registration number. Please try again.")
      return false
    } finally {
      setIsCheckingReg(false)
    }
  }

  // Debounced registration number validation
  const handleRegistrationChange = async (value: string) => {
    const upperValue = value.toUpperCase()
    handleInputChange("registrationNumber", upperValue)
    
    // Only validate if the field has a value and user has stopped typing
    if (upperValue.length > 0) {
      // Clear previous timeout
      if (window.regValidationTimeout) {
        clearTimeout(window.regValidationTimeout)
      }
      
      // Set new timeout for validation
      window.regValidationTimeout = setTimeout(() => {
        validateRegistrationNumber(upperValue)
      }, 1000) // Wait 1 second after user stops typing
    }
  }

  const isFormValid = () => {
    return (
      formData.level &&
      formData.surname.trim() &&
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.registrationNumber.trim() &&
      formData.phoneNumber.trim() &&
      formData.dateOfBirth &&
      formData.yearOfAdmission &&
      formData.gender &&
      formData.schoolEmail.trim()
    )
  }

  const handleEnrollClick = async () => {
    if (!isFormValid()) {
      setError("Please fill in all required fields.")
      return
    }
    
    // Final validation of registration number before proceeding
    const isValidReg = await validateRegistrationNumber(formData.registrationNumber)
    if (!isValidReg) {
      return // Error is already set by validateRegistrationNumber in regNumberError
    }
    
    setError(null)
    setRegNumberError(null)
    setDialogState({ type: 'confirmation', isOpen: true })
  }

  const handleConfirmEnrollment = () => {
    setDialogState({ type: 'enrolling', isOpen: true })
  }

  const handleActualSubmit = async () => {
    try {
      const result = await submitEnrollment(formData)
      console.log("Enrollment successful:", result)
      
      // Show success dialog
      setDialogState({ type: 'success', isOpen: true })
      
      // Reset form after successful submission
      setFormData({
        level: "",
        surname: "",
        firstName: "",
        lastName: "",
        registrationNumber: "",
        phoneNumber: "",
        dateOfBirth: "",
        yearOfAdmission: "",
        gender: "",
        schoolEmail: "",
      })
      setSelectedLevel("")
      setShowFields(false)
    } catch (error: any) {
      console.error("Enrollment failed:", error)
      
      // Handle specific error cases with more detailed messages
      let errorMessage = "Failed to submit enrollment. Please try again."
      if (error.message) {
        if (error.message.includes("already been enrolled")) {
          errorMessage = error.message // Use the specific error message from Firebase
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your internet connection and try again."
        } else if (error.message.includes("permission")) {
          errorMessage = "Access denied. Please contact the administrator."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
      setDialogState({ type: 'error', isOpen: true })
    }
  }

  const handleCloseDialog = () => {
    setDialogState({ type: 'confirmation', isOpen: false })
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push(i)
    }
    return years
  }

  const getSelectedLevelName = () => {
    const level = levels.find(l => l.id === selectedLevel)
    return level ? level.name : ""
  }

  return (
    <div className="enrollment-form">
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button 
            className="error-dismiss" 
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="level" className="form-label">
          Select your level *
        </label>
        <select
          id="level"
          value={selectedLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
          className="form-select"
          required
          disabled={isLoadingLevels}
        >
          <option value="">
            {isLoadingLevels ? "Loading levels..." : "Choose your level"}
          </option>
          {levels.map((level) => (
            <option
              key={level.id}
              value={level.id}
              disabled={!level.active}
              className={!level.active ? "disabled-option" : ""}
            >
              {level.name || `Level ${level.id}`} {!level.active && "(Currently Inactive)"}
            </option>
          ))}
        </select>
        {selectedLevel && (
          <div className="selected-level-info">
            Selected: <strong>{getSelectedLevelName()}</strong>
          </div>
        )}
      </div>

      {showFields && (
        <div className="additional-fields">
          <div className="form-section-header">
            <h3>Student Information</h3>
            <p>Please fill in all required fields marked with *</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="surname" className="form-label">
                Surname *
              </label>
              <input
                type="text"
                id="surname"
                value={formData.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                className="form-input"
                placeholder="Enter surname"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="form-input"
                placeholder="Enter first name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="form-input"
                placeholder="Enter last name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="registrationNumber" className="form-label">
                Registration Number *
              </label>
              <input
                type="text"
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleRegistrationChange(e.target.value)}
                className={`form-input ${isCheckingReg ? 'checking' : ''} ${regNumberError ? 'error' : ''}`}
                placeholder="e.g., 2024134900"
                required
              />
              {isCheckingReg && (
                <div className="input-feedback checking">
                  <span className="spinner"></span>
                  Checking availability...
                </div>
              )}
              {formData.registrationNumber && !isCheckingReg && !regNumberError && (
                <div className="input-feedback success">
                  <span className="checkmark">✓</span>
                  Registration number is available
                </div>
              )}
              {regNumberError && !isCheckingReg && (
                <div className="input-feedback error">
                  <span className="error-x">✕</span>
                  {regNumberError}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="form-input"
                placeholder="e.g., +234 803 123 4567"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="form-input custom-date-picker"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="yearOfAdmission" className="form-label">
                Year of Admission *
              </label>
              <select
                id="yearOfAdmission"
                value={formData.yearOfAdmission}
                onChange={(e) => handleInputChange("yearOfAdmission", e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select year</option>
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender *
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                {/* <option value="other">Other</option> */}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="schoolEmail" className="form-label">
              School Email *
            </label>
            <input
              type="email"
              id="schoolEmail"
              value={formData.schoolEmail}
              onChange={(e) => handleInputChange("schoolEmail", e.target.value)}
              className="form-input"
              placeholder="student@unizik.edu.ng"
              required
            />
          </div>

          <button 
            type="button" 
            onClick={handleEnrollClick} 
            className={`enroll-button ${!isFormValid() ? 'disabled' : ''}`}
            disabled={!isFormValid()}
          >
            Enroll Student
          </button>
        </div>
      )}

      {/* Dialog Component */}
      <Dialog
        type={dialogState.type}
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onConfirm={dialogState.type === 'confirmation' ? handleConfirmEnrollment : dialogState.type === 'enrolling' ? handleActualSubmit : undefined}
        studentData={formData}
        selectedLevelName={getSelectedLevelName()}
        error={error ?? undefined}
      />
    </div>
  )
}