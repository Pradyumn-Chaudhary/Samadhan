# Samadhan — Civic Issue Reporting Platform

> A full-stack GovTech platform bridging citizens and municipal corporations across 8 cities in Rajasthan.

---

## 🔗 Links

| | |
|---|---|
| 🌐 Web Portal | [samadhan-wine.vercel.app](https://samadhan-wine.vercel.app/) |
| 📱 Android APK (v1.0.0) | [Download](https://github.com/Pradyumn-Chaudhary/Samadhan/releases/download/v1.0.0/app-release.apk) |
| 🎬 Demo | [YouTube](https://youtu.be/Pv5fTREiyuU?si=GT2au5QiEg6akst6) |

---

## Deployed Cities

`Jodhpur` · `Jaipur` · `Jaisalmer` · `Udaipur` · `Bharatpur` · `Karauli` · `Kota` · `Alwar`

---

## What It Does

Citizens capture a photo of a civic issue. A cloud ML model auto-classifies it (pothole, garbage, electrical hazard). The report is pinned to a live map with GPS coordinates and tracked through resolution by municipal staff.

**Municipal roles:** Admin → Manager → Field Staff — each with scoped access via the web portal.

---

## Tech Stack

### Mobile App
| | |
|---|---|
| Framework | React Native 0.81 (TypeScript) |
| Auth | Firebase — Google Sign-In |
| Navigation | React Navigation v7 |
| Maps | react-native-maps |
| HTTP | Axios |

### Backend & Infrastructure
| | |
|---|---|
| API | Node.js + Express |
| Database | PostgreSQL (Neon) |
| Storage | Google Cloud Storage |
| Auth | Firebase |
| Notifications | Firebase Cloud Messaging |
| ML Classifier | Python / FastAPI (cloud — REST API) |

### Web Portal
| | |
|---|---|
| Framework | Next.js |
| Deployment | Vercel |

---

## Screens

| Screen | Description |
|---|---|
| `SignIn` | Google OAuth via Firebase |
| `HomeScreen` | Live map — open issues and resolved issues |
| `NewReport` | Camera → ML classification → GPS → submit |
| `MyReport` | User's submitted reports with status history |

---

## Report Flow

```
Capture photo
    → ML classifier (cloud) → auto-assign category
        → uncertain / rejected → user selects manually
    → GPS location
    → Upload photo to GCS
    → POST report to backend
    → Visible on map instantly
```

---

## Local Setup

```bash
npm install
npm start        # Metro bundler
npm run android  # or: npm run ios
```

Add your own `.env` (see `env.d.ts` for required keys) and drop `google-services.json` / `GoogleService-Info.plist` from your Firebase project into the platform directories.

---

## Web Portal — Test Credentials (Jodhpur Region)

| Role | Email | Password |
|---|---|---|
| Admin | poortigupta2309@gmail.com | `12345678` |
| Manager (Road Dept.) | nishthajain@gmail.com | `123456789` |
| Staff (Road Dept.) | kuldeepsingh@gmail.com | `123456789` |

---

