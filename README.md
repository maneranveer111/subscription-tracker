# 💳 Subscription Tracker

A full-stack modern web application designed to help individuals track recurring subscriptions, eliminate unused services, forecast monthly and annual expenses, and automate renewal reminders. Powered by **React 19**, **Node.js / Express 5**, **MongoDB**, and **Google Gemini AI**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
  - [Backend Configuration](#backend-configuration-backendenv)
  - [Frontend Configuration](#frontend-configuration-frontendenv)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [API Reference](#-api-reference)
  - [Authentication Routes](#authentication-routes-apiauth)
  - [Subscription Routes](#subscription-routes-apisubscriptions)
  - [Summary & Analytics Routes](#summary--analytics-routes-apisummary)
  - [AI Insights Routes](#ai-insights-routes-apiai)
  - [Reminder Routes](#reminder-routes-apireminder--apiinternal)
- [AI Optimization Engine](#-ai-optimization-engine)
- [Automated Email Reminder System](#-automated-email-reminder-system)
- [Production Deployment](#-production-deployment)
- [License](#-license)

---

## 🌟 Overview

Recurring software subscriptions, streaming services, gym memberships, and utility bills can easily accumulate into an unmonitored financial drain. 

**Subscription Tracker** provides a centralized control hub where users can:
- View exact monthly and annual commitments at a glance.
- Receive timely notifications before cards are billed.
- Analyze spending distributions across custom categories.
- Leverage **Gemini AI** to audit usage notes and pinpoint underutilized subscriptions that should be canceled or reviewed.

---

## ✨ Key Features

### 📊 Dashboard & Financial Analytics
- **Live Cost Metrics**: Instant calculation of total monthly and yearly burn rates across all active subscriptions.
- **Spend by Category**: Visual breakdown powered by **Recharts** highlighting where recurring spend is concentrated.
- **30-Day Upcoming Renewals**: Chronologically ordered view of upcoming billing dates to prevent unexpected renewals.

### 📝 Subscription Management
- **Full CRUD Support**: Add, update, pause/activate, or delete subscriptions with instant UI feedback.
- **Smart Date Roll-Forward**: Automatic calculation of future renewal cycles (monthly or yearly) with month-end date clamping (e.g. Jan 31 rolling forward to Feb 28).
- **Customizable Alerts**: Configurable notice windows (0–30 days) per subscription to trigger email notifications before renewal.
- **Usage Tracking**: Free-form user usage logs per service to inform AI recommendations.

### 🤖 AI-Powered Cancel Recommendations
- **Gemini 3.8 Flash Integration**: Contextual analysis evaluating subscription cost, frequency, category, and usage notes.
- **Structured Action Plans**: Returns discrete action directives (`cancel`, `keep`, `review`) with plain-language rationales and projected monthly/annual savings.
- **Fault-Tolerant AI Client**: Resilient failover with retry logic, rate-limit safeguards, and automatic fallback model cascades (`gemini-3.8-flash` $\rightarrow$ `gemini-3.5-flash-lite` $\rightarrow$ `gemini-flash-latest`).

### 📧 Automated Notifications & Reminders
- **Nodemailer + Gmail Integration**: Responsive HTML email templates showing service names, renewal dates, and costs.
- **Duplicate Prevention**: Tracks `lastReminderFor` timestamps to ensure users are never alerted twice for the same billing cycle.
- **Dual Triggering Engine**:
  - Internal daemon: Scheduled daily cron job (`node-cron`) run in the user's local timezone.
  - External webhook endpoint: `/api/internal/reminders` secured by constant-time secret comparison (`x-cron-secret`) for platforms with sleeping containers (Render/Railway).
- **Google Sign-In Welcome Emails**: Automatically sends a onboarding email when new users sign in via Google OAuth.

### 🔐 Authentication & Profile Management
- **Dual Auth Strategies**: Email & Password auth with `bcryptjs` (salt factor 10) or Google One-Tap / OAuth 2.0 via `google-auth-library`.
- **JWT Session Security**: Secure JSON Web Tokens with customizable expiration windows.
- **User Profile Management**: Update personal info, username, contact number, and notification email.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Google OAuth**: `@react-oauth/google`
- **Typography**: DM Sans & Bricolage Grotesque

### Backend
- **Runtime & Framework**: [Node.js](https://nodejs.org/) (ES Modules) & [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **AI Engine**: [Google Gemini REST API](https://ai.google.dev/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Email Delivery**: [Nodemailer](https://nodemailer.com/)
- **Cron Scheduling**: [node-cron](https://www.npmjs.com/package/node-cron)
- **Security**: [JSON Web Token (jsonwebtoken)](https://jwt.io/), [bcryptjs](https://www.npmjs.com/package/bcryptjs), `cors`, `google-auth-library`

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React 19 + Vite + Tailwind v4)"]
        UI[Pages: Dashboard / Subscriptions / Insights / Profile]
        AuthContext[Auth Context & Token Storage]
        AxiosClient[Axios API Client]
        UI --> AuthContext
        UI --> AxiosClient
    end

    subgraph Server["Backend (Node.js + Express 5)"]
        Router[Express Router & Middlewares]
        AuthMiddleware[JWT / Google Auth Middleware]
        ZodValidator[Zod Schema Validation]
        
        subgraph Controllers
            AuthCtrl[authController / googleAuthController]
            SubCtrl[subscriptionController]
            SumCtrl[summaryController]
            AiCtrl[aiController]
            RemCtrl[reminderController / cronController]
        end

        subgraph Services
            GeminiSvc[geminiService (Google Gemini API)]
            EmailSvc[emailService (Nodemailer)]
            RemindSvc[reminderService]
            CronJob[node-cron Scheduler]
        end
    end

    subgraph Database["Database & External APIs"]
        MongoDB[(MongoDB Atlas)]
        GeminiAPI[Google Gemini 3.8 Flash]
        GmailSMTP[Gmail SMTP Server]
        GoogleOAuthAPI[Google OAuth 2.0]
    end

    AxiosClient -->|REST API Requests| Router
    Router --> AuthMiddleware
    Router --> ZodValidator
    
    AuthMiddleware --> AuthCtrl
    ZodValidator --> SubCtrl
    
    AuthCtrl --> MongoDB
    AuthCtrl -.->|Verify Token| GoogleOAuthAPI
    SubCtrl --> MongoDB
    SumCtrl --> MongoDB
    
    AiCtrl --> GeminiSvc
    GeminiSvc -->|REST / JSON| GeminiAPI
    
    RemCtrl --> RemindSvc
    CronJob --> RemindSvc
    RemindSvc --> MongoDB
    RemindSvc --> EmailSvc
    EmailSvc -->|SMTP TLS| GmailSMTP
```

---

## 📁 Project Directory Structure

```text
subscription-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection handler
│   │   │   └── env.js                # Environment variable loader & verification
│   │   ├── controllers/
│   │   │   ├── aiController.js       # AI cancel recommendation endpoint logic
│   │   │   ├── authController.js     # User registration, login, profile endpoints
│   │   │   ├── cronController.js     # External secure cron trigger
│   │   │   ├── googleAuthController.js # Google OAuth ID token verification
│   │   │   ├── reminderController.js # Manual reminder test controller
│   │   │   ├── subscriptionController.js # Subscriptions CRUD operations
│   │   │   └── summaryController.js  # Dashboard aggregations & category sums
│   │   ├── jobs/
│   │   │   └── reminderJob.js        # Internal node-cron background task
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT bearer token verification
│   │   │   ├── errorHandler.js       # Centralized 404 & error handlers
│   │   │   └── validate.js           # Generic Zod middleware validator
│   │   ├── models/
│   │   │   ├── Subscription.js       # Subscription Mongoose schema
│   │   │   └── User.js               # User Mongoose schema
│   │   ├── routes/
│   │   │   ├── aiRoutes.js           # /api/ai routes
│   │   │   ├── authRoutes.js         # /api/auth routes
│   │   │   ├── cronRoutes.js         # /api/internal routes
│   │   │   ├── reminderRoutes.js     # /api/reminders routes
│   │   │   ├── subscriptionRoutes.js # /api/subscriptions routes
│   │   │   └── summaryRoutes.js      # /api/summary routes
│   │   ├── services/
│   │   │   ├── emailService.js       # Nodemailer transport & HTML templates
│   │   │   ├── geminiService.js      # Gemini API prompt builder & JSON parser
│   │   │   └── reminderService.js    # Renewal check & email dispatching
│   │   ├── utils/
│   │   │   ├── asyncHandler.js       # Express async route wrapper
│   │   │   ├── costUtils.js          # Monthly equivalent & rounding helpers
│   │   │   └── dateUtils.js          # Day calculation & renewal roll-forward
│   │   ├── validators/
│   │   │   ├── authSchemas.js        # Zod registration/login schemas
│   │   │   └── subscriptionSchemas.js# Zod subscription CRUD validation schemas
│   │   ├── app.js                    # Express application configuration
│   │   └── server.js                 # HTTP listener & service bootstrapper
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   ├── aiApi.js              # AI suggestions HTTP requests
│   │   │   ├── authApi.js            # Authentication HTTP requests
│   │   │   ├── axios.js              # Configured Axios instance with interceptors
│   │   │   └── subscriptionApi.js    # Subscription & summary HTTP requests
│   │   ├── components/
│   │   │   ├── AiSuggestions.jsx     # AI recommendation card & savings display
│   │   │   ├── AuthHero.jsx          # Illustrated hero section for auth screens
│   │   │   ├── CostSummary.jsx       # Large monthly/annual expense headline
│   │   │   ├── Navbar.jsx            # Top navigation bar with active links
│   │   │   ├── ProtectedRoute.jsx    # Route guard requiring authenticated user
│   │   │   ├── RenewalList.jsx       # 30-day upcoming renewals list
│   │   │   ├── SpendChart.jsx        # Recharts responsive spending bar chart
│   │   │   ├── Spinner.jsx           # Clean loading spinner
│   │   │   ├── SubscriptionCard.jsx  # Individual subscription item card
│   │   │   └── SubscriptionForm.jsx  # Create / edit subscription modal form
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # User authentication state provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Main analytical dashboard
│   │   │   ├── Insights.jsx          # AI advice & test reminder triggers
│   │   │   ├── Login.jsx             # User sign-in screen
│   │   │   ├── Profile.jsx           # User profile and account settings
│   │   │   ├── Register.jsx          # New user registration screen
│   │   │   └── Subscriptions.jsx     # Subscriptions management & list view
│   │   ├── utils/
│   │   │   ├── constants.js          # Category lists & chart colors
│   │   │   ├── formatters.js         # Currency and date formatters
│   │   │   └── ui.js                 # Reusable Tailwind class tokens
│   │   ├── App.jsx                   # Route definition & layout wrapper
│   │   ├── index.css                 # Tailwind CSS v4 design tokens
│   │   └── main.jsx                  # React application entry point
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json                   # SPA routing rewrite rule for Vercel
│   └── vite.config.js                # Vite build configuration
│
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories following the specifications below.

### Backend Configuration (`backend/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`). |
| `PORT` | No | `5000` | Port for the Express server to listen on. |
| `MONGO_URI` | **Yes** | — | MongoDB connection string (e.g. MongoDB Atlas cluster URI). |
| `JWT_SECRET` | **Yes** | — | Secret string used to sign JSON Web Tokens (`openssl rand -hex 32`). |
| `JWT_EXPIRES_IN`| No | `7d` | Lifetime of issued authentication tokens. |
| `CLIENT_URL` | No | `http://localhost:5173`| Allowed CORS origins (comma-separated for multiple origins). |
| `GEMINI_API_KEY`| No | — | Google Gemini API key for AI cancel suggestions. |
| `GEMINI_MODEL` | No | `gemini-3.8-flash` | Primary Gemini model identifier. |
| `EMAIL_USER` | No | — | Gmail address for sending renewal notification emails. |
| `EMAIL_PASS` | No | — | Gmail 16-character **App Password** (not personal password). |
| `GOOGLE_CLIENT_ID`| No | — | Google OAuth 2.0 Web Client ID for Google Sign-In. |
| `CURRENCY` | No | `INR` | ISO 4217 Currency code (e.g., `INR`, `USD`, `EUR`). |
| `TIMEZONE` | No | `Asia/Kolkata` | IANA Timezone string for scheduling notifications. |
| `REMINDER_CRON`| No | `0 9 * * *` | Cron schedule expression (defaults to daily at 09:00 AM). |
| `CRON_SECRET` | No | — | Shared secret token passed in `x-cron-secret` for webhook cron. |

### Frontend Configuration (`frontend/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Base API endpoint URL (must end with `/api`). |
| `VITE_CURRENCY`| No | `INR` | Currency display format code (e.g. `INR`, `USD`). |
| `VITE_GOOGLE_CLIENT_ID` | No | — | Google OAuth Client ID (must match backend). |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher)
- [MongoDB](https://www.mongodb.com/) instance (local or free MongoDB Atlas cluster)
- *(Optional)* [Google Cloud Console](https://console.cloud.google.com/) OAuth Client ID
- *(Optional)* [Google AI Studio](https://aistudio.google.com/) API Key for Gemini

### 1. Clone Repository

```bash
git clone https://github.com/maneranveer111/subscription-tracker.git
cd subscription-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
# Edit .env and supply your MONGO_URI, JWT_SECRET, and optional keys

# Start development server with nodemon
npm run dev
```
The backend server starts listening at `http://localhost:5000`. Test the health check endpoint:
```bash
curl http://localhost:5000/health
# Response: {"status":"ok"}
```

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env
# Verify VITE_API_URL is set to http://localhost:5000/api

# Start Vite dev server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Reference

All protected endpoints require the following header:
```http
Authorization: Bearer <your_jwt_token>
```

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/register` | Public | Register a new account (`name`, `email`, `password`). |
| `POST` | `/login` | Public | Authenticate user with credentials (`email`, `password`). |
| `POST` | `/google` | Public | Verify Google OAuth token (`credential`) and authenticate. |
| `GET` | `/me` | Protected | Retrieve the authenticated user's profile details. |
| `PUT` | `/profile` | Protected | Update profile information (`name`, `username`, `email`, `phone`). |

### Subscription Routes (`/api/subscriptions`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Protected | List all subscriptions belonging to the user. |
| `POST` | `/` | Protected | Create a new subscription record. |
| `PUT` | `/:id` | Protected | Update an existing subscription by ID. |
| `DELETE` | `/:id` | Protected | Remove a subscription record permanently. |

#### Subscription Schema Parameters

```json
{
  "name": "Spotify Premium",
  "cost": 119,
  "cycle": "monthly",
  "category": "Music",
  "nextRenewalDate": "2026-11-15T00:00:00.000Z",
  "reminderDaysBefore": 3,
  "usageNotes": "Listen daily during workouts and commutes",
  "isActive": true
}
```

### Summary & Analytics Routes (`/api/summary`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Protected | Fetch aggregate financial metrics, category sums, and renewals within 30 days. |

### AI Insights Routes (`/api/ai`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/cancel-suggestions` | Protected | Analyze active subscriptions and generate action recommendations via Gemini AI. |

### Reminder Routes (`/api/reminders` & `/api/internal`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/reminders/run` | Protected | Triggers an immediate test email reminder for the logged-in user. |
| `POST` | `/api/internal/reminders` | Header Secret | Endpoint for external cron triggers (`x-cron-secret: <CRON_SECRET>`). |

---

## 🧠 AI Optimization Engine

The AI recommendation module runs on **Google Gemini 3.8 Flash**. It inspects user-provided usage notes alongside financial metrics without compromising security:

1. **Prompt Sanitization**: User usage notes are treated strictly as read-only data within system boundary instructions to prevent prompt injection.
2. **Deterministic Financial Computations**: While Gemini assigns the action (`cancel`, `keep`, `review`) and rationale, all cost computations and savings tallies are strictly computed server-side to eliminate AI hallucination.
3. **Smart Failover**: If Gemini returns a `503 Service Unavailable` or `429 Rate Limit`, the client automatically retries and cascades through fallback models (`gemini-3.5-flash-lite`, `gemini-flash-latest`).
4. **Per-User Cooldown**: A server-side 10-second debounce prevents rapid quota exhaustion.

---

## ⏰ Automated Email Reminder System

The application offers two reliable options for recurring reminder execution:

### Option A: Internal node-cron (Continuous Server)
When running on dedicated instances, VPS, or Docker containers that do not sleep, the internal job boots automatically with `server.js` and schedules tasks based on `REMINDER_CRON` (e.g. `0 9 * * *` at `Asia/Kolkata`).

### Option B: External Webhook Cron (Serverless / Sleeping Instances)
When deployed to free-tier cloud providers like Render or Railway where containers sleep when inactive:
1. Set `CRON_SECRET=your_random_secret_string` in `backend/.env`.
2. Configure a free scheduled cron ping (such as [cron-job.org](https://cron-job.org/) or GitHub Actions) to run daily:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/internal/reminders \
     -H "x-cron-secret: your_random_secret_string"
   ```

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/) and set the root directory to `frontend`.
3. Add the required environment variables:
   - `VITE_API_URL`: Your production backend URL (e.g., `https://api.yourdomain.com/api`).
   - `VITE_CURRENCY`: Preferred currency code (e.g., `INR` or `USD`).
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
4. The included `frontend/vercel.json` automatically ensures all client-side routes redirect properly to `index.html`.

### Backend (Render / Railway / VPS)
1. Set the root directory to `backend`.
2. Configure the build command: `npm install`.
3. Configure the start command: `node src/server.js`.
4. Supply all required production environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`: Your Vercel frontend URL (e.g. `https://your-app.vercel.app`).
   - `GEMINI_API_KEY`
   - `EMAIL_USER` & `EMAIL_PASS`
   - `GOOGLE_CLIENT_ID`

---

## 📄 License

This project is open-source and licensed under the [ISC License](LICENSE).
