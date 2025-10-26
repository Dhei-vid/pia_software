# Wright Energy Frontend

A modern, AI-powered document management and collaboration platform built with Next.js. This application enables users to upload documents, interact with them through an intelligent chat interface, create notes and checklists, and collaborate seamlessly.

## Overview

Wright Energy Frontend is an enterprise-grade document management system that combines powerful AI capabilities with an intuitive user interface. The platform allows users to:

- **Upload and Manage Documents**: Upload documents and track their AI processing status
- **Intelligent Document Search**: Search through documents using AI-powered semantic search
- **Interactive Chat Interface**: Chat with your documents to extract information and insights
- **Notes Management**: Create, edit, and save notes related to specific documents
- **Checklist Creation**: Build and manage task checklists based on document content
- **User Profiles**: Manage user preferences, notifications, and account settings
- **Search History**: Track and revisit previous document searches

## Features

### Document Management
- Upload multiple document formats
- Real-time AI processing status tracking
- Document viewer with chapter navigation
- Search functionality across document content

### Collaboration Tools
- Notes creation and management with document association
- Interactive checklists for task tracking
- Search history for easy reference
- Draft document creation and management

### User Experience
- Clean, modern UI with dark mode support
- Responsive design for all devices
- Smooth animations powered by Framer Motion
- Real-time notifications using Sonner

## Technology Stack

### Core Framework
- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Label, Select, Switch
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme switching

### API & Data
- **[Axios](https://axios-http.com/)** - HTTP client for API requests
- **[cookies-next](https://www.npmjs.com/package/cookies-next)** - Cookie management
- **[jsonwebtoken](https://jwt.io/)** - JWT authentication

### Utilities
- **[dayjs](https://day.js.org/)** - Date manipulation
- **[clsx](https://www.npmjs.com/package/clsx)** - Conditional classnames
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[tailwind-merge](https://www.npmjs.com/package/tailwind-merge)** - Merge Tailwind classes
- **[sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Next-generation bundler (enabled for faster builds)

## Project Structure

```
src/
├── api/              # API service layer
│   ├── auth/         # Authentication services
│   ├── checklist/    # Checklist management
│   ├── documents/    # Document operations
│   ├── notes/        # Notes management
│   └── user/         # User profile services
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Authentication pages
│   ├── (main)/       # Main application pages
│   └── (profile)/    # User profile pages
├── components/       # React components
│   ├── general/      # General components
│   ├── layouts/      # Layout components
│   ├── modals/       # Modal dialogs
│   ├── navigation/   # Navigation components
│   ├── sidebar-items/ # Sidebar components
│   └── ui/           # UI primitives (Radix UI)
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── utils/            # Helper utilities
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wrigh-energy-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory and add your configuration:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

### Development

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Other Scripts

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npm run typecheck
```

## Building for Production

The application uses Turbopack for faster development and builds. To create an optimized production build:

```bash
npm run build
```

This creates an optimized version of the app in the `.next` folder.

## Deployment

This project is configured to deploy on various platforms:
- **Vercel** (recommended) - Optimized for Next.js
- **Docker** - Dockerfile included for containerized deployment

### Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Docker Deployment

Build and run using Docker:
```bash
docker build -t wrigh-energy-frontend .
docker run -p 3000:3000 wrigh-energy-frontend
```

## Features in Detail

### Authentication
- User registration with email, password, and profile information
- Secure login with JWT token management
- Protected routes and session management

### Document Upload & Processing
- Multi-format document upload
- AI processing with status tracking
- Document viewing with chapter navigation
- Semantic search capabilities

### Chat Interface
- Interactive document Q&A
- Search history tracking
- Draft document creation

### Notes & Checklists
- Document-associated notes
- Rich text note creation and editing
- Task checklists with completion tracking

### User Profile
- Profile management and preferences
- Notification settings
- Account customization

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)

## License

This project is private and proprietary.
