# 🧡 Aasra

**Aasra** (आसरा — "shelter" / "support") is a web platform that bridges the gap between seniors who need a helping hand and verified volunteers ready to give one. Seniors can book assistance — from companionship and walking buddies to medicine delivery, tech help, and doctor visits — while volunteers browse and accept nearby requests in real time.

The entire experience is built senior-first: big fonts, high-contrast mode, read-aloud (text-to-speech), and simple phone-number OTP login.

---

## ✨ Features

### For Seniors
- **Phone OTP login** — no passwords to remember; sign in with just a phone number
- **Book help in categories** — Companionship, Walking Buddy, Medicine Delivery, Home Maintenance, Tech Assistance, Doctor Visits, Events & Travel, and more
- **Session booking** — pick a date, time, duration, and saved location (auto-detected via GPS)
- **SOS button** — one tap to raise an emergency alert and immediately notify support
- **Credits & payments** — track remaining sessions and pay securely via Razorpay checkout
- **Feedback** — rate completed sessions with a quick emoji reaction

### For Volunteers
- **Verification flow** — upload ID for verification before going live
- **Live request feed** — see new senior requests in real time (Supabase Realtime)
- **Accept / manage requests** — track accepted jobs and seniors
- **Dashboard stats** — sessions completed, hours contributed, and rating

### Accessibility (built-in, app-wide)
| Setting | What it does |
|---|---|
| **Text size** | Scales the whole UI (normal / large / extra-large) |
| **High contrast** | Black background with yellow text; forces minimum 24px text |
| **Read mode** | Hover over any text and it is read aloud via browser speech synthesis |
| **Language** | Switch the interface language from the settings modal |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7 |
| Styling | Tailwind CSS 4, custom design tokens |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend & Auth | Supabase (Postgres, Phone OTP auth, Realtime) |
| Payments | Razorpay |
| Maps / Geolocation | Browser Geolocation API + Google Maps reverse geocoding |

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # SettingsModal, VoiceModal
│   │   ├── layout/          # AppShell, Navbar, Footer, Navigation
│   │   ├── ProtectedRoute.jsx  # Auth guard for private routes
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── SettingsModal.jsx   # Accessibility settings (text size, contrast, read mode)
│   ├── hooks/
│   │   └── useReadMode.jsx  # Text-to-speech on hover when Read Mode is on
│   ├── lib/
│   │   └── supabase.js      # Supabase client initialization
│   ├── pages/
│   │   ├── ServicesPage.jsx     # Landing page: services + subscription plans
│   │   ├── AuthPage.jsx         # Phone number → OTP login flow
│   │   ├── OnboardingPage.jsx   # Role-based profile setup (senior / volunteer)
│   │   ├── SeniorHub.jsx        # Senior dashboard: bookings, SOS, credits, payments
│   │   ├── VolunteerHub.jsx     # Volunteer dashboard: requests, stats, verification
│   │   └── ContactPage.jsx
│   ├── App.jsx             # Root component, routes, accessibility config
│   └── main.jsx            # Entry point
└── package.json
```

## 🔗 Routes

| Route | Page | Access |
|---|---|---|
| `/` | Services / landing | Public |
| `/auth` | Phone OTP login | Public |
| `/onboarding` | Profile setup | Protected |
| `/contact-us` | Contact | Public |
| `/senior-hub` | Senior dashboard | Protected |
| `/volunteer-hub` | Volunteer dashboard | Protected |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project
- A Razorpay account (for payments)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

Create a `frontend/.env.local` file:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
VITE_RAZORPAY_KEY_ID=<your-razorpay-key-id>
```

> ⚠️ `.env.local` is git-ignored — never commit real keys. The Supabase anon key is a publishable client key; Row Level Security on your Supabase tables is what protects your data.

### 3. Set up Supabase

The app expects these tables in your Supabase project:

- **`profiles`** — user role (`senior` / `volunteer`), full name, phone number, `location_data` (address / GPS)
- **`service_requests`** — help requests created by seniors (type, description, schedule, status)
- **`sessions`** — completed sessions with `duration_hours`
- **`credits`** — remaining session credits per senior

Enable **Phone Auth** in Supabase. If no SMS provider is configured, the app falls back to a test OTP shown in an alert.

**Note:** reverse-geocoding in `SeniorHub.jsx` currently has a `YOUR_GOOGLE_MAPS_API_KEY` placeholder — replace it with a real Google Maps API key (or move it to an env var) to convert GPS coordinates into readable addresses.

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

## 💳 Pricing Model (as configured)

- **Monthly Plan** — ₹2,000/month + travel charges (5 sessions, 1 free)
- **Session Plan** — ₹500/session, pay as you go
- Travel is billed at actual fare or ₹10/km; one session = up to 1 hour of help

---

## 🗺 Roadmap Ideas

- Multi-language content translation (beyond the UI toggle)
- In-app chat / voice calls between seniors and volunteers
- Volunteer background-check status in the UI
- Notifications (SMS / push) for SOS and request updates

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change, then submit a pull request.

## 📄 License

All rights reserved — add a license file here if you'd like this project to be open source.
