# ✈️ AI Trip Planner – User-Friendly Setup Guide
Welcome! This guide helps you **run, deploy, and use** the AI Trip Planner with **Next.js + Supabase + Vercel** — no deep backend knowledge required.
---
## 🧭 What This App Does
* 🔐 Secure authentication (Email + Google/GitHub)
* 🗺️ Create and manage trips
* 🤖 AI-assisted trip planning
* ☁️ Deployed on Vercel
* 🔒 Data protected with Supabase Row Level Security (RLS)
---
## 🧰 Tech Stack (Simple Terms)
* **Frontend:** Next.js (App Router)
* **Auth & Database:** Supabase
* **Deployment:** Vercel
* **Styling:** Tailwind CSS

* <img width="2855" height="1462" alt="Screenshot 2026-03-14 175708" src="https://github.com/user-attachments/assets/2371df9f-9b88-44cb-ba10-fd1681c50f2d" />

<img width="2875" height="1457" alt="Screenshot 2026-03-14 175905" src="https://github.com/user-attachments/assets/ea154036-16de-4ddd-bf02-358b24b11eec" />
<img width="2839" height="1466" alt="Screenshot 2026-03-14 175731" src="https://github.com/user-attachments/assets/f11b5351-cd68-466a-828b-d84e335384d0" />


---
## 🚀 Getting Started (Local Setup)
### 1️⃣ Clone the Project
```bash
git clone <your-repo-url>
cd ai_trip_planner
```
---
### 2️⃣ Install Dependencies
```bash
npm install
```
---
### 3️⃣ Create `.env.local`
Create a file called `.env.local` in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
📍 Get these from: **Supabase Dashboard → Project Settings → API**
---
### 4️⃣ Run the App Locally
```bash
npm run dev
```
Open 👉 [http://localhost:3000](http://localhost:3000)
---
## 🔐 Authentication (How Login Works)
Supported methods:
* ✅ Email & Password
* ✅ OAuth (Google / GitHub)
Supabase handles everything securely.
---
## 🔒 Protected Pages
Some pages (like **Create New Trip**) are protected.
❌ Not logged in → redirected to Sign In
✅ Logged in → full access
This protection happens **on the server**, so it’s very secure.
---
## 🗄️ Database Security (Very Important)
Each trip belongs to **one user only**.
Supabase uses **Row Level Security (RLS)** so:
* Users can see **only their own trips**
* Users cannot edit others’ data
---
## 🙌 You’re Done!
Your AI Trip Planner is now:
* Secure 🔐
* User-friendly 😊
* Production-ready 🚀
Happy building!
