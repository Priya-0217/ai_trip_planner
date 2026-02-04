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

## 🌍 Deploying to Vercel

### 1️⃣ Add Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables

Add:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

### 2️⃣ Supabase Auth Settings

Supabase Dashboard → Authentication → URL Configuration

**Site URL:**

```
https://your-project-name.vercel.app
```

**Redirect URLs:**

```
https://your-project-name.vercel.app/**
http://localhost:3000/**
```

---

### 3️⃣ Deploy

Push to GitHub → Import repo into Vercel → Deploy 🎉

---

## ✅ Final Checklist

* [ ] App runs locally
* [ ] Supabase env vars added
* [ ] Auth redirect URLs set
* [ ] Protected routes working
* [ ] Trips saved per user

---

## 🙌 You’re Done!

Your AI Trip Planner is now:

* Secure 🔐
* User-friendly 😊
* Production-ready 🚀

Happy building!
