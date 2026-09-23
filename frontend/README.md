# Aasra - Frontend

A dedicated platform designed to bridge the gap between seniors in need and helpful volunteers.

## Project Structure

```text
src/
├── assets/             # Global media (images, icons) and styles
├── components/         # Reusable UI building blocks
│   ├── common/         # Atomic components (Buttons, Cards, Modals)
│   └── layout/         # Structural components (Navbar, Sidebar)
├── context/            # Global state management (Auth, Theme)
├── hooks/              # Reusable logic (useVoice, useSOS)
├── pages/              # Routed view components (Dashboards, Landing)
├── services/           # API and external data handling
├── App.jsx             # Root component and Routing configuration
└── main.jsx            # Application entry point
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```