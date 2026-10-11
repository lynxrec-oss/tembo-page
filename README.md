# 🐘 Tembo Page

> *"Your Bio Link Should Think."*

Tembo Page is an intelligent bio link and creator platform featuring Smart Traffic Personalization, dynamic visitor pathways, real-time analytics, and visual drag-and-drop page customization.

## Features
- **Smart Traffic Personalization:** Reorders and highlights cards automatically based on incoming referrer (`?utm_source`, Instagram, TikTok, YouTube, Newsletter).
- **Page Builder:** Real-time visual customizer with interactive live device preview, drag-and-drop link cards, typography, and Savannah Sunset theme styling.
- **Creator Dashboard & Analytics:** Conversion funnel tracking, click-through rates, traffic source breakdown, and Smart Pixel event telemetry.
- **Smart Pixel Setup:** Embeddable tracking script (`cdn.tembo.page/pixel/v1/core.js`) with one-click connection verification.
- **Creator Fund & Affiliate Program:** In-app application flows with administrative review workflows.
- **Security & Privacy:** Hardened Firestore security rules with granular role-based authentication and anonymous beta session tokens.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion
- **Backend / Services:** Firebase Auth, Cloud Firestore, Cloud Storage, Cloud Functions
- **Video & Creative Engine:** Remotion

## Getting Started

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Firebase Architecture
- **Project:** `tembo-page-prod-25`
- **Hosting:** `dist` directory
- **Firestore Rules:** `firestore.rules`
- **Firestore Indexes:** `firestore.indexes.json`
- **Cloud Functions:** `functions/`
