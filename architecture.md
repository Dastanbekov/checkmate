# ChessMastery Architecture Guide

This document provides a visual and structural overview of the ChessMastery platform.

## 1. System Overview
The platform follows a classic decoupled architecture with a Next.js frontend, a Django (DRF) backend, and a PostgreSQL database.

```mermaid
graph TD
    User((User Browser))
    Vercel[Vercel - Frontend Next.js]
    Railway[Railway - Backend Django]
    Supabase[(Supabase - PostgreSQL)]
    Groq[Groq AI - Engine]

    User <-->|HTTPS / WSS| Vercel
    Vercel <-->|REST / WebSockets| Railway
    Railway <-->|SQL| Supabase
    Railway <-->|API| Groq
```

---

## 2. Backend Structure (Django Apps)
We follow a modular approach where each domain is isolated into its own application.

```mermaid
graph LR
    Core[Core - Settings/ASGI]
    Users[Apps.Users - Auth/Profile]
    Play[Apps.Play - WebSockets/Game Logic]
    Community[Apps.Community - Clubs/Tournaments]
    Analyzer[Apps.Analyzer - AI Integration]

    Core --> Users
    Core --> Play
    Core --> Community
    Core --> Analyzer
```

### Layered Architecture per App:
- **Models**: Database schema (Supabase).
- **Serializers**: Data transformation for JSON.
- **Views/Consumers**: Logic for REST and WebSockets.
- **Services**: Heavy business logic (e.g., Stockfish integration, Move validation).

---

## 3. Real-time Communication Flow (Game Play)
Real-time games use WebSockets via **Django Channels** and **Daphne**.

```mermaid
sequenceDiagram
    participant P1 as Player A (Frontend)
    participant WS as WebSocket Consumer
    participant DB as Supabase DB

    P1->>WS: Connect /ws/play/matchmaking/
    WS->>DB: Check User Token
    WS-->>P1: Connection Established
    P1->>WS: Send Move (e2e4)
    WS->>WS: Validate Move (chess.js)
    WS->>DB: Save Game State
    WS-->>P1: Broadcast Move Update
```

---

## 4. Technology Stack
- **Frontend**: Next.js 15, TailwindCSS, Framer Motion, Lucide React.
- **Backend**: Django 5.1, Django Channels (WebSockets), DRF (REST).
- **Database**: PostgreSQL (via Supabase).
- **AI**: Groq (Llama-3-70b) for analysis.
- **Deployment**: Vercel (Frontend), Railway (Backend).
