# FitTracker - Gym Workout Tracking Application

## Overview

FitTracker is a comprehensive fitness tracking application designed for gym enthusiasts to manage their workout routines, track exercises, and monitor progress over time. The application provides an intuitive mobile-first interface with calendar-based workout scheduling, real-time exercise tracking with counters and timers, and comprehensive workout management capabilities.

The system is built as a full-stack web application with a React frontend and Express.js backend, utilizing PostgreSQL for data persistence and featuring integrated authentication through Replit's authentication system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client application is built using React with TypeScript, following a component-based architecture pattern. The frontend utilizes several key architectural decisions:

- **UI Framework**: Built with shadcn/ui components and Radix UI primitives for consistent, accessible interface elements
- **Styling**: Uses Tailwind CSS with a custom design system featuring CSS variables for theming
- **State Management**: Implements TanStack Query (React Query) for server state management and caching
- **Routing**: Uses Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

The frontend follows a modular structure with reusable components for workout cards, calendar views, timers, and counters. The application features Vietnamese localization and supports dark mode theming.

### Backend Architecture
The server is built on Express.js with TypeScript, implementing a RESTful API architecture:

- **API Design**: RESTful endpoints for user, workout, and exercise management
- **Database Integration**: Uses Drizzle ORM for type-safe database operations
- **Session Management**: Implements session-based authentication with PostgreSQL session storage
- **Middleware**: Custom logging middleware for API request tracking and error handling

### Authentication System
The application integrates with Replit's OpenID Connect authentication system:

- **Authentication Provider**: Replit OIDC for secure user authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **User Management**: Automatic user creation and profile synchronization
- **Route Protection**: Middleware-based authentication checks for protected endpoints

### Data Storage Solutions
The application uses PostgreSQL as the primary database with the following schema design:

- **User Management**: Stores user profiles synchronized with Replit authentication
- **Workout Organization**: Hierarchical structure with workouts containing multiple exercises
- **Exercise Tracking**: Detailed exercise records with sets, reps, weights, and completion status
- **Session Storage**: Dedicated table for authentication session persistence

The database schema supports workout scheduling by date, exercise categorization by type (strength, cardio, core), and progress tracking with customizable rep counts and rest timers.

### Development and Build System
The project uses modern development tooling:

- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Full TypeScript implementation across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Package Management**: npm with workspace-style shared dependencies

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL database hosting (@neondatabase/serverless)
- **Replit Authentication**: OpenID Connect authentication service integration

### Core Libraries
- **Frontend Framework**: React 18 with TypeScript for component-based UI development
- **Backend Framework**: Express.js for RESTful API server implementation
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Query Management**: TanStack Query for server state management and caching

### UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Design System**: shadcn/ui for pre-built component patterns
- **Styling Framework**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Build System**: Vite for development server and production builds
- **Authentication**: Passport.js with OpenID Connect strategy for Replit integration
- **Session Management**: Express Session with PostgreSQL store (connect-pg-simple)
- **Date Handling**: date-fns for date manipulation and formatting with Vietnamese locale support

### Form and Validation
- **Form Handling**: React Hook Form for form state management
- **Validation**: Zod for runtime type validation and schema definition
- **Form Validation**: @hookform/resolvers for integration between React Hook Form and Zod

The application leverages these dependencies to create a robust, scalable fitness tracking platform with modern development practices and user experience patterns.