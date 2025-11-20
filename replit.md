# Divine Naturals Dairy Delivery App

## Overview

Divine Naturals is a minimalist, eco-friendly dairy delivery application that enables customers to schedule milk deliveries and purchase dairy products. The app features a mobile-first design with role-based access for customers, vendors, delivery partners, and administrators with the tagline "Pure. Fresh. Daily."

## User Preferences

- Preferred communication style: Simple, everyday language.
- Design preference: Simple, clean designs over complex styling (no neumorphism, glassmorphism, or premium visual effects)
- User feedback: Complex themes consistently rejected as looking "worst"

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom eco-friendly color palette
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Mobile-First Design**: Optimized for mobile devices with responsive layouts

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

## Key Components

### Database Schema
The application uses a comprehensive schema supporting:
- **User Management**: Multi-role user system (customer, admin, vendor, delivery)
- **Product Catalog**: Dairy products with category management
- **Order System**: Complete order lifecycle with item tracking
- **Milk Subscriptions**: Recurring delivery scheduling
- **Vendor Management**: Business partnerships and supply chain
- **Delivery Network**: Partner logistics coordination
- **Notifications**: Real-time user communications

### Authentication System
- **Provider**: Replit Auth integration
- **Session Storage**: PostgreSQL-backed sessions with automatic cleanup
- **Role-Based Access**: Different interfaces for each user type
- **Security**: HTTP-only cookies with secure flags

### API Structure
RESTful API endpoints organized by domain:
- `/api/auth/*` - Authentication and user management
- `/api/products/*` - Product catalog operations
- `/api/orders/*` - Order management
- `/api/milk-subscription/*` - Subscription handling
- `/api/vendors/*` - Vendor operations
- `/api/delivery/*` - Delivery partner management
- `/api/notifications/*` - User notifications

### UI Components
- **Customer Interface**: Bottom tab navigation with Home, Milk, Shop, Orders, Profile
- **Shared Components**: Reusable UI elements following eco-friendly design system
- **Layout System**: Responsive layouts with mobile-optimized floating elements
- **Color Scheme**: Custom eco-palette with creamy whites, soft greens, and pastel blues

## Data Flow

### Order Processing
1. Customer places order through mobile interface
2. Order validation and inventory checks
3. Vendor notification and preparation
4. Delivery partner assignment
5. Real-time status updates
6. Completion confirmation

### Milk Subscription Flow
1. Customer configures subscription (quantity, frequency, delivery time)
2. Automated recurring order generation
3. Vendor supply coordination
4. Scheduled delivery execution
5. Subscription management and modifications

### Authentication Flow
1. Replit Auth OpenID Connect integration
2. Session creation with PostgreSQL storage
3. Role-based route protection
4. Automatic session cleanup

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **express**: Web framework
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon system
- **wouter**: Lightweight routing

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **drizzle-kit**: Database migrations

## Deployment Strategy

### Build Process
1. **Client Build**: Vite processes React application with TypeScript compilation
2. **Server Build**: esbuild bundles Node.js server for production
3. **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Authentication domain configuration
- **NODE_ENV**: Environment detection

### Production Setup
- Server runs on Node.js with express
- Static assets served from dist/public
- Database migrations applied via drizzle-kit
- Session storage in PostgreSQL for scalability

The application is designed for deployment on platforms supporting Node.js with PostgreSQL databases, with particular optimization for Replit's hosting environment.