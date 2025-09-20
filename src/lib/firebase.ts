import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)

// Type definitions
interface Level {
  id: string
  name: string
  order?: number
  [key: string]: unknown
}

interface StudentData {
  registrationNumber: string
  level: string
  surname: string
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  schoolEmail: string
  yearOfAdmission: string
  dateOfBirth: string
  createdAt: Date
  status: string
  [key: string]: unknown
}

// Firebase functions for enrollment
export const fetchLevels = async (): Promise<Level[]> => {
  try {
    const levelsRef = collection(db, "Levels")
    const querySnapshot = await getDocs(levelsRef)

    const levels: Level[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Level))

    // Sort levels by order if available, otherwise by name
    return levels.sort((a: Level, b: Level) => {
      if (a.order && b.order) {
        return a.order - b.order
      }
      return a.name?.localeCompare(b.name) || 0
    })
  } catch (error) {
    console.error("Error fetching levels:", error)
    throw error
  }
}

// Check if registration number already exists
export const checkRegistrationExists = async (registrationNumber: string): Promise<boolean> => {
  try {
    const enrollmentDocRef = doc(db, "enrollments", registrationNumber)
    const docSnap = await getDoc(enrollmentDocRef)
    return docSnap.exists()
  } catch (error) {
    console.error("Error checking registration number:", error)
    throw error
  }
}

export const submitEnrollment = async (studentData: StudentData): Promise<{ id: string; success: boolean }> => {
  try {
    const { registrationNumber, level } = studentData
    
    // First check if registration number already exists
    const exists = await checkRegistrationExists(registrationNumber)
    if (exists) {
      throw new Error(`Registration number ${registrationNumber} has already been enrolled. Each student can only be enrolled once.`)
    }
    
    const enrollmentData: StudentData = {
      ...studentData,
      createdAt: new Date(),
      status: "pending",
    }

    // Create document in enrollments collection using registration number as doc ID
    const enrollmentDocRef = doc(db, "enrollments", registrationNumber)
    await setDoc(enrollmentDocRef, enrollmentData)

    // Create document in the selected level's students subcollection
    const levelStudentDocRef = doc(db, "Levels", level, "students", registrationNumber)
    await setDoc(levelStudentDocRef, enrollmentData)

    return { id: registrationNumber, success: true }
  } catch (error) {
    console.error("Error submitting enrollment:", error)
    throw error
  }
}

export default app