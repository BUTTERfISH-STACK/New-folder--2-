# CVRedo - AI-Powered CV Builder

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Next.js-15-black.svg" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg" alt="Tailwind">
</p>

> A premium, open-source AI-assisted CV/resume builder and career courses platform. Built with Next.js 15, React Three Fiber, and designed to feel like a high-end SaaS product.

## ✨ Features

- **AI CV Builder** - Create stunning resumes with 3D preview, drag-and-drop sections, and ATS optimization
- **Premium Templates** - 8+ handcrafted templates designed by career experts
- **AI Suggestions** - Rule-based intelligent recommendations to improve your resume
- **Career Courses** - Video courses for resume writing, interviews, and career pivots
- **Smart Dashboard** - Track progress, manage multiple CVs, monitor career journey
- **Authentication** - Email/password and GitHub OAuth support
- **PDF Export** - Client-side PDF generation
- **100% Free & Open Source** - No paid APIs, self-hostable

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cvredo.git
cd cvredo

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **3D**: @react-three/fiber + @react-three/drei
- **Animation**: Framer Motion
- **Database**: Prisma + SQLite (default) / PostgreSQL
- **Auth**: NextAuth.js v5
- **Forms**: React Hook Form + Zod
- **PDF**: @react-pdf/renderer
- **Package Manager**: Turborepo

## 📁 Project Structure

```
cvredo/
├── apps/
│   └── web/               # Next.js application
│       ├── src/
│       │   ├── app/     # App router pages
│       │   ├── components/ # React components
│       │   └── lib/      # Utilities
│       └── public/       # Static assets
├── packages/
│   ├── ui/              # Shared UI components
│   └── db/              # Prisma database
├── docker-compose.yml   # Docker setup
├── turbo.json           # Turborepo config
└── LICENSE              # MIT License
```

## 🎨 Design System

The UI follows a premium dark theme with:

- **Colors**: 
  - Background: `#000000` to `#1A1A1A`
  - Accents: Gold (`#d4af37`), Cyan (`#06b6d4`), Purple (`#a855f7`)
- **Glassmorphism**: `backdrop-blur-xl`, `bg-black/30`, `border-white/5`
- **Animations**: Floating 3D elements, parallax scrolling, tilt-on-hover

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Prisma database connection | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Yes |
| `NEXTAUTH_URL` | App URL | Yes |
| `GITHUB_ID` | GitHub OAuth App ID | No |
| `GITHUB_SECRET` | GitHub OAuth App Secret | No |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | No |

### Database

Default: SQLite (`file:./dev.db`)

For PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cvredo"
```

## 🚢 Deployment

### Docker

```bash
# Build and run
docker-compose up -d
```

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Railway, VPS, etc.

1. Set environment variables
2. Run `pnpm build`
3. Start with `pnpm start`

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) - For the amazing component library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - For 3D capabilities
- [Next.js](https://nextjs.org) - For the fantastic framework

---

<p align="center">Built with ❤️ by the CVRedo Team</p>
