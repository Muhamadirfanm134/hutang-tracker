# 🚀 MNGroup Next.js Supabase Starter

<p align="center">
  <img src="./public/mn-group.png" alt="MNGroup Logo" width="160" />
</p>

<p align="center">
  <strong>Production-grade Next.js starter with Supabase Auth, Feature Architecture & Modern DX.</strong>
</p>

<p align="center">
  <a href="https://mngroup-nextjs-supabase-starter.vercel.app">
    <img src="https://img.shields.io/badge/Live-Demo-000?style=for-the-badge&logo=vercel" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-Fast-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />
</p>

---

## 🌐 Live Demo

👉 **[https://mngroup-nextjs-supabase-starter.vercel.app](https://mngroup-nextjs-supabase-starter.vercel.app)**

Experience:

* 🔐 Auth flow (Login / Logout)
* 🛡 Protected routes
* ⚡ SSR-ready Supabase integration
* 🧱 Feature-based architecture

---

# ✨ Overview

MNGroup Starter is a **modern, scalable, production-ready foundation** for building SaaS, internal tools, or enterprise-grade web apps.

Built with:

* ⚡ **Next.js App Router**
* 🔐 **Supabase Auth (SSR-safe)**
* 🎨 **Tailwind CSS + shadcn/ui**
* 🔄 **TanStack Query**
* 📦 **Feature-based architecture**
* 🛠 **Husky + lint-staged**
* 🔷 **Strict TypeScript**
* 🚀 **pnpm**

---

# 🧠 Architecture Philosophy

```
src/
 ├── app/              → Routes (App Router)
 ├── features/         → Domain modules (auth, dashboard, etc.)
 ├── components/       → Shared UI components
 ├── lib/              → Supabase, utils, configs
 ├── providers/        → Query & global providers
 └── styles/
```

✔ Clean separation
✔ Scalable for large apps
✔ Easy to onboard new devs

---

# 🚀 Getting Started

## 1️⃣ Use Template

Click **Use this template**
or clone:

```bash
git clone https://github.com/Muhamadirfanm134/mngroup-nextjs-supabase-starter.git
cd mngroup-nextjs-supabase-starter
```

---

## 2️⃣ Install Dependencies

```bash
pnpm install
```

---

## 3️⃣ Setup Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Find keys at:

```
Supabase Dashboard → Settings → API
```

---

## 4️⃣ Run Dev Server

```bash
pnpm dev
```

Visit:

```
http://localhost:3000
```

---

# 🔐 Supabase Auth (SSR Ready)

* Secure session handling
* Middleware-based protection
* Server + Client compatible
* Production deployment safe

---

# 🛠 DX & Tooling

* ESLint (Next.js strict config)
* Prettier + Tailwind plugin
* lint-staged
* Husky pre-commit hooks
* Absolute imports
* Fully typed environment

---

# 📦 Why This Starter?

Compared to boilerplates, this template is:

| Feature                  | MNGroup Starter |
| ------------------------ | --------------- |
| App Router Ready         | ✅               |
| Supabase SSR Auth        | ✅               |
| Feature Architecture     | ✅               |
| Production Config        | ✅               |
| Clean DX                 | ✅               |
| Opinionated but Flexible | ✅               |

---

# 🏗 Ideal For

* SaaS MVP
* Internal dashboards
* Startup projects
* Enterprise frontends
* Personal production-grade apps

---

# 📜 License

MIT License © 2026 MNGroup

---

# ⭐ Support

If you find this starter useful:

* ⭐ Star the repo
* 🍴 Fork it
* 🚀 Use it in production

---
