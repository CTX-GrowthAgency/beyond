# BEYOND – Fastest Event Ticketing Platform

A modern, high-performance event ticketing application built with Next.js 14, React 18, and Firebase. Features seamless ticket purchasing, QR code generation, Cashfree payment integration, and real-time booking management.

## 🚀 Features

### Core Functionality
- **Fast Ticket Booking**: Browse events and purchase tickets instantly
- **QR Code Integration**: Digital tickets with scannable QR codes for quick venue entry
- **Payment Processing**: Secure Cashfree payment gateway integration
- **Real-time Updates**: Webhook-based payment status synchronization
- **Mobile-First Design**: Optimized for all devices with responsive layouts

### User Experience
- **Intuitive Navigation**: Clean, modern interface with smooth transitions
- **Secure Authentication**: Firebase authentication with session management
- **Event Discovery**: Search and filter events by category, date, and location
- **Digital Wallet**: Store and manage purchased tickets with booking history

### Technical Features
- **Firebase Backend**: Real-time database with proper data schema
- **Email System**: Automated ticket delivery with QR codes
- **Production Ready**: Environment validation, error handling, and security measures
- **Type Safety**: Full TypeScript implementation with proper type definitions

## 🛠 Tech Stack

### Frontend
- **Next.js 14** – React framework with App Router
- **React 18** – React with concurrent features
- **TypeScript** – Type-safe development
- **Tailwind CSS** – Utility-first CSS framework
- **Firebase** – Authentication and Firestore database
- **Cashfree** – Payment gateway integration

### Backend & Infrastructure
- **Firebase Firestore** – Real-time NoSQL database
- **Firebase Authentication** – User authentication
- **Cashfree Payment Gateway** – Payment processing
- **Node.js** – Server-side runtime
- **QR Code Generation** – Digital ticket creation

### Development Tools
- **ESLint** – Code linting and formatting
- **PostCSS** – CSS processing pipeline
- **Hot Reload** – Instant development feedback

## 📁 Project Structure

```
beyond-frontend/
├── app/                          # Next.js 14 App Router
│   ├── (booking)/               # Booking flow routes
│   │   ├── checkout/[slug]/     # Event checkout page
│   │   ├── payment-success/     # Payment success redirect
│   │   └── success/[bookingId]/ # Booking confirmation page
│   ├── (public)/                # Public routes
│   │   ├── events/[slug]/       # Event detail page
│   │   ├── bookings/            # User bookings page
│   │   ├── contact/             # Contact page
│   │   ├── disclaimer/          # Legal disclaimer
│   │   ├── privacy-policy/      # Privacy policy
│   │   └── terms_and_conditions/ # Terms & conditions
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/          # Firebase login
│   │   │   └── logout/         # Firebase logout
│   │   ├── cashfree/           # Payment webhook handlers
│   │   │   ├── verify/         # Payment verification
│   │   │   └── webhook/        # Cashfree webhooks
│   │   ├── orders/             # Order management
│   │   │   └── create/         # Create payment order
│   │   └── qr/                 # QR code generation
│   │       └── [bookingId]/    # QR code endpoint
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # React components
│   ├── checkout/               # Checkout flow components
│   │   ├── CheckoutClient.tsx  # Main checkout form
│   │   └── PaymentSuccessView.tsx
│   ├── bookings/               # Booking management
│   │   ├── BookingDetail.tsx   # Single booking view
│   │   └── BookingsList.tsx    # User bookings list
│   ├── event/                  # Event display components
│   │   └── EventMobileStickyBar.tsx
│   └── ui/                     # Reusable UI components
├── lib/                        # Utility libraries
│   ├── email/                  # Email handling
│   │   ├── buildInvoiceHtml.ts # Invoice HTML generation
│   │   └── sendTicketEmail.ts  # Email sending logic
│   ├── firebase/               # Firebase configuration
│   │   ├── admin.ts           # Firebase admin setup
│   │   └── client.ts          # Firebase client setup
│   ├── auth/                  # Authentication utilities
│   │   └── getUser.ts         # Get current user
│   └── utils/                 # Helper functions
├── public/                     # Static assets
│   ├── icons/                 # Icon assets
│   └── images/                # Image assets
├── styles/                     # Global styles
│   ├── global.css             # Global CSS
│   ├── master.css             # Component styles
│   ├── variables.css          # CSS variables
│   └── fonts.css              # Font imports
├── types/                      # TypeScript type definitions
│   ├── booking.ts             # Booking types
│   ├── event.ts               # Event types
│   └── user.ts                # User types
├── .env.local                 # Environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
└── README.md                  # Project documentation
```

## 🗄️ Data Schema

### Firestore Collections

#### Users Collection (`users/{uid}`)
```typescript
interface UserDoc {
  name: string;           // User's full name
  email: string;          // Email address
  phone: string;          // Phone number (normalized)
  nationality?: string;   // Nationality (optional)
  state?: string;         // State (optional)
  createdAt: Timestamp;   // Account creation time
  updatedAt: Timestamp;   // Last update time
}
```

#### Events Collection (`events/{sanityId}`)
```typescript
interface EventDoc {
  title: string;          // Event title
  date: Timestamp;        // Event date
  venueName: string;      // Venue name
  status: 'active' | 'inactive'; // Event status
  ticketTypes: {          // Ticket type inventory
    [ticketTypeName: string]: {
      price: number;      // Ticket price
      capacity?: number;  // Available capacity
    };
  };
  createdAt: Timestamp;   // Document creation time
  updatedAt: Timestamp;   // Last update time
}
```

#### Bookings Collection (`bookings/{autoId}`)
```typescript
interface BookingDoc {
  // Core identifiers
  uid: string;                    // User ID (references users/{uid})
  eventId: string;                // Event ID (references events/{sanityId})
  bookingId: string;             // Human-readable booking reference
  
  // Ticket information
  tickets: Array<{               // Ticket breakdown
    name: string;                // Ticket type name
    price: number;               // Individual ticket price
    quantity: number;            // Number of tickets
    lineTotal: number;           // Total for this ticket type
  }>;
  
  // Pricing details
  pricing: {
    subtotal: number;            // Base amount
    convenienceFee: number;      // Platform fee
    gst: number;                 // GST amount
    grandTotal: number;          // Final amount
  };
  
  // Payment information
  cashfreeOrderId?: string;      // Cashfree order ID
  paymentReference?: string;     // Payment gateway reference
  paymentMethod?: string;        // Payment method used
  paymentStatus: 'pending' | 'completed' | 'failed';
  
  // Timestamps
  createdAt: Timestamp;          // Booking creation time
  expiresAt?: Timestamp;         // Payment expiry time
  paidAt?: Timestamp;            // Payment completion time
  verifiedAt?: Timestamp;        // Payment verification time
  notificationSentAt?: Timestamp; // Email sent timestamp
  
  // Status tracking
  ticketStatus: 'pending' | 'confirmed' | 'cancelled';
}
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Cashfree Payment Gateway
CASHFREE_ENV=production          # or 'sandbox' for testing
CASHFREE_APP_ID=your-app-id
CASHFREE_SECRET_KEY=your-secret-key
CASHFREE_WEBHOOK_SECRET=your-webhook-secret

# Application URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## � Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup
- Cashfree merchant account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beyond-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔄 Payment Flow

1. **Event Selection**: User selects event and tickets
2. **Checkout Form**: User fills billing details
3. **Order Creation**: Creates Cashfree order and stores in Firestore
4. **Payment Processing**: User completes payment via Cashfree
5. **Payment Verification**: Server verifies payment status
6. **Email Delivery**: Ticket email with QR code is sent
7. **Webhook Sync**: Cashfree webhook ensures status consistency

## 📱 Mobile Optimization

- Responsive design with Tailwind CSS
- Mobile-specific sticky booking bar
- Touch-optimized interactions
- Progressive enhancement for better performance

## 🔐 Security Considerations

- Environment variable validation
- Webhook signature verification
- Input sanitization and validation
- Secure payment processing
- Rate limiting on API endpoints

## 📧 Email System

### Ticket Email Features

- QR code generation for each ticket
- Professional invoice layout
- Event details and venue information
- Booking reference and payment details
- Idempotent delivery system

### Email Configuration

The system uses a custom email solution with:
- HTML invoice generation
- QR code embedding
- Responsive email templates
- Delivery tracking via `notificationSentAt`

## 🛠️ Development Guidelines

### Code Organization

- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Implement proper error boundaries
- Use React Server Components where appropriate

### Firebase Best Practices

- Use batch writes for atomic operations
- Implement proper security rules
- Optimize queries with indexes
- Handle offline scenarios gracefully

### Payment Integration

- Always verify payments server-side
- Handle webhook idempotency
- Implement proper error handling
- Use appropriate timeout values

## 📊 Monitoring & Analytics

- Payment success/failure tracking
- User booking patterns
- Performance monitoring
- Error logging and alerting

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] Cashfree webhook endpoints configured
- [ ] SSL certificates installed
- [ ] Performance optimization completed
- [ ] Error monitoring setup
- [ ] Backup procedures established

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🔍 Troubleshooting

### Common Issues

1. **Payment Verification Fails**
   - Check Cashfree credentials
   - Verify webhook configuration
   - Ensure proper signature validation

2. **QR Code Not Displaying**
   - Check QR code API endpoint
   - Verify CORS settings
   - Ensure proper image encoding

3. **Email Delivery Issues**
   - Verify email configuration
   - Check spam filters
   - Ensure proper template rendering

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=beyond:*
```

## � License

This project is proprietary software. All rights reserved.

## 🤝 Support

For technical support or questions:
- Create an issue in the project repository
- Contact the development team
- Check the documentation for common solutions

---

**Last Updated**: February 2026
**Version**: 2.0.0
**Framework**: Next.js 14, React 18, TypeScript
