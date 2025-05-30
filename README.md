# <img src="https://img.icons8.com/color/48/000000/task.png" width="32" height="32"/> Visual Task Board

> **Your AI-Powered Productivity Workspace**

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.49-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Visual Task Board Demo](https://placehold.co/800x400/6366f1/FFFFFF/png?text=Visual+Task+Board+Demo&font=montserrat)

## 🗂️ Overview

Visual Task Board is a modern, AI-powered productivity app designed to help you organize, visualize, and manage your tasks with clarity and style. Built with the latest web technologies, it features a beautiful drag-and-drop interface, real-time collaboration, and seamless authentication with Supabase.

<b>🌟 Key Features</b>

- 🧠 **AI-Powered Task Suggestions** - Get smart recommendations to optimize your workflow
- 🗂️ **Visual Kanban Board** - Organize tasks with an intuitive drag-and-drop interface
- 🔍 **Powerful Search & Filters** - Quickly find and focus on what matters
- 👥 **Real-Time Collaboration** - Work together with your team instantly
- 🔒 **Secure Authentication** - Supabase Auth for sign in, sign up, and Google login
- 🎨 **Stunning Modern UI** - Responsive, glassmorphism design with dark/light mode
- 🛎️ **Instant Notifications** - Beautiful toast alerts with Sonner
- 📱 **Mobile Friendly** - Works seamlessly on all devices
- ⚡ **Fast & Reliable** - Built with Vite, React 18, and TypeScript

## 🔧 Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <img src="https://techstack-generator.vercel.app/react-icon.svg" alt="React" width="48" height="48" />
        <br/>React
      </td>
      <td align="center" width="96">
        <img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="TypeScript" width="48" height="48" />
        <br/>TypeScript
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" width="48" height="48" />
        <br/>Vite
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind" width="48" height="48" />
        <br/>Tailwind
      </td>
      <td align="center" width="96">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" alt="Supabase" width="48" height="48" />
        <br/>Supabase
      </td>
      <td align="center" width="96">
        <img src="https://www.vectorlogo.zone/logos/reactrouter/reactrouter-icon.svg" alt="React Router" width="48" height="48" />
        <br/>Router
      </td>
    </tr>
    <tr>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/TanStack/query/main/media/logo.svg" alt="React Query" width="48" height="48" />
        <br/>React Query
      </td>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/75042455" alt="Radix UI" width="48" height="48" />
        <br/>Radix UI
      </td>
      <td align="center" width="96">
        <img src="https://avatars.githubusercontent.com/u/139895814" alt="shadcn UI" width="48" height="48" />
        <br/>shadcn/ui
      </td>
      <td align="center" width="96">
        <img src="https://lucide.dev/logo.svg" alt="Lucide" width="48" height="48" />
        <br/>Lucide
      </td>
      <td align="center" width="96">
        <img src="https://raw.githubusercontent.com/emilkowalski/sonner/main/assets/logo.svg" alt="Sonner" width="48" height="48" />
        <br/>Sonner
      </td>
    </tr>
  </table>
</div>

<b>⚛️ Frontend</b>

- React 18 - Modern UI library
- TypeScript - Type-safe programming
- Vite - Lightning-fast build tool
- Tailwind CSS - Utility-first CSS framework
- shadcn/ui - Beautiful, accessible components
- Lucide React - Consistent icon toolkit
- React Router DOM - Client-side routing
- React Query - Data synchronization
- Sonner - Toast notifications

<b>🗃️ Backend & Data</b>

- Supabase - Open-source backend (database, auth, storage)

<b>🎭 UI/UX & Additional Libraries</b>

- Radix UI - Unstyled, accessible UI primitives
- React Hook Form & Zod - Form validation
- Date-fns - Modern date utilities

## 📂 Project Structure

```
visual-task-board/
├── dist/                   # Build output
├── public/                 # Public assets
├── src/
│   ├── components/
│   │   ├── TaskCanvas/     # Main board components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React context (auth, etc.)
│   │   ├── integrations/       # Supabase client setup
│   │   ├── pages/              # App pages (Auth, Index, NotFound)
│   │   ├── App.tsx             # Main app
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML entry
│   ├── tailwind.config.ts      # Tailwind config
│   ├── tsconfig.json           # TypeScript config
│   ├── vite.config.ts          # Vite config
│   ├── package.json            # Dependencies
│   └── README.md               # Project docs
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1️⃣ **Clone the repository:**
```sh
git clone https://github.com/yourusername/visual-task-board.git
cd visual-task-board
```

2️⃣ **Install dependencies:**
```sh
npm install
```

3️⃣ **Configure environment variables:**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_API_KEY=your_supabase_anon_key
```

4️⃣ **Start the development server:**
```sh
npm run dev
```

5️⃣ **Open your browser:**
Navigate to `http://localhost:5173`

## 🌐 Deployment

```sh
# Build the project
npm run build

# Deploy the dist folder to your preferred hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Supabase for the backend platform
- shadcn/ui & Radix UI for the component library
- Lucide, Sonner, and the open source community

---

<div align="center">
  <img src="https://img.icons8.com/color/48/000000/task.png" width="24" height="24"/>
  <p>Made with ❤️ for productivity lovers</p>
</div>
