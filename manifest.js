/**
 * ============================================================================
 * MANIFEST.JS - CORE CONFIGURATION & STATE MANAGEMENT (PHASE 2)
 * ============================================================================
 */

const AppManifest = {
    // 1. App Metadata (PWA Ready)
    metadata: {
        appName: "School Help Desk AI",
        shortName: "School AI",
        version: "2.0.0-rag-streaming",
        environment: "development"
    },

    // 2. Advanced System Configuration
    systemConfig: {
        aiEngine: {
            activeProvider: "gemini",
            isStreamingEnabled: true, // Enables the live typing effect
            providers: {
                gemini: {
                    modelId: "gemini-2.5-flash",
                    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/",
                    apiKeys: ["YOUR_KEY_1", "YOUR_KEY_2"], 
                    currentKeyIndex: 0
                }
            }
        },
        rateLimits: {
            enabled: true,
            maxRequestsPerDay: 50,
            cooldownSeconds: 3 
        },
        ragSystem: {
            enabled: true,
            isKbActive: true, // Knowledge base toggle state
            searchDelayMs: 1200 // Mock delay for searching database
        }
    },

    // 3. Global App State
    state: {
        isGenerating: false,
        currentTheme: "light-mode",
        activeChatId: null,
        chatMemory: [],
        uploadedImage: { base64: null, mimeType: null }
    },

    // 4. UI Text & Localization
    uiText: {
        typewriter: "ASK ANYTHING ABOUT THE SCHOOL... ",
        charLimit: 2000,
        loadingStatus: "AI is thinking...",
        offlineMsg: "Connection restored! 🚀 Ready to assist.",
        ragSearching: "Searching school knowledge base..."
    },

    // 5. RAG Mock Knowledge Base (Instead of simple responses, these have citations)
    knowledgeBase: {
        "Admission Process": {
            text: "Our admission process is completely online. You need to submit the birth certificate, previous academic records, and proof of residence. \n\n**Steps:**\n1. Fill online form.\n2. Upload documents.\n3. Pay registration fee.\n\nThe minimum age for Grade 1 is 6 years as of March 31st.",
            citation: "Admission Guidelines 2026.pdf"
        },
        "Exam Schedules": {
            text: "The mid-term examinations are scheduled to begin on **October 15th**. \n\n> Note: Detailed datesheets will be published on the notice board next week.",
            citation: "Academic Calendar 26-27"
        },
        "Fee & Payment": {
            text: "Tuition fees are payable quarterly. You can use our secure online payment portal via:\n* Credit/Debit Card\n* UPI\n* Net Banking\n\n`Late fee of ₹50/day applies after the 10th.`",
            citation: "Fee Structure Policy"
        },
        "Study Materials": {
            text: "The updated syllabus for the current academic year is available in the student portal under the **Resources** tab.",
            citation: "Student Portal Guide"
        },
        "Transport Routes": {
            text: "We operate 25 bus routes across the city. All buses are equipped with GPS tracking and female attendants.",
            citation: "Transport Dept Manual"
        },
        "Sports & Clubs": {
            text: "We offer various extracurriculars:\n\n| Sport/Club | Days | Timings |\n|---|---|---|\n| Basketball | Mon, Wed | 3 PM - 5 PM |\n| Robotics | Friday | 2 PM - 4 PM |\n| Swimming | Tue, Thu | 3 PM - 5 PM |",
            citation: "Sports & Extracurriculars Board"
        },
        "Faculty Directory": {
            text: "Our faculty comprises highly qualified professionals. You can schedule a parent-teacher meeting through the portal by selecting the respective subject teacher.",
            citation: "Staff Directory 2026"
        },
        "Announcements": {
            text: "🔔 **Latest Announcement:** Tomorrow is a declared holiday on account of the state festival. Normal classes will resume the day after.",
            citation: "Principal's Desk"
        },
        "Canteen Menu": {
            text: "The canteen operates from 8:00 AM to 3:00 PM. We focus on nutritious, balanced meals. The monthly meal plan subscription is available at the counter.",
            citation: "Cafeteria Guidelines"
        },
        "General Help": {
            text: "I am the School AI Assistant. I can help you with admissions, fees, schedules, and general inquiries. How can I assist you today?",
            citation: "System Prompt"
        }
    }
};

Object.freeze(AppManifest.uiText);