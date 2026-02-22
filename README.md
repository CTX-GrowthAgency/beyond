# BEYOND – Fastest Event Ticketing Platform

A modern, high-performance event ticketing application built with Next.js 16, React 19, and Tailwind CSS. Experience seamless ticket purchasing, QR code scanning, and instant event entry.

## 🚀 Features

### Core Functionality
- **Fast Ticket Booking**: Browse events and purchase tickets instantly
- **QR Code Integration**: Digital tickets with scannable QR codes for quick venue entry
- **Multi-Role System**: Separate interfaces for users, organizers, and administrators
- **Real-time Dashboard**: Track sales, attendance, and event performance
- **Mobile-First Design**: Optimized for all devices with responsive layouts

### User Experience
- **Intuitive Navigation**: Clean, modern interface with smooth transitions
- **Secure Authentication**: Google sign-in popup + Firebase session cookies for protected routes
- **Event Discovery**: Search and filter events by category, date, and location
- **Digital Wallet**: Store and manage purchased tickets

### Organizer Tools
- **Event Management**: Create, edit, and manage events with detailed settings
- **Sales Analytics**: Real-time insights into ticket sales and revenue
- **QR Scanner**: Built-in scanner for venue entry management
- **Payout System**: Automated payment processing and financial tracking

## 🛠 Tech Stack

### Frontend
- **Next.js 16.1.6** – React framework with App Router
- **React 19.2.3** – Latest React with concurrent features
- **TypeScript 5** – Type-safe development
- **Tailwind CSS 4** – Utility-first CSS framework
- **Modern CSS** – Custom animations and transitions

### Development Tools
- **ESLint** – Code linting and formatting
- **PostCSS** – CSS processing pipeline
- **Hot Reload** – Instant development feedback

## 📁 Project Structure

```
beyond/
├── app/                          # Next.js App Router
│   ├── (booking)/               # Ticket booking flow
│   │   ├── checkout/            # Payment processing
│   │   ├── select-tickets/      # Ticket selection
│   │   └── success/             # Booking confirmation
│   ├── (dashboard)/             # Dashboard routes
│   │   ├── admin/               # Admin dashboard
│   │   └── organizer/           # Organizer dashboard
│   ├── (organizer)/             # Organizer-specific routes
│   │   ├── dashboard/           # Main organizer dashboard
│   │   ├── my-events/          # Event management
│   │   │   ├── create/        # Create new event
│   │   │   └── [slug]/         # Edit event
│   │   ├── payout/             # Payment management
│   │   └── scanner/            # QR code scanner
│   ├── (public)/                # Public pages
│   │   ├── events/[slug]/       # Event detail pages
│   │   ├── contact/             # Contact page
│   │   ├── disclaimer/          # Legal disclaimer
│   │   ├── list-your-events/    # Event submission (redirects to Google Form)
│   │   ├── privacy-policy/      # Privacy policy
│   │   └── terms_and_conditions/ # Terms & conditions
│   ├── (user)/                 # User-specific pages
│   │   ├── bookings/            # User booking history
│   │   └── bookings/[bookingId]/ # Individual booking details
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/         # Firebase login
│   │   │   └── logout/        # Firebase logout
│   │   ├── orders/             # Order management
│   │   │   └── create/        # Create new order
│   │   └── cashfree/           # Payment webhooks
│   ├── components/              # Reusable components
│   │   ├── event/              # Event-related components
│   │   │   ├── EventCard.tsx  # Event card component
│   │   │   └── EventList.tsx  # Event list component
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx     # Site header with auth
│   │       └── Footer.tsx     # Site footer
│   ├── lib/                    # Utility libraries
│   │   ├── firebase/            # Firebase configuration
│   │   │   ├── client.ts      # Firebase client setup
│   │   │   └── admin.ts       # Firebase admin setup
│   │   ├── sanity/             # Sanity CMS integration
│   │   │   ├── client.ts      # Sanity client configuration
│   │   │   └── image.ts       # Image URL builder
│   │   └── auth/               # Authentication utilities
│   │       └── getUser.ts      # Get current user
│   ├── public/                  # Static assets
│   │   ├── icons/              # Icon assets
│   │   └── images/             # Image assets
│   ├── styles/                  # Global styles
│   │   ├── global.css          # Global CSS
│   │   ├── master.css          # Component styles
│   │   ├── variables.css       # CSS variables
│   │   └── fonts.css          # Font imports
│   ├── type/                   # TypeScript type definitions
│   │   ├── event.ts           # Event type interface
│   │   ├── ticket.ts           # Ticket type interface
│   │   └── user.ts             # User type interface
│   └── types/                  # Additional types (if any)
├── .env.local               # Environment variables
├── .gitignore               # Git ignore file
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── proxy.ts                # Request middleware
└── README.md               # Project documentation
```
├── components/                   # Reusable React components
│   ├── event/                   # Event-related components
│   │   ├── EventCard.tsx        # Event display card
│   │   └── TicketSelector.tsx   # Ticket selection interface
│   ├── layout/                  # Layout components
│   └── ui/                      # UI primitives
│       ├── Button.tsx           # Custom button component
│       ├── Loader.tsx           # Loading states
│       └── Modal.tsx            # Modal dialogs
├── types/                       # TypeScript type definitions
│   ├── event.ts                # Event-related types
│   ├── ticket.ts               # Ticket-related types
│   └── user.ts                 # User-related types
├── styles/                      # Global styles and themes
│   ├── fonts.css               # Custom font definitions (assets required)
│   ├── global.css              # Global styles (imports variable.css + master.css)
│   ├── master.css              # Project-specific UI styles (cards, header menu)
│   └── variable.css            # CSS custom properties
├── lib/                         # Utility functions and configurations
├── public/                      # Static assets
└── proxy.ts                     # Request proxy (replaces deprecated middleware.ts)
```

## 🎨 Design System

### Styling Approach
- **Modern CSS Architecture**: Organized with variables, global styles, and component-specific styles
- **Accessibility First**: Reduced motion support, focus management, and semantic HTML
- **Performance Optimized**: Efficient CSS with minimal bundle impact
- **Responsive Design**: Mobile-first approach with fluid layouts

### Key Features
- Custom CSS variables for consistent theming
- Smooth animations and micro-interactions
- Optimized font loading with `next/font`
- Cross-browser compatibility

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beyond
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Firebase Client (used in browser)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# Firebase Admin (server only)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🔐 Authentication (Current)

- Client uses Firebase **Google sign-in popup** from the header.
- After popup login, the client sends the ID token to:
  - `POST /api/auth/login`
- Server creates a **Firebase session cookie** and sets it as `session` (httpOnly).
- Server-side user lookup is done via:
  - `lib/auth/getUser.ts` (`getCurrentUser()` reads and verifies the session cookie)
- Logout:
  - `POST /api/auth/logout` clears the cookie.

## 🧭 Protected Routes

Request gating is handled in `proxy.ts` (Next.js proxy):

- Redirects unauthenticated access for organizer paths.
- Verifies session cookie on protected matchers.

## 🧪 Development Notes (Windows / OneDrive)

If you see Turbopack/Dev errors like `os error 32` (file locked) under `.next`, it is commonly caused by OneDrive sync or antivirus locking files.

- Prefer running dev with webpack:

```bash
npx next dev --webpack
```

- If it persists, move the repo out of OneDrive (e.g. `C:\Projects\beyond`).

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://beyond.app](https://beyond.app)
- **Documentation**: [Next.js Documentation](https://nextjs.org/docs)
- **Support**: Open an issue on GitHub

---

Built with ❤️ using Next.js, React, and Tailwind CSS
