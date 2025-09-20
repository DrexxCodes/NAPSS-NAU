import type { Metadata } from "next"
import StudentIDCardClient from "./client"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

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
  createdAt: any
  status: string
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const studentDocRef = doc(db, "enrollments", slug)
    const docSnap = await getDoc(studentDocRef)

    if (docSnap.exists()) {
      const student = docSnap.data() as StudentData
      const fullName = `${student.surname}, ${student.firstName} ${student.lastName}`
      const description = `${student.surname}'s digital ID card created on NAPSS Unizik Cloud Database. An Anchor Armstrong led administration. Developed by Drexx codes`

      return {
        title: `${fullName} - Digital ID`,
        description: description,
        openGraph: {
          title: fullName,
          description: description,
          images: ["/napss.png"],
          type: "profile",
        },
        twitter: {
          card: "summary_large_image",
          title: fullName,
          description: description,
          images: ["/napss.png"],
        },
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Student Digital ID - NAPSS UNIZIK",
    description: "Digital student identification card for NAPSS UNIZIK",
  }
}

export default async function StudentIDPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <StudentIDCardClient slug={slug} />
}
