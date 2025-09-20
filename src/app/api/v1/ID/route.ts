import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ApiKeyData {
  id: string
  name: string
  isBanned: boolean
  createdAt: { seconds: number; nanoseconds: number } | null
  lastUsed: { seconds: number; nanoseconds: number } | null
  requestCount: number
  logs: ApiLog[]
}

interface ApiLog {
  studentId: string
  response: string
  timestamp: { seconds: number; nanoseconds: number } | null
  ipAddress?: string
  userAgent?: string
}

interface StudentData {
  surname: string
  firstName: string
  lastName: string
  gender: string
  phoneNumber: string
  schoolEmail: string
  registrationNumber: string
  yearOfAdmission: string
  dateOfBirth: string
  level: string
  createdAt: unknown
  status: string
}

interface ErrorDetails {
  [key: string]: unknown
}

interface ResponseData {
  [key: string]: unknown
}

// Function to calculate current class based on admission year
const calculateCurrentClass = (yearOfAdmission: string): string => {
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

// Rate limiting helper
const checkRateLimit = (logs: ApiLog[]): boolean => {
  const now = new Date()
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
  
  // Count requests in the last minute
  const recentRequests = logs.filter(log => {
    let logTime: Date | null = null
    if (log.timestamp && typeof log.timestamp.seconds === "number" && typeof log.timestamp.nanoseconds === "number") {
      logTime = new Date(log.timestamp.seconds * 1000 + Math.floor(log.timestamp.nanoseconds / 1000000))
    } else if (log.timestamp) {
      logTime = new Date(log.timestamp as unknown as string | number | Date)
    }
    return logTime && logTime > oneMinuteAgo
  })
  
  return recentRequests.length >= 5
}

// Helper to create error response
const createErrorResponse = (message: string, statusCode: number, details?: ErrorDetails) => {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: statusCode,
        timestamp: new Date().toISOString(),
        ...details
      }
    },
    { status: statusCode }
  )
}

// Helper to create success response
const createSuccessResponse = (data: ResponseData) => {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      api: {
        name: "NAPSS Unizik IDMS API",
        version: "1.0.0",
        description: "Identity Management System API"
      }
    },
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Version': '1.0.0',
        'X-Rate-Limit': '5 requests per minute'
      }
    }
  )
}

// Helper to log request
const logRequest = async (apiKeyId: string, studentId: string, response: string, request: NextRequest) => {
  try {
    const logEntry: ApiLog = {
      studentId,
      response,
      timestamp: (() => {
        const now = Date.now();
        return {
          seconds: Math.floor(now / 1000),
          nanoseconds: (now % 1000) * 1000000
        };
      })(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    const apiKeyRef = doc(db, "Api", apiKeyId)
    const currentDoc = await getDoc(apiKeyRef)
    const currentData = currentDoc.data()
    
    await updateDoc(apiKeyRef, {
      logs: arrayUnion(logEntry),
      lastUsed: new Date(),
      requestCount: (currentData?.requestCount as number || 0) + 1
    })
  } catch (error) {
    console.error("Error logging request:", error)
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get("key")
  const studentId = searchParams.get("id")
  
  // Get all parameters to check for foreign ones
  const allowedParams = ['key', 'id']
  const allParams = Array.from(searchParams.keys())
  const foreignParams = allParams.filter(param => !allowedParams.includes(param))

  try {
    // Check for foreign parameters
    if (foreignParams.length > 0) {
      return createErrorResponse(
        "All was going well till you added one wrong parameter. Have you read my docs? Oya go read am",
        400,
        { 
          foreignParameters: foreignParams,
          allowedParameters: allowedParams,
          tip: "Only 'key' and 'id' parameters are allowed"
        }
      )
    }

    // Check if no API key provided (welcome message with HTML for browser)
    if (!apiKey) {
      const userAgent = request.headers.get('user-agent') || ''
      userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Firefox')
      
      
      // For API clients (JSON response)
      return NextResponse.json(
        {
          message: "Oh, Hi there, I am the NAPSS Unizik IDMS API. IDMS means Identity Management System. Go ahead and grab a key and let's talk json.",
          api: {
            name: "NAPSS Unizik IDMS API",
            version: "1.0.0",
            description: "Identity Management System for student data access",
            endpoints: {
              student: "/api/v1/id?key=YOUR_API_KEY&id=STUDENT_ID"
            },
            rateLimit: "5 requests per minute per API key",
            requiredParameters: ["key", "id"],
            developer: "Drexx codes",
            administration: "Anchor Armstrong led administration"
          },
          documentation: {
            baseUrl: "https://yoursite.com/api/v1/id",
            authentication: "API Key required",
            responseFormat: "JSON",
            example: {
              request: "/api/v1/id?key=your-api-key&id=CSC2020001",
              response: {
                success: true,
                data: {
                  firstName: "John",
                  surname: "Doe",
                  currentClass: "300 Level"
                }
              }
            }
          }
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Version': '1.0.0',
            'X-API-Name': 'NAPSS Unizik IDMS API'
          }
        }
      )
    }

    // Check if student ID is provided
    if (!studentId) {
      return createErrorResponse(
        "Student ID is required. Please provide the 'id' parameter.",
        400,
        {
          requiredParameters: ["key", "id"],
          example: "/api/v1/id?key=your-api-key&id=CSC2020001"
        }
      )
    }

    // Validate API key
    const apiKeyRef = doc(db, "Api", apiKey)
    const apiKeySnap = await getDoc(apiKeyRef)

    if (!apiKeySnap.exists()) {
      return createErrorResponse(
        "Huh? Either I'm tripping or your API key is wrong, check if it exists",
        401,
        {
          providedKey: apiKey.substring(0, 8) + "...", // Show partial key for debugging
          tip: "Double-check your API key or contact support to get a new one"
        }
      )
    }

    const apiKeyData = apiKeySnap.data() as ApiKeyData

    // Check if API key is banned
    if (apiKeyData.isBanned) {
      return createErrorResponse(
        "Aw sorry dawg, looks like your key is banned. You can't access the IDMS API",
        403,
        {
          keyId: apiKey.substring(0, 8) + "...",
          contactSupport: "Contact support if you believe this is an error"
        }
      )
    }

    // Check rate limiting
    if (checkRateLimit(apiKeyData.logs || [])) {
      await logRequest(apiKey, studentId, "RATE_LIMITED", request)
      
      return createErrorResponse(
        "Uhhhhh, NO! Who are you sending all this request to? Can't be me. You're in timeout! try in a minute",
        429,
        {
          rateLimit: "5 requests per minute",
          resetTime: "60 seconds",
          tip: "Slow down there, speed racer! Wait a minute before your next request"
        }
      )
    }

    // Fetch student data
    const studentDocRef = doc(db, "enrollments", studentId)
    const studentSnap = await getDoc(studentDocRef)

    if (!studentSnap.exists()) {
      await logRequest(apiKey, studentId, "STUDENT_NOT_FOUND", request)
      
      return createErrorResponse(
        "Hmmm, can't seem to find this ID. Sure this belongs to a NAPSSITE?",
        404,
        {
          searchedId: studentId,
          tip: "Double-check the student registration number"
        }
      )
    }

    const studentData = studentSnap.data() as StudentData

    // Calculate current class
    const currentClass = calculateCurrentClass(studentData.yearOfAdmission)

    // Prepare response data (only specified fields)
    const responseData: ResponseData = {
      createdAt: studentData.createdAt,
      dateOfBirth: studentData.dateOfBirth,
      firstName: studentData.firstName,
      gender: studentData.gender,
      lastName: studentData.lastName,
      phoneNumber: studentData.phoneNumber,
      registrationNumber: studentData.registrationNumber,
      schoolEmail: studentData.schoolEmail,
      surname: studentData.surname,
      yearOfAdmission: studentData.yearOfAdmission,
      currentClass: currentClass
    }

    // Log successful request
    await logRequest(apiKey, studentId, "SUCCESS", request)

    return createSuccessResponse(responseData)

  } catch (error) {
    console.error("IDMS API Error:", error)
    
    // Log error request if we have the API key
    if (apiKey) {
      await logRequest(apiKey, studentId || "unknown", "SERVER_ERROR", request)
    }
    
    return createErrorResponse(
      "Oops! Something went wrong on our end. Our engineers have been notified.",
      500,
      {
        errorId: `ERR_${Date.now()}`,
        tip: "Try again in a few moments, or contact support if the issue persists"
      }
    )
  }
}

// Handle POST requests (not allowed)
export async function POST() {
  return createErrorResponse(
    "POST method not allowed. This API only accepts GET requests.",
    405,
    {
      allowedMethods: ["GET"],
      tip: "Use GET request with query parameters instead"
    }
  )
}

// Handle PUT requests (not allowed)
export async function PUT() {
  return createErrorResponse(
    "PUT method not allowed. This API only accepts GET requests.",
    405,
    {
      allowedMethods: ["GET"],
      tip: "Use GET request with query parameters instead"
    }
  )
}

// Handle DELETE requests (not allowed)
export async function DELETE() {
  return createErrorResponse(
    "DELETE method not allowed. This API only accepts GET requests.",
    405,
    {
      allowedMethods: ["GET"],
      tip: "Use GET request with query parameters instead"
    }
  )
}

// Handle PATCH requests (not allowed)  
export async function PATCH() {
  return createErrorResponse(
    "PATCH method not allowed. This API only accepts GET requests.",
    405,
    {
      allowedMethods: ["GET"],
      tip: "Use GET request with query parameters instead"
    }
  )
}

// Handle HEAD requests (for API health checks)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-API-Status': 'healthy',
      'X-API-Version': '1.0.0',
      'X-Rate-Limit': '5 requests per minute'
    }
  })
}