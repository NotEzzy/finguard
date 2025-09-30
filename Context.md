# FinGuard Web App Documentation

## Overview
The FinGuard Web App is a React-based frontend that allows users to monitor transactions, receive fraud alerts, and manage their accounts. It integrates with Firebase Firestore for backend operations.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
  - Server Components for improved performance
  - Server Actions for form handling
  - Client-side components where interactivity is needed
  - API routes for backend communication
  - TypeScript for type safety

### State Management
- **Zustand**
  - Lightweight state management solution
  - Persistent storage middleware for caching
  - DevTools integration for debugging
  - TypeScript support for type-safe stores

### Authentication
- **Firebase Auth**
  - Email/Password authentication
  - Google OAuth integration
  - Custom claims for role-based access
  - JWT token management
  - Session persistence

### UI Components
- **Ant Design v5**
  - Complete component library
  - Customizable theming
  - Responsive design components
  - Form validation integration
  - Data visualization components
  - Dark/Light mode support

### Backend & Database
- **Firebase Firestore**
  - Real-time data synchronization
  - Offline data persistence
  - Security rules for data access control
  - Collection structure:
    - users/
      - profile information
      - preferences
      - settings
    - transactions/
      - transaction details
      - risk scores
      - timestamps
    - alerts/
      - fraud notifications
      - user responses
      - status tracking

### Push Notifications
- **Firebase Cloud Messaging (FCM)**
  - Real-time alert delivery
  - Service Worker integration
  - Background message handling
  - Token management
  - Multi-device support

### Development Tools
- **Package Manager:** pnpm
- **Code Quality:**
  - ESLint for code linting
  - Prettier for code formatting
  - Husky for git hooks
- **Testing:**
  - Jest for unit testing
  - React Testing Library for component testing
  - Cypress for E2E testing

### Deployment
- **Hosting:** Vercel
- **Environment:**
  - Development
  - Staging
  - Production
- **CI/CD:** GitHub Actions

### Performance Optimization
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic chunk splitting
- **Caching:** SWR for data fetching
- **Analytics:** Firebase Analytics

### Security
- **Authentication:** Firebase Auth JWT
- **Data Access:** Firestore Security Rules
- **API Protection:** Rate limiting
- **Content Security:** CSP headers

## App Features & Flow

### 1. Authentication & User Onboarding
- Users sign up via Firebase Auth.
- Upon login, JWT is stored in local storage for API authentication.
- Users are redirected to the dashboard upon successful authentication.

### 2. Dashboard (Home Screen)
- Displays recent transactions, fraud alerts, and account statistics.
- Users can filter transactions by risk level (Safe, Suspicious, Fraudulent).

### 3. Transactions Page
- **View Transactions:** Fetches transaction history from `/api/transactions/user/:userId`.
- **Transaction Details:** Clicking a transaction fetches `/api/transactions/:id`.
- **Fraud Detection:** Users can manually submit a transaction for validation.

### 4. Fraud Alerts & Risk Analysis
- Receives real-time fraud alerts via WebSockets or Firebase Cloud Messaging.
- Users can review flagged transactions and approve or dispute them.

### 5. User Profile & Settings
- Users can update their profile information via `/api/users/:id`.
- Two-factor authentication (2FA) setup is available via Firebase.
- Users can enable/disable transaction monitoring preferences.

### 6. Admin Panel (For Financial Institutions)
- View flagged transactions and manually review fraud cases.
- Override fraud decisions and update risk models based on feedback.

## Flow of Operations
1. User logs in and lands on the dashboard.
2. The web app fetches transaction history and fraud alerts via the API.
3. Users can drill down into flagged transactions for further details.
4. Notifications appear in real-time for suspicious activities.
5. Users and admins can take actions (approve, dispute, escalate).

