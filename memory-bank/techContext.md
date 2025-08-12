# Technology Context: FitTracker

## Frontend Technologies

### React (TypeScript)
- **Core Framework**: React 18+ with TypeScript for type safety
- **Component Model**: Functional components with hooks
- **State Management**: React Query for server state, local component state for UI
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite for fast development and optimized production builds

### UI Framework
- **Styling**: Tailwind CSS for utility-first styling approach
- **Component Library**: Custom UI components based on shadcn/ui patterns
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: WCAG-compliant components with proper ARIA attributes

### Development Tools
- **Language**: TypeScript for static type checking
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for code formatting consistency
- **Testing**: Jest and React Testing Library for unit testing
- **Dev Server**: Vite development server with hot module replacement

## Backend Technologies

### Node.js
- **Runtime**: Node.js 16+ for server-side JavaScript execution
- **Framework**: Express.js for REST API implementation
- **Middleware**: Custom middleware for authentication and error handling
- **Routing**: Express router for API endpoint organization

### Database
- **ORM**: Drizzle ORM for database operations
- **Database**: SQLite (via Replit's built-in database)
- **Schema Management**: Drizzle Kit for schema definition and migrations
- **Query Building**: Type-safe query building with Drizzle ORM

### Authentication
- **Provider**: Replit Auth for user authentication
- **Session Management**: Cookie-based session handling
- **Protection**: Middleware for protected route access

## Shared Technologies

### TypeScript
- **Type Safety**: Shared TypeScript interfaces and types
- **Code Reuse**: Common types between frontend and backend
- **Validation**: Runtime type checking with Zod (if used)

### Build and Deployment
- **Package Manager**: npm for dependency management
- **Scripts**: Custom npm scripts for development, building, and deployment
- **Environment**: Replit hosting environment
- **CI/CD**: Replit's built-in deployment system

## Development Environment

### Editor/IDE
- **Primary**: Replit online IDE
- **Alternatives**: VS Code with appropriate extensions
- **Extensions**: TypeScript, ESLint, Prettier extensions

### Version Control
- **System**: Git for version control
- **Hosting**: Replit's built-in Git integration
- **Workflow**: Feature branch workflow with main branch protection

### Testing
- **Unit Testing**: Jest for JavaScript/TypeScript testing
- **Component Testing**: React Testing Library for React components
- **API Testing**: Supertest for Express API endpoint testing
- **End-to-End**: Cypress or Playwright for E2E testing (if implemented)

## Dependencies

### Frontend Dependencies
- react, react-dom: Core React libraries
- react-router-dom: Client-side routing
- @tanstack/react-query: Server state management
- tailwindcss: Utility-first CSS framework
- lucide-react: Icon library
- recharts: Charting library for data visualization
- class-variance-authority: Component variance management
- clsx: Conditional class name management
- tailwind-merge: Tailwind CSS class merging

### Backend Dependencies
- express: Web framework
- drizzle-orm: Database ORM
- sqlite3: SQLite database driver
- cors: Cross-origin resource sharing middleware
- dotenv: Environment variable management
- zod: Schema validation (if used)

### Development Dependencies
- typescript: TypeScript compiler
- vite: Build tool and development server
- @types/*: TypeScript type definitions
- eslint: Code linting
- prettier: Code formatting
- jest: Testing framework
- ts-jest: TypeScript preprocessor for Jest

## Configuration Files
- tsconfig.json: TypeScript configuration
- vite.config.ts: Vite build configuration
- tailwind.config.ts: Tailwind CSS configuration
- postcss.config.js: PostCSS configuration
- drizzle.config.ts: Drizzle ORM configuration
- package.json: Project metadata and scripts
- .gitignore: Git ignore patterns
- .eslintrc: ESLint configuration
- .prettierrc: Prettier configuration

## Performance Considerations
- Bundle optimization with Vite
- Code splitting for lazy loading
- Caching strategies with React Query
- Efficient database queries with Drizzle ORM
- Image optimization (if applicable)
- Minification and compression

## Security Considerations
- Input validation and sanitization
- Secure authentication with Replit Auth
- Protected API endpoints
- CORS configuration
- Secure headers (if implemented)
- Environment variable management for secrets

## Scalability Considerations
- Stateless server architecture
- Database connection pooling
- Caching strategies
- Load balancing readiness
- Microservice readiness (future consideration)