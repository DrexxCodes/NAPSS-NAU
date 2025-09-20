import { type NextRequest, NextResponse } from "next/server"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ApiKeyData {
  id: string
  name: string
  isBanned: boolean
  createdAt: any
  lastUsed: any
  requestCount: number
  logs: ApiLog[]
}

interface ApiLog {
  studentId: string
  response: string
  timestamp: any
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
  createdAt: any
  status: string
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
    const logTime = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp)
    return logTime > oneMinuteAgo
  })
  
  return recentRequests.length >= 5
}

// Helper to create error response
const createErrorResponse = (message: string, statusCode: number, details?: any) => {
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
const createSuccessResponse = (data: any) => {
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
      timestamp: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    const apiKeyRef = doc(db, "Api", apiKeyId)
    await updateDoc(apiKeyRef, {
      logs: arrayUnion(logEntry),
      lastUsed: new Date(),
      requestCount: (await getDoc(apiKeyRef)).data()?.requestCount + 1 || 1
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
      const isBrowser = userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari') || userAgent.includes('Firefox')
      
      // If accessed from browser, return HTML with metadata
      if (isBrowser) {
        const welcomeHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>IDMS API v1</title>
            <meta name="description" content="NAPSS Unizik Identity Management System API v1.0 - Secure student data access with API key authentication">
            
            <!-- Open Graph / Facebook -->
            <meta property="og:type" content="website">
            <meta property="og:title" content="IDMS API v1 - NAPSS Unizik">
            <meta property="og:description" content="Identity Management System API for secure student data access">
            <meta property="og:site_name" content="NAPSS Unizik IDMS">
            
            <!-- Twitter -->
            <meta property="twitter:card" content="summary">
            <meta property="twitter:title" content="IDMS API v1">
            <meta property="twitter:description" content="NAPSS Unizik Identity Management System API">
            
            <!-- API Metadata -->
            <meta name="api-version" content="1.0.0">
            <meta name="api-name" content="NAPSS Unizik IDMS API">
            <meta name="developer" content="Drexx codes">
            <meta name="administration" content="Anchor Armstrong led administration">
            
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                line-height: 1.6;
              }
              
              .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                border-radius: 24px;
                padding: 3rem;
                max-width: 800px;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
              }
              
              .header {
                text-align: center;
                margin-bottom: 2rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding-bottom: 2rem;
              }
              
              .api-title {
                font-size: 2.5rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              
              .api-subtitle {
                font-size: 1.2rem;
                opacity: 0.9;
                margin-bottom: 1rem;
              }
              
              .version-badge {
                background: linear-gradient(135deg, #00b894, #00a085);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                font-size: 0.9rem;
                font-weight: 600;
                display: inline-block;
              }
              
              .welcome-message {
                font-size: 1.1rem;
                text-align: center;
                margin-bottom: 2rem;
                opacity: 0.9;
              }
              
              .api-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
              }
              
              .info-card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                padding: 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .info-card h3 {
                color: #ffeaa7;
                font-size: 1rem;
                font-weight: 700;
                margin-bottom: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              
              .info-card p, .info-card ul {
                font-size: 0.95rem;
                opacity: 0.9;
              }
              
              .info-card ul {
                list-style: none;
                padding-left: 0;
              }
              
              .info-card li {
                padding: 0.25rem 0;
                padding-left: 1rem;
                position: relative;
              }
              
              .info-card li::before {
                content: "→";
                position: absolute;
                left: 0;
                color: #00b894;
                font-weight: bold;
              }
              
              .example-section {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 16px;
                padding: 1.5rem;
                margin: 2rem 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              
              .example-section h3 {
                color: #ffeaa7;
                font-size: 1.1rem;
                margin-bottom: 1rem;
                font-weight: 700;
              }
              
              .code-block {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 8px;
                padding: 1rem;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                color: #a7f3d0;
                margin: 0.5rem 0;
                word-break: break-all;
                border-left: 4px solid #00b894;
              }
              
              .footer {
                text-align: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                opacity: 0.8;
              }
              
              .footer p {
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
              }
              
              .highlight {
                color: #00b894;
                font-weight: 600;
              }
              
              @media (max-width: 768px) {
                .container {
                  padding: 2rem 1.5rem;
                }
                
                .api-title {
                  font-size: 2rem;
                }
                
                .api-info {
                  grid-template-columns: 1fr;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 class="api-title">IDMS API</h1>
                <p class="api-subtitle">Identity Management System</p>
                <span class="version-badge">Version 1.0.0</span>
              </div>
              
              <p class="welcome-message">
                Oh, Hi there, I am the NAPSS Unizik IDMS API. IDMS means Identity Management System. 
                Go ahead and grab a key and let's talk json.
              </p>
              
              <div class="api-info">
                <div class="info-card">
                  <h3>Authentication</h3>
                  <p>API Key required for all requests</p>
                  <ul>
                    <li>Rate limited to 5 requests/minute</li>
                    <li>Key validation with ban checking</li>
                    <li>Request logging and monitoring</li>
                  </ul>
                </div>
                
                <div class="info-card">
                  <h3>Endpoints</h3>
                  <p>Student data access endpoint:</p>
                  <ul>
                    <li>GET /api/v1/id</li>
                    <li>Parameters: key, id</li>
                    <li>Response: JSON format</li>
                  </ul>
                </div>
                
                <div class="info-card">
                  <h3>Response Data</h3>
                  <p>Student information includes:</p>
                  <ul>
                    <li>Personal details</li>
                    <li>Academic information</li>
                    <li>Calculated current class</li>
                    <li>Contact information</li>
                  </ul>
                </div>
              </div>
              
              <div class="example-section">
                <h3>📝 Usage Example</h3>
                <p><strong>Request:</strong></p>
                <div class="code-block">
                  GET /api/v1/id?key=your-api-key&id=CSC2020001
                </div>
                
                <p><strong>Response:</strong></p>
                <div class="code-block">
{
  "success": true,
  "data": {
    "firstName": "John",
    "surname": "Doe",
    "currentClass": "300 Level",
    "registrationNumber": "CSC2020001",
    "schoolEmail": "john.doe@student.unizik.edu.ng",
    ...
  }
}
                </div>
              </div>
              
              <div class="footer">
                <p>🔧 Developed by <span class="highlight">Drexx codes</span></p>
                <p>🏛️ <span class="highlight">Anchor Armstrong</span> led administration</p>
                <p>🏫 NAPSS Unizik Digital Services</p>
              </div>
            </div>
          </body>
        </html>
        `
        
        return new NextResponse(welcomeHtml, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-API-Version': '1.0.0',
            'X-API-Name': 'NAPSS Unizik IDMS API'
          }
        })
      }
      
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
    const responseData = {
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
export async function POST(request: NextRequest) {
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
export async function PUT(request: NextRequest) {
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
export async function DELETE(request: NextRequest) {
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
export async function PATCH(request: NextRequest) {
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
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-API-Status': 'healthy',
      'X-API-Version': '1.0.0',
      'X-Rate-Limit': '5 requests per minute'
    }
  })
}