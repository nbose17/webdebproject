<!-- e72eabab-eba9-4830-ac56-b8c43bb2ed6d c72b8196-f49c-46af-9501-aecc2bc9127a -->
# FitConnect Ads - Next.js Frontend Implementation Plan

## Project Overview

A fitness platform application with public-facing gym directory pages and a gym owner dashboard for managing gyms, plans, classes, trainers, and content.

## Project Setup

### 1. Initialize Next.js Project

- Create Next.js 14+ project with TypeScript and App Router
- Use CSS (not Tailwind) for styling
- Configure project structure

### 2. Project Structure

```
app/
├── (public)/
│   ├── page.tsx                    # Public Gym Listing Page
│   ├── gym/
│   │   └── [id]/
│   │       └── page.tsx            # Individual Gym Public Page
│   └── login/
│       └── page.tsx                # Login Page
├── (dashboard)/
│   └── dashboard/
│       ├── layout.tsx              # Dashboard layout with sidebar
│       ├── page.tsx                # Dashboard home/overview
│       ├── plans/
│       │   └── page.tsx            # Plans management
│       ├── classes/
│       │   └── page.tsx            # Classes management
│       ├── trainers/
│       │   └── page.tsx            # Trainers management
│       ├── cms/
│       │   └── page.tsx            # CMS/Branding management
│       ├── payment/
│       │   └── page.tsx            # Payment Gateway
│       ├── advertisement/
│       │   └── page.tsx            # Advertisement Payment
│       └── settings/
│           └── page.tsx            # Settings
├── components/
│   ├── public/
│   │   ├── Header.tsx               # Public page header
│   │   ├── Footer.tsx               # Public page footer
│   │   ├── GymCard.tsx              # Gym listing card
│   │   ├── AdvertisementBanner.tsx  # Feature banner
│   │   ├── HeroSection.tsx          # Gym page hero
│   │   ├── ClassCard.tsx            # Class display card
│   │   ├── PlanCard.tsx             # Plan display card
│   │   ├── TrainerCard.tsx          # Trainer display card
│   │   └── NewsletterSection.tsx    # Newsletter CTA
│   ├── dashboard/
│   │   ├── Sidebar.tsx              # Dashboard sidebar navigation
│   │   ├── DataTable.tsx            # Reusable table component
│   │   ├── PlanForm.tsx             # Add/Edit plan form
│   │   ├── ClassForm.tsx            # Add/Edit class form
│   │   ├── TrainerForm.tsx          # Add/Edit trainer form
│   │   ├── CMSForm.tsx              # CMS item edit form
│   │   ├── PaymentForm.tsx          # Payment gateway form
│   │   └── QRCodeDisplay.tsx        # QR code component
│   └── shared/
│       ├── Button.tsx                # Reusable button
│       ├── Input.tsx                 # Reusable input
│       ├── Modal.tsx                 # Modal dialog
│       └── Carousel.tsx              # Carousel/slider component
├── styles/
│   ├── globals.css                  # Global styles and CSS variables
│   ├── public.css                   # Public page styles
│   └── dashboard.css                # Dashboard styles
├── lib/
│   ├── types.ts                     # TypeScript interfaces
│   ├── constants.ts                 # Constants and mock data
│   └── utils.ts                     # Utility functions
├── hooks/
│   ├── useAuth.ts                   # Authentication hook
│   └── useGymData.ts                # Data fetching hook
└── layout.tsx                       # Root layout

public/
├── images/                          # Static images
└── icons/                           # Icon files
```

## Implementation Tasks

### Phase 1: Foundation Setup

#### Task 1.1: Project Initialization

- Initialize Next.js project with TypeScript
- Set up folder structure
- Configure package.json dependencies
- Create basic layout.tsx

#### Task 1.2: Design System & Styling

- Create [styles/globals.css](styles/globals.css) with CSS variables:
  - Color palette: dark gray (#2D2D2D), light gray (#F5F5F5), white, green accents
  - Typography: sans-serif font family, font sizes, weights
  - Spacing: consistent margin/padding scale
  - Border radius: rounded corners (8px, 12px, etc.)
- Create [styles/public.css](styles/public.css) for public pages
- Create [styles/dashboard.css](styles/dashboard.css) for dashboard pages

#### Task 1.3: TypeScript Types

- Create [lib/types.ts](lib/types.ts) with interfaces:
  - `Gym`, `Plan`, `Class`, `Trainer`, `User`, `CMSItem`, `PaymentMethod`
- Define all data structures matching Figma designs

#### Task 1.4: Mock Data

- Create [lib/constants.ts](lib/constants.ts) with mock data:
  - Sample gyms, plans, classes, trainers
  - Mock user data for authentication

### Phase 2: Shared Components

#### Task 2.1: Basic UI Components

- [components/shared/Button.tsx](components/shared/Button.tsx): Reusable button with variants
- [components/shared/Input.tsx](components/shared/Input.tsx): Form input component
- [components/shared/Modal.tsx](components/shared/Modal.tsx): Modal dialog for forms
- [components/shared/Carousel.tsx](components/shared/Carousel.tsx): Carousel with pagination dots

#### Task 2.2: Authentication System

- Create [hooks/useAuth.ts](hooks/useAuth.ts) for auth state management
- Create AuthContext for global auth state
- Implement protected route wrapper

### Phase 3: Public Pages

#### Task 3.1: Public Gym Listing Page

- Create [app/(public)/page.tsx](app/\\\(public)/page.tsx)
- Implement [components/public/Header.tsx](components/public/Header.tsx):
  - "Public Gym Listing Page" title
  - "FitConnect Ads" branding
  - "Login" link and "Post Advertisement" button
- Implement [components/public/AdvertisementBanner.tsx](components/public/AdvertisementBanner.tsx)
- Implement [components/public/GymCard.tsx](components/public/GymCard.tsx):
  - Gym image, name, location
  - White card with rounded corners
- Implement [components/public/Footer.tsx](components/public/Footer.tsx):
  - "FitConnect Ads" branding
  - Social media icons (Facebook, Instagram, X)
- Add "Newly Featured" and "All" sections with grid layout
- Implement "Load More" button functionality

#### Task 3.2: Individual Gym Public Page

- Create [app/(public)/gym/[id]/page.tsx](app/(public)/gym/[id]/page.tsx)
- Implement [components/public/HeroSection.tsx](components/public/HeroSection.tsx):
  - Background image with overlay
  - "STAY HEALTHY, STAY FIT" heading
  - "GET IN SHAPE NOW" main text
  - "See All Classes" and "View Plans" buttons
- Implement navigation header with logo and menu items
- Create Feature Section with banner
- Implement [components/public/ClassCard.tsx](components/public/ClassCard.tsx)
- Implement [components/public/PlanCard.tsx](components/public/PlanCard.tsx)
- Implement [components/public/TrainerCard.tsx](components/public/TrainerCard.tsx)
- Add carousel functionality for Classes, Plans, and Trainers sections
- Implement [components/public/NewsletterSection.tsx](components/public/NewsletterSection.tsx)
- Create footer with contact information

#### Task 3.3: Login Page

- Create [app/(public)/login/page.tsx](app/\\\(public)/login/page.tsx)
- Implement login form with email/password fields
- Add form validation
- Connect to authentication hook

### Phase 4: Dashboard Pages

#### Task 4.1: Dashboard Layout

- Create [app/(dashboard)/dashboard/layout.tsx](app/\\\(dashboard)/dashboard/layout.tsx)
- Implement [components/dashboard/Sidebar.tsx](components/dashboard/Sidebar.tsx):
  - "FitConnect Ads" branding at top
  - Navigation links: Plans, Trainers, Classes, CMS/Branding, Settings, Logout
  - Active state highlighting
- Create protected route wrapper
- Apply dashboard styling

#### Task 4.2: Dashboard - Plans Page

- Create [app/(dashboard)/dashboard/plans/page.tsx](app/\\\(dashboard)/dashboard/plans/page.tsx)
- Implement [components/dashboard/DataTable.tsx](components/dashboard/DataTable.tsx):
  - Reusable table with columns: No, Name, Duration, Price, Actions
  - Edit and Delete action buttons
- Implement [components/dashboard/PlanForm.tsx](components/dashboard/PlanForm.tsx):
  - Add/Edit plan modal form
  - Fields: Name, Duration, Price
- Add "Add Plan" button
- Implement CRUD operations (frontend only, mock data)

#### Task 4.3: Dashboard - Classes Page

- Create [app/(dashboard)/dashboard/classes/page.tsx](app/\\\(dashboard)/dashboard/classes/page.tsx)
- Reuse DataTable component with columns: No, Name, Duration, No of Classes, Price, Actions
- Implement [components/dashboard/ClassForm.tsx](components/dashboard/ClassForm.tsx)
- Add "Add Class" button
- Implement CRUD operations

#### Task 4.4: Dashboard - Trainers Page

- Create [app/(dashboard)/dashboard/trainers/page.tsx](app/\\\(dashboard)/dashboard/trainers/page.tsx)
- Reuse DataTable with columns: No, Name, Experience, Actions
- Implement [components/dashboard/TrainerForm.tsx](components/dashboard/TrainerForm.tsx)
- Add "Add Trainer" button (note: design shows "Add Plan" but should be "Add Trainer")
- Implement CRUD operations

#### Task 4.5: Dashboard - CMS/Branding Page

- Create [app/(dashboard)/dashboard/cms/page.tsx](app/\\\(dashboard)/dashboard/cms/page.tsx)
- Display table with CMS items: Hero Section Main, Hero Section Sub, Feature Banner, Business Logo, Business Timing, Business Email, Business Contact
- Implement [components/dashboard/CMSForm.tsx](components/dashboard/CMSForm.tsx) for editing each item
- Only Edit action (no Add/Delete)

#### Task 4.6: Dashboard - Payment Gateway Page

- Create [app/(dashboard)/dashboard/payment/page.tsx](app/\\\(dashboard)/dashboard/payment/page.tsx)
- Implement [components/dashboard/PaymentForm.tsx](components/dashboard/PaymentForm.tsx):
  - Payment methods section (PayPal, VISA logos)
  - Premium selection with features list
  - Payment information form (card number, expiration, security code)
  - Billing information form (name, country, address, state, phone, zip)
  - "Remember Me" checkbox
  - "Continue" button
  - Total amount display

#### Task 4.7: Dashboard - Advertisement Payment Page

- Create [app/(dashboard)/dashboard/advertisement/page.tsx](app/\\\(dashboard)/dashboard/advertisement/page.tsx)
- Display subscription information ($5/month, 30 days)
- Implement [components/dashboard/QRCodeDisplay.tsx](components/dashboard/QRCodeDisplay.tsx):
  - QR code image/component
  - "Download QR" option
  - Link display: https://fitnessclub.com

#### Task 4.8: Dashboard - Settings Page

- Create [app/(dashboard)/dashboard/settings/page.tsx](app/\\\(dashboard)/dashboard/settings/page.tsx)
- Basic settings form (to be defined based on requirements)

### Phase 5: Functionality & Polish

#### Task 5.1: State Management

- Implement Context API or Zustand for global state
- Manage gym data, plans, classes, trainers state
- Implement form state management

#### Task 5.2: Responsive Design

- Add media queries for mobile (768px), tablet (1024px), desktop (1280px)
- Ensure grid layouts adapt to screen sizes
- Make sidebar collapsible on mobile
- Test all pages on different screen sizes

#### Task 5.3: Form Validation

- Add client-side validation for all forms
- Display error messages
- Prevent invalid submissions

#### Task 5.4: Image Handling

- Set up image optimization with Next.js Image component
- Create placeholder images for development
- Implement image upload UI (frontend only, no backend)

#### Task 5.5: Navigation & Routing

- Implement Next.js routing
- Add active link states
- Handle protected routes
- Add loading states

#### Task 5.6: UI Polish

- Add hover effects on buttons and cards
- Implement loading states
- Add transitions and animations
- Ensure consistent spacing and alignment
- Match Figma design specifications exactly

## Technical Specifications

### Styling Approach

- Use CSS Modules or global CSS (no Tailwind)
- CSS variables for theming
- Responsive breakpoints: 768px, 1024px, 1280px
- Color scheme: Dark gray (#2D2D2D), light gray (#F5F5F5), white, green accents

### Key Dependencies

- next: ^14.0.0
- react: ^18.0.0
- react-dom: ^18.0.0
- typescript: ^5.0.0
- react-icons or lucide-react (for icons)
- qrcode.react (for QR code generation)

### Mock Data Structure

- Gyms: id, name, location, image, featured status
- Plans: id, name, duration, price
- Classes: id, name, duration, numberOfClasses, price
- Trainers: id, name, experience, image
- CMS Items: id, name, content/value

## Notes

- Phase 1 is frontend-only with mock data
- Authentication will be mocked (no real backend)
- All CRUD operations will work with local state/mock data
- Payment forms will be UI-only (no actual payment processing)
- QR code will be generated client-side
- Images will be placeholder/mock images
- Phase 2 will add backend integration, real authentication, database, and payment processing

### To-dos

- [ ] Initialize Next.js project with TypeScript, create folder structure, and configure dependencies
- [ ] Create CSS design system with variables for colors, typography, spacing, and responsive breakpoints
- [ ] Define TypeScript interfaces and create mock data constants for all entities (gyms, plans, classes, trainers)
- [ ] Build reusable UI components: Button, Input, Modal, Carousel
- [ ] Implement authentication hook and context for frontend auth state management
- [ ] Build Public Gym Listing Page with header, advertisement banner, gym cards grid, and footer
- [ ] Build Individual Gym Public Page with hero section, feature banner, classes/plans/trainers carousels, and newsletter
- [ ] Create login page with authentication form
- [ ] Build dashboard layout with sidebar navigation and protected route wrapper
- [ ] Implement Plans management page with data table and CRUD forms
- [ ] Implement Classes management page with data table and CRUD forms
- [ ] Implement Trainers management page with data table and CRUD forms
- [ ] Implement CMS/Branding page with editable content items
- [ ] Build Payment Gateway page with payment methods and billing form
- [ ] Build Advertisement Payment page with subscription info and QR code display
- [ ] Add responsive styles and test all pages on mobile, tablet, and desktop breakpoints
- [ ] Add form validation, loading states, hover effects, and final UI polish to match Figma designs