# PayRing Platform

**Payments. Agreements. Trust.**

PayRing is a next-generation fintech platform combining P2P payments with legally-structured agreements and AI-powered contract generation.

## 🏗️ Architecture

```
payring/
├── payring-shared/     # Shared types, constants, utilities
├── payring-web/        # React web application (Vite + Tailwind)
├── payring-mobile/     # React Native mobile app (Expo)
└── PayRing/            # Legacy prototype (deprecated)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (for mobile development)

### Installation

```bash
# 1. Install shared package dependencies
cd payring-shared
npm install
npm run build

# 2. Install web dependencies
cd ../payring-web
npm install

# 3. Install mobile dependencies
cd ../payring-mobile
npm install
```

### Running the Apps

**Web:**
```bash
cd payring-web
npm run dev
# Opens at http://localhost:5173
```

**Mobile (iOS/Android):**
```bash
cd payring-mobile
npm start
# Scan QR code with Expo Go app
```

## 📦 Package Structure

### payring-shared
Core shared code between platforms:
- **Types**: User, Agreement, Milestone, Payment, Notification models
- **Constants**: Agreement types, status colors, template categories
- **Utils**: Currency formatting, validation, date helpers
- **Firebase**: Shared Firebase configuration

### payring-web
React web application:
- **Vite** + React 18 + TypeScript
- **Tailwind CSS** + Radix UI components
- **Zustand** for state management
- **React Router v6** for navigation
- **Firebase** Auth + Firestore

### payring-mobile
React Native mobile app:
- **Expo SDK 53** + expo-router
- **React Native** 0.79
- **Zustand** with AsyncStorage persistence
- **Firebase** Auth + Firestore

## 🎨 Design System

### Colors
- **Primary**: #7C3AED (PayRing Purple)
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

### Typography
- **Display**: 30px bold
- **Title**: 24px semibold
- **Body**: 16px regular
- **Caption**: 12px regular

## 🔑 Core Features

### 1. Smart Agreements
- 11+ template types (Freelance, Employment, Loans, Sales, etc.)
- Multi-party support
- Milestone-based payment tracking
- Digital signatures

### 2. AI-Powered Drafting
- Voice-to-agreement transcription
- AI term extraction and structuring
- Template recommendations
- Smart clause suggestions

### 3. Instant Payments
- Send & request money
- Split payments
- Milestone releases
- Escrow protection

### 4. Activity Tracking
- Real-time notifications
- Transaction history
- Agreement status updates
- Payment confirmations

## 🔥 Firebase Configuration

The app uses Firebase for:
- **Authentication**: Email/password, Google Sign-in
- **Firestore**: Real-time data synchronization
- **Storage**: Document and media storage
- **Functions**: Stripe payment processing

Project ID: `payring-10a44`

## 📱 Mobile Screens

1. **Dashboard** - Balance, quick actions, recent activity
2. **Payments** - Send/request money, recent contacts
3. **Agreements** - List, filter, manage agreements
4. **Activity** - Notifications, transaction history
5. **Settings** - Profile, preferences, security

## 🌐 Web Screens

1. **Dashboard** - Overview with stats and activity
2. **Payments** - Full payment management
3. **Agreements** - Agreement list and creation
4. **Activity** - Notification center
5. **Settings** - Account management

## 🔐 Authentication Flow

1. User lands on auth screen
2. Sign up / Sign in with email or Google
3. Auth state persisted to AsyncStorage (mobile) / localStorage (web)
4. Protected routes redirect unauthenticated users
5. Firebase Auth listener updates global state

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  walletBalance: number;
}
```

### Agreement
```typescript
interface Agreement {
  id: string;
  title: string;
  type: AgreementType;
  status: AgreementStatus;
  creatorId: string;
  counterpartyId: string;
  milestones: Milestone[];
  totalValue: number;
}
```

### Milestone
```typescript
interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
}
```

## 🛠️ Development

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

### Testing
```bash
# Run web tests
cd payring-web
npm test

# Run mobile tests
cd payring-mobile
npm test
```

### Building for Production

**Web:**
```bash
cd payring-web
npm run build
# Output in dist/
```

**Mobile:**
```bash
cd payring-mobile
npx expo build:android
npx expo build:ios
```

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

Built with 💜 by PayRing Team
