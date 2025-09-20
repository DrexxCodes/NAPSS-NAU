import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

// Function to calculate current class based on admission year
const calculateClass = (yearOfAdmission: string): string => {
  const admissionYear = parseInt(yearOfAdmission)
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

export async function GET(request: NextRequest) {
  console.log("API Route called with URL:", request.url)
  
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get("id")

  console.log("Student ID from params:", studentId)

  if (!studentId) {
    console.log("No student ID provided")
    return new NextResponse(
      JSON.stringify({ error: "Student ID is required" }), 
      { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  try {
    console.log("Attempting to fetch student with ID:", studentId)
    
    // Try to get the document from Firestore
    const studentDocRef = doc(db, "enrollments", studentId)
    const docSnap = await getDoc(studentDocRef)

    console.log("Document exists:", docSnap.exists())

    if (!docSnap.exists()) {
      console.log("Student not found in database")
      
      // Return a proper 404 response with meta tags for the not found case
      const notFoundHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Student Not Found - NAPSS UNIZIK</title>
          <meta name="description" content="Student with ID ${studentId} not found in NAPSS UNIZIK database.">
          
          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website">
          <meta property="og:url" content="${request.url}">
          <meta property="og:title" content="Student Not Found - NAPSS UNIZIK">
          <meta property="og:description" content="The requested student ID was not found in our database.">
          <meta property="og:image" content="${new URL("/napss.png", request.url).toString()}">
          <meta property="og:site_name" content="NAPSS UNIZIK Digital ID">
          
          <!-- Twitter -->
          <meta property="twitter:card" content="summary">
          <meta property="twitter:title" content="Student Not Found">
          <meta property="twitter:description" content="The requested student ID was not found.">
          
          <!-- Redirect to student page anyway (it will show the error message) -->
          <meta http-equiv="refresh" content="2; url=/stu/${studentId}">
        </head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>Student Not Found</h1>
            <p>Student ID "${studentId}" was not found in our database.</p>
            <p>Redirecting to student page...</p>
            <a href="/stu/${studentId}" style="color: #dc2626; text-decoration: none;">Click here if not redirected automatically</a>
          </div>
        </body>
      </html>
      `
      
      return new NextResponse(notFoundHtml, {
        status: 404,
        headers: {
          "Content-Type": "text/html",
        },
      })
    }

    const student = docSnap.data() as StudentData
    console.log("Student data retrieved:", student.registrationNumber)

    const fullName = `${student.surname}, ${student.firstName} ${student.lastName}`
    const currentClass = calculateClass(student.yearOfAdmission)
    const description = `${student.firstName} ${student.surname}'s digital ID card - ${currentClass} student at NAPSS UNIZIK. Created on NAPSS Unizik Cloud Database. An Anchor Armstrong led administration. Developed by Drexx codes`

    // Create a more comprehensive HTML response with better meta tags
    const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${fullName} - ${currentClass} | NAPSS UNIZIK Digital ID</title>
        <meta name="description" content="${description}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="profile">
        <meta property="og:url" content="${request.url}">
        <meta property="og:title" content="${fullName} - ${currentClass}">
        <meta property="og:description" content="${description}">
        <meta property="og:image" content="${new URL("/napss.png", request.url).toString()}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="NAPSS UNIZIK Digital ID Card">
        <meta property="og:site_name" content="NAPSS UNIZIK Digital ID">
        <meta property="og:locale" content="en_US">
        
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="${request.url}">
        <meta property="twitter:title" content="${fullName} - ${currentClass}">
        <meta property="twitter:description" content="${description}">
        <meta property="twitter:image" content="${new URL("/napss.png", request.url).toString()}">
        <meta property="twitter:image:alt" content="NAPSS UNIZIK Digital ID Card">
        
        <!-- Additional structured data -->
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "${fullName}",
          "description": "${currentClass} student at NAPSS UNIZIK",
          "affiliation": {
            "@type": "Organization",
            "name": "NAPSS UNIZIK"
          },
          "url": "${request.url}"
        }
        </script>
        
        <!-- Additional meta tags -->
        <meta name="author" content="Drexx codes">
        <meta name="keywords" content="NAPSS, UNIZIK, Digital ID, Student Card, NFC, ${student.firstName}, ${student.surname}, ${currentClass}">
        <meta name="robots" content="index, follow">
        <meta name="theme-color" content="#667eea">
        
        <!-- Canonical URL -->
        <link rel="canonical" href="/stu/${studentId}">
        
        <!-- Favicon -->
        <link rel="icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/napss.png">
        
        <!-- Redirect to actual student page -->
        <meta http-equiv="refresh" content="0; url=/stu/${studentId}">
        <script>
          // Immediate redirect
          if (typeof window !== 'undefined') {
            window.location.replace('/stu/${studentId}');
          }
        </script>
        
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 500px;
            margin: 2rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
          }
          p {
            margin-bottom: 1rem;
            opacity: 0.9;
            line-height: 1.6;
          }
          a {
            color: #ffeaa7;
            text-decoration: none;
            font-weight: 600;
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 234, 167, 0.3);
            border-radius: 8px;
            display: inline-block;
            margin-top: 1rem;
            transition: all 0.3s ease;
          }
          a:hover {
            background: rgba(255, 234, 167, 0.1);
            transform: translateY(-2px);
          }
          .student-info {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 1rem;
            margin: 1rem 0;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .class-badge {
            background: linear-gradient(135deg, #00b894, #00a085);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            font-size: 0.9rem;
            font-weight: 600;
            display: inline-block;
            margin: 0.5rem 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="spinner"></div>
          <h1>${fullName}</h1>
          <div class="student-info">
            <div class="class-badge">${currentClass}</div>
            <p><strong>Registration:</strong> ${student.registrationNumber}</p>
            <p><strong>Status:</strong> ${student.status.toUpperCase()}</p>
          </div>
          <p>Loading digital ID card...</p>
          <p><small>${description}</small></p>
          <a href="/stu/${studentId}">View Digital ID Card →</a>
        </div>
      </body>
    </html>
    `

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error fetching student data:", error)
    
    const errorHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Error - NAPSS UNIZIK Digital ID</title>
        <meta name="description" content="An error occurred while loading the student information.">
        <meta property="og:title" content="Error Loading Student Information">
        <meta property="og:description" content="There was a technical issue loading this student's digital ID.">
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
          }
          .error-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            display: inline-block;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>⚠️ Technical Error</h1>
          <p>We encountered an issue while loading the student information.</p>
          <p>Please try again later or contact support.</p>
          <a href="/stu/${studentId}" style="color: #fef3cd; text-decoration: none;">Try Loading ID Card →</a>
        </div>
      </body>
    </html>
    `
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    })
  }
}

// Add support for HEAD requests (good for SEO)
export async function HEAD(request: NextRequest) {
  const response = await GET(request)
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  })
}