# FitConnect Ads - Next.js Frontend Application

A fitness platform application with public-facing gym directory pages and a gym owner dashboard for managing gyms, plans, classes, trainers, and content.

## Features

### Public Pages
- **Gym Listing Page**: Browse all gyms with featured and all sections
- **Individual Gym Page**: View gym details, classes, plans, and trainers
- **Login Page**: Authentication for gym owners

### Dashboard Pages (Protected)
- **Plans Management**: CRUD operations for membership plans
- **Classes Management**: CRUD operations for gym classes
- **Trainers Management**: CRUD operations for trainers
- **CMS/Branding**: Edit content and branding elements
- **Payment Gateway**: Process payments for premium features
- **Advertisement Payment**: Manage advertisement subscriptions with QR code

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Icons**: React Icons
- **QR Code**: qrcode.react

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Live Demo

🚀 **[View Live Demo](https://nbose17.github.io/webdebproject/)**

The application is automatically deployed to GitHub Pages on every push to the `main` branch.

### GitHub Pages Setup

The app is configured for static export and deployed via GitHub Actions:

1. **Automatic Deployment**: Push to `main` branch triggers deployment
2. **Build Process**: GitHub Actions builds the static site
3. **Deployment**: Automatically published to GitHub Pages

### Manual Deployment

If you need to deploy manually:

```bash
# Build the static export
npm run export

# The output will be in the 'out' directory
```

### Deployment Configuration

- **Base Path**: `/webdebproject`
- **Output**: Static HTML/CSS/JS files
- **Image Optimization**: Disabled (required for static export)
- **Deployment URL**: `https://nbose17.github.io/webdebproject/`

## Project Structure

```
app/
├── (public)/          # Public pages
├── (dashboard)/       # Dashboard pages (protected)
components/
├── public/            # Public page components
├── dashboard/         # Dashboard components
└── shared/            # Shared UI components
styles/                # Global and page-specific styles
lib/                   # Types, constants, utilities
hooks/                 # Custom React hooks
contexts/              # React contexts
public/                # Static assets
```

## Authentication

The application uses mock authentication for Phase 1. Any email/password combination will work for login. In Phase 2, this will be replaced with real backend authentication.

## Mock Data

All data is currently stored in `lib/constants.ts` as mock data. In Phase 2, this will be replaced with API calls to a backend.

## Notes

- Phase 1 is frontend-only with mock data
- Authentication is mocked (no real backend)
- All CRUD operations work with local state/mock data
- Payment forms are UI-only (no actual payment processing)
- QR code is generated client-side
- Images are placeholder/mock images

## Phase 2 (Future)

- Backend integration
- Real authentication
- Database integration
- Payment processing
- Image uploads
- Email notifications





