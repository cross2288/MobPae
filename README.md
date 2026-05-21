A complete walkthrough of the project.

📁 Project Structure
/app/
├── backend/ ← Node.js + Express API
│ ├── server.js ← All API routes & auth (single file)
│ ├── data/
│ │ └── users.json ← All login credentials
│ ├── package.json ← Dependencies
│ ├── .env ← Secrets (JWT, frontend URL)
│ └── .env.example ← Template for deployment
│
└── frontend/ ← React app
├── public/
│ └── index.html ← HTML shell (title, meta tags)
│
├── src/
│ ├── index.js ← React entry point + badge remover
│ ├── index.css ← Global styles, fonts, Tailwind
│ ├── App.js ← ROUTER — all URL → page mappings
│ ├── App.css ← (empty, kept for compatibility)
│ │
│ ├── contexts/
│ │ └── AuthContext.js ← Login state shared across app
│ │
│ ├── components/
│ │ ├── ProtectedRoute.js ← Guards role-based access
│ │ ├── DashboardLayout.js ← Sidebar + mobile drawer
│ │ └── ui/ ← shadcn UI components
│ │
│ └── pages/
│ ├── LandingPage.js ← Public marketing page (/)
│ ├── LoginPage.js ← Login form (/login)
│ │
│ ├── admin/
│ │ ├── AdminDashboard.js
│ │ ├── AdminEnquiries.js
│ │ ├── AdminUsers.js
│ │ └── AdminRequests.js
│ │
│ ├── employer/
│ │ ├── EmployerDashboard.js
│ │ ├── EmployerEmployees.js
│ │ └── EmployerRequests.js
│ │
│ └── employee/
│ ├── EmployeeDashboard.js
│ ├── RequestAdvance.js
│ └── MyRequests.js
│
├── tailwind.config.js ← Colors, fonts, theme
└── package.json ← Frontend dependencies
🗺️ Login Flow Diagram
┌──────────────────────────────────────────────────────────────────────┐
│ USER OPENS BROWSER │
│ │
│ 1. Visits → https://your-app.com │
│ │ │
│ ▼ │
│ ┌─────────────────┐ │
│ │ index.html │ ← public/index.html (HTML shell) │
│ │ + index.js │ ← src/index.js (React mounts here) │
│ │ + App.js │ ← src/App.js (BrowserRouter starts) │
│ └────────┬────────┘ │
│ ▼ │
│ ┌─────────────────────┐ │
│ │ AuthProvider │ ← src/contexts/AuthContext.js │
│ │ • Calls /auth/me │ - Checks if user already logged in │
│ │ • Sets user state │ - Stores user globally for all pages │
│ └────────┬────────────┘ │
│ ▼ │
│ ┌────────────────────────────────────────────────┐ │
│ │ ROUTING (App.js) │ │
│ │ │ │
│ │ URL "/" → <LandingPage> │ │
│ │ URL "/login" → <LoginPage> │ │
│ │ URL "/admin" → ProtectedRoute(admin) │ │
│ │ URL "/employer" → ProtectedRoute(emplyr) │ │
│ │ URL "/employee" → ProtectedRoute(emp) │ │
│ └────────────────────────────────────────────────┘ │
│ │
└──────────────────────────────────────────────────────────────────────┘
🔐 Login Sequence (Step-by-Step)
USER FRONTEND BACKEND DATA FILE
│ │ │ │
│ Open /login │ │ │
├──────────────────────►│ │ │
│ │ render LoginPage.js │ │
│◄──────────────────────┤ │ │
│ │ │ │
│ Type email+password │ │ │
│ Click "Sign In" │ │ │
├──────────────────────►│ │ │
│ │ POST /api/auth/login │ │
│ ├──────────────────────►│ │
│ │ │ load users.json │
│ │ ├─────────────────────►│
│ │ │◄─── users array ─────┤
│ │ │ │
│ │ │ find by email │
│ │ │ verify password │
│ │ │ create JWT token │
│ │ │ set httpOnly cookie │
│ │ ◄── 200 + cookie ─────┤ │
│ │ │ │
│ │ AuthContext.setUser() │ │
│ │ navigate(/role-home) │ │
│ ◄─── Dashboard ───────┤ │ │
📂 What Each Backend File Does
/app/backend/server.js — The whole API in one file
LINES 1-30 Setup (express, jwt, cors, load env)
LINES 32-40 Load users.json into memory
LINES 50-80 Helpers:
• createAccessToken() — sign JWT (15min expiry)
• setAuthCookies() — set httpOnly cookies
• getCurrentUser() — middleware that reads cookie
and finds user in users.json
• requireRole(...) — middleware: only allow admins/etc

LINES 90-115 AUTH ROUTES
POST /api/auth/login → verifies password, sets cookie
POST /api/auth/logout → clears cookies
GET /api/auth/me → returns current user info

LINES 120-130 PUBLIC ROUTE
POST /api/enquiry/submit → adds to in-memory enquiries[]

LINES 135-175 ADMIN ROUTES (require admin role)
GET /api/admin/enquiries
POST /api/admin/approve-employer
GET /api/admin/users
GET /api/admin/advance-requests

LINES 180-230 EMPLOYER ROUTES (require employer role)
POST /api/employer/add-employee
GET /api/employer/employees
GET /api/employer/advance-requests
POST /api/employer/handle-request

LINES 235-290 EMPLOYEE ROUTES (require employee role)
POST /api/employee/request-advance
GET /api/employee/my-requests
GET /api/employee/dashboard-stats

LINES 295+ app.listen(8001) — start server
/app/backend/data/users.json
The only persistent storage. All 3 default users live here. Add/edit users by editing this file + restart backend.

{
"users": [
{ "id": "u-admin-001", "email": "admin@mobpae.com", ... },
{ "id": "u-employer-001", "email": "employer@acme.com", ... },
{ "id": "u-employee-001", "email": "employee@acme.com", ... }
]
}
In-memory data (lost on restart):
enquiries[] — submitted via landing page
advanceRequests[] — submitted by employees
🎨 What Each Frontend File Does
src/App.js — The Router (heart of the app)
<Route path="/" → LandingPage />
<Route path="/login" → LoginPage />

// Protected — requires specific role
<Route path="/admin" → <ProtectedRoute allowedRoles={['admin']}>
<AdminDashboard />
</ProtectedRoute> />

<Route path="/employer" → ProtectedRoute(['employer']) + EmployerDashboard
<Route path="/employee" → ProtectedRoute(['employee']) + EmployeeDashboard
src/contexts/AuthContext.js — Global login state
Wraps the entire app
Provides user, login(), logout(), loading to every component via useAuth() hook
On mount, calls /api/auth/me to check existing session
src/components/ProtectedRoute.js — Access guard
if (loading) → show spinner
if (!user) → redirect to /login
if (user.role NOT in allowed) → redirect to /
else → render the page
src/components/DashboardLayout.js — Shared sidebar shell
Used by all 3 roles (admin/employer/employee)
Renders the sidebar with role-specific menu items
Has mobile hamburger drawer for small screens
Shows logged-in user name + logout button
src/pages/LandingPage.js — Public marketing page
Hero, stats, charts, testimonials, FAQ
Has the enquiry modal (submits to /api/enquiry/submit)
src/pages/LoginPage.js
Simple form
Calls useAuth().login(email, password)
On success → fetches /api/auth/me → navigates to /admin, /employer, or /employee based on role
🔄 Role-Based Routing Flow
┌───────────────────┐
│ User logs in │
└────────┬──────────┘
▼
┌───────────────────┐
│ user.role = ? │
└────────┬──────────┘
▼
┌────────────┼────────────┐
▼ ▼ ▼
"admin" "employer" "employee"
│ │ │
▼ ▼ ▼
/admin /employer /employee
│ │ │
▼ ▼ ▼
AdminDashboard EmployerDash EmployeeDash

- Sidebar: + Sidebar: + Sidebar:
  • Dashboard • Dashboard • Dashboard
  • Enquiries • Employees • Request Adv
  • Users • Requests • My Requests
  • Requests
  🌊 Complete End-to-End Flow (Real Example)
  Scenario: Employee requests an advance

1. Employee visits /employee
   │
   ├─► AuthContext checks /api/auth/me using cookie
   │ ✓ user.role === "employee"
   │ ✓ ProtectedRoute allows access
   │
   ├─► EmployeeDashboard.js mounts
   │ calls GET /api/employee/dashboard-stats
   │ backend → reads user from users.json
   │ → calculates max advance from salary
   │ → returns { available_advance, max_advance, ... }
   │ shows stats on screen
   │
2. Employee clicks "Request Advance" → /employee/request-advance
   │
   ├─► RequestAdvance.js mounts
   │ fills form: amount, reason, repayment_date
   │ clicks Submit
   │
   ├─► POST /api/employee/request-advance
   │ backend validates: amount ≤ max_advance
   │ backend checks: no pending requests
   │ backend pushes to advanceRequests[] (in memory)
   │ returns { request_id, message }
   │
3. Employer logs in → /employer/requests
   │
   ├─► GET /api/employer/advance-requests
   │ backend filters advanceRequests[] by employer_id
   │ returns matching requests
   │ UI shows all pending requests
   │
4. Employer clicks "Approve"
   │
   └─► POST /api/employer/handle-request { action: 'approve' }
   backend updates request.status = 'approved'
   Employee sees updated status on next visit

   🔑 Quick Reference

   Task Where to look

   - Add a new user /app/backend/data/users.json
   - Change admin/employer/employee password users.json then restart backend
   - Add a new API endpoint /app/backend/server.js
   - Add a new page Create in src/pages/, add route in src/App.js
   - Change colors/fonts tailwind.config.js + src/index.css
   - Change which menu items appear in sidebar src/components/DashboardLayout.js
   - Change login redirect logic src/pages/LoginPage.js (handleSubmit)
   - Change "who can access what" src/components/ProtectedRoute.js
   - Add MongoDB later Replace users.find(...) in server.js with db.collection('users').findOne(...)
