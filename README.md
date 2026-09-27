# TypeForge ⌨️

> **Measure. Practice. Master.**

A professional, full-stack typing test web application with real-time analytics, leaderboards, gamification, and personalized practice.

---

## 🌟 Features

- **Core Typing Engine** — Real-time WPM, accuracy, consistency, error tracking
- **Multiple Test Modes** — Time (15s–5min), Word count (10–250), Custom
- **Difficulty Levels** — Easy, Medium, Hard, Expert
- **Content Categories** — English, Quotes, Literature, Programming, JS, Python, Science and more
- **Real-time Analytics** — Live WPM graph, accuracy tracking, keystrokes per minute
- **Beautiful Result Dashboard** — Detailed statistics with interactive charts
- **Personal Best System** — Track bests per mode and get PB notifications
- **Test History** — Filterable, sortable history with detailed view
- **Performance Dashboard** — WPM trend, activity heatmap, key error analysis
- **Practice Mode** — Weak keys, accuracy focus, speed bursts, numbers, punctuation, programming
- **Leaderboard** — Daily, weekly, monthly, all-time rankings with podium
- **Achievements** — 18+ badges for speed, accuracy, consistency, and dedication
- **User Profile** — Editable profile, preferences, and settings
- **Theme System** — Dark, AMOLED, Light, High Contrast
- **Anti-Cheat** — Server-side WPM recalculation and validation
- **Responsive Design** — Fully mobile-optimized
- **Secure Auth** — JWT + bcrypt, protected routes

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| State | React Query, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Validation | express-validator |
| Security | Helmet, express-rate-limit, CORS |

---

## 📁 Project Structure

```
typing-test/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/   # Navbar, Footer, MainLayout
│   │   │   ├── typing/   # TypingDisplay, LiveStats, ResultScreen, etc.
│   │   │   └── ui/       # Shared components
│   │   ├── context/      # AuthContext, ThemeContext
│   │   ├── data/         # Word lists, categories
│   │   ├── hooks/        # useTypingEngine
│   │   ├── pages/        # All page components
│   │   ├── services/     # API service functions
│   │   └── utils/        # Typing calculations, formatters
│   └── package.json
│
├── server/               # Express backend
│   ├── config/           # Database connection
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth, error, validation
│   ├── models/           # MongoDB models
│   ├── routes/           # Express routes
│   ├── services/         # Achievement service
│   ├── utils/            # Helpers, seeder
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account

### 1. Clone & Setup

```bash
git clone <repo-url>
cd typing-test
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed      # Seed database with passages and admin user
npm run dev       # Start backend on port 5000
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev       # Start frontend on port 5173
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔧 Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/typeforge
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client
The client uses Vite's proxy to forward `/api` requests to the backend. No `.env` needed for development.

---

## 🗄 Database Setup

After installing dependencies and configuring `.env`:

```bash
cd server
npm run seed
```

This creates:
- 30+ typing passages across all categories and difficulties
- Admin user: `admin@typeforge.dev` / `Admin@123456`

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| PUT | `/api/users/preferences` | ✅ | Update settings |
| GET | `/api/users/stats` | ✅ | Get analytics |
| POST | `/api/tests` | ✅ | Submit test result |
| GET | `/api/tests/history` | ✅ | Get test history |
| DELETE | `/api/tests/:id` | ✅ | Delete test |
| GET | `/api/leaderboard` | — | Get leaderboard |
| GET | `/api/passages` | — | Get passages |
| GET | `/api/admin/stats` | 👑 | Admin stats |

---

## 🎨 WPM Calculation

```
WPM = (Correct Characters / 5) / Minutes Elapsed
```

- **Net WPM** — Uses only correct characters
- **Raw WPM** — Uses total typed characters (including errors)
- **Accuracy** — `(Correct Chars / Total Typed) × 100`
- **Consistency** — `100 - (StdDev / Avg WPM × 100)`

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy `dist/` folder to Vercel
# Set environment variables in Vercel dashboard
```

### Backend → Render
```bash
# Connect GitHub repo to Render
# Set environment variables in Render dashboard
# Start command: node server.js
```

### Database → MongoDB Atlas
1. Create cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Copy connection string to `MONGODB_URI` in server `.env`

---

## 🔮 Future Improvements

- [ ] Google OAuth login
- [ ] Real-time multiplayer typing battles (WebSockets)
- [ ] Daily challenge system
- [ ] Email notifications / password reset
- [ ] Mobile app (React Native)
- [ ] Hindi language support
- [ ] Typing DNA profile
- [ ] Custom passage uploader
- [ ] Browser extension

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

Made with ❤️ for typists everywhere by the TypeForge team.
