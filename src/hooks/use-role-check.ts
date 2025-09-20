"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export interface UserRole {
  role: "admin" | "staff" | null
  loading: boolean
  user: any
}

export function useRoleCheck() {
  const [userRole, setUserRole] = useState<UserRole>({
    role: null,
    loading: true,
    user: null,
  })
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        try {
          // Get user role from Firestore
          const roleDoc = await getDoc(doc(db, "roles", user.uid))
          const userData = await getDoc(doc(db, "users", user.uid))

          let role: "admin" | "staff" | null = "staff" // Default to staff

          if (roleDoc.exists()) {
            const roleData = roleDoc.data()
            role = roleData.role || "staff"
          }

          setUserRole({
            role,
            loading: false,
            user: {
              ...user,
              username: userData.exists() ? userData.data().username : user.email?.split("@")[0],
              fullName: userData.exists() ? userData.data().fullName : "",
            },
          })
        } catch (error) {
          console.error("Error fetching user role:", error)
          setUserRole({
            role: "staff",
            loading: false,
            user: {
              ...user,
              username: user.email?.split("@")[0],
              fullName: "",
            },
          })
        }
      } else {
        setUserRole({ role: null, loading: false, user: null })
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const redirectBasedOnRole = (targetRole?: "admin" | "staff") => {
    if (userRole.role === "admin" && !targetRole) {
      // Admin without specific target goes to role selection
      router.push("/role")
    } else if (userRole.role === "admin" && targetRole === "admin") {
      router.push("/admin")
    } else if (userRole.role === "admin" && targetRole === "staff") {
      router.push("/dashboard")
    } else if (userRole.role === "staff") {
      router.push("/dashboard")
    }
  }

  const checkAdminAccess = (redirectPath = "/dashboard") => {
    if (userRole.role !== "admin") {
      router.push(redirectPath)
      return false
    }
    return true
  }

  return {
    ...userRole,
    redirectBasedOnRole,
    checkAdminAccess,
  }
}
