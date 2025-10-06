# 🏗️ Project Structure

## Overview

This is a modern full-stack case management system built with **Next.js 14** (frontend) and **Express + MongoDB** (backend).

---

## 📂 Directory Structure

```
anri/
├── client/                          # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/                     # Next.js App Router (Pages)
│   │   │   ├── page.js             # Home page - Cases list
│   │   │   ├── layout.js           # Root layout with Header
│   │   │   ├── globals.css         # Global styles & CSS variables
│   │   │   └── cases/
│   │   │       └── [id]/
│   │   │           └── page.js     # Dynamic case details page
│   │   │
│   │   ├── components/              # React components
│   │   │   ├── cases/              # Case-specific components
│   │   │   │   ├── CaseCard.js         (Mobile card view)
│   │   │   │   ├── CaseForm.js         (Add/Edit form)
│   │   │   │   ├── CasesTable.js       (Desktop table view)
│   │   │   │   └── SearchBar.js        (Search & filter)
│   │   │   ├── layout/             # Layout components
│   │   │   │   └── Header.js           (Top navigation)
│   │   │   └── ui/                 # Reusable UI components
│   │   │       └── Modal.js            (Modal dialog)
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useDebounce.js          (Debounced values)
│   │   │   └── useResponsive.js        (Responsive breakpoints)
│   │   │
│   │   └── lib/                     # Utilities & configurations
│   │       ├── http.js                 (Axios instance)
│   │       └── utils.js                (Helper functions)
│   │
│   ├── public/                      # Static assets
│   ├── next.config.js              # Next.js configuration
│   ├── jsconfig.json               # Path aliases (@/)
│   ├── package.json                # Dependencies
│   └── README.md                   # Documentation
│
├── server/                          # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── db/
│   │   │   └── mongoose.js         # MongoDB connection
│   │   ├── models/
│   │   │   └── Case.js             # Case schema
│   │   ├── routes/
│   │   │   └── cases.js            # API routes
│   │   └── index.js                # Express app entry
│   │
│   └── package.json                # Dependencies
│
├── .gitignore                       # Git ignore rules
└── PROJECT_STRUCTURE.md            # This file
```

---

## 🎯 Architecture Principles

### Frontend (Client)

**Framework**: Next.js 14 with App Router

**Key Principles**:

1. **File-based routing** - Pages in `src/app/` directory
2. **CSS Modules** - Scoped styling with `.module.css` files
3. **Component organization** - Grouped by feature/type
4. **Custom hooks** - Reusable logic extraction
5. **Environment variables** - Configuration via `.env.local`

**Component Structure**:

- `app/` - Pages and layouts
- `components/cases/` - Domain-specific components
- `components/layout/` - Layout/navigation components
- `components/ui/` - Reusable UI primitives
- `hooks/` - Custom React hooks
- `lib/` - Utilities and configurations

### Backend (Server)

**Framework**: Express.js + MongoDB

**Key Principles**:

1. **Separation of concerns** - Models, routes, database
2. **RESTful API** - Standard HTTP methods
3. **MongoDB + Mongoose** - NoSQL database
4. **CORS enabled** - Cross-origin requests

**Structure**:

- `models/` - Mongoose schemas
- `routes/` - API endpoints
- `db/` - Database connection
- `index.js` - Express app setup

---

## 🔧 Configuration Files

### Client

| File             | Purpose                         |
| ---------------- | ------------------------------- |
| `next.config.js` | Next.js configuration           |
| `jsconfig.json`  | JavaScript config, path aliases |
| `.eslintrc.json` | ESLint rules                    |
| `package.json`   | Dependencies & scripts          |

### Server

| File           | Purpose                            |
| -------------- | ---------------------------------- |
| `package.json` | Dependencies & scripts             |
| `.env`         | Environment variables (not in git) |

---

## 🚀 Best Practices Implemented

### ✅ Code Organization

- Clear separation between pages, components, and utilities
- Grouped components by domain (cases, layout, ui)
- Single responsibility principle for each component

### ✅ Performance

- CSS Modules for optimized styling
- Debounced search to reduce API calls
- Memoization with `useMemo` for expensive computations
- Next.js automatic code splitting

### ✅ User Experience

- Responsive design (mobile-first)
- Loading states for async operations
- Error handling and empty states
- Keyboard shortcuts (ESC to close modals)

### ✅ Developer Experience

- Path aliases (`@/`) for clean imports
- Consistent naming conventions
- Comprehensive documentation
- Environment variables for configuration

### ✅ Security

- Environment variables for sensitive data
- CORS configuration
- Input validation (client & server)
- Git ignore for secrets

### ✅ Maintainability

- Modular component structure
- Reusable custom hooks
- CSS variables for theming
- Clear file naming

---

## 📝 Naming Conventions

### Files

- **Pages**: `page.js` (Next.js convention)
- **Components**: PascalCase (e.g., `CaseCard.js`)
- **Styles**: `ComponentName.module.css`
- **Hooks**: `useHookName.js`
- **Utils**: camelCase (e.g., `utils.js`)

### Code

- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS classes**: camelCase (in modules)

---

## 🔄 Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Hook (optional - logic)
    ↓
API Call (lib/http.js)
    ↓
Backend API (server/routes/)
    ↓
Database (MongoDB)
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

---

## 📱 Responsive Design

**Breakpoints**:

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: > 1024px

**Strategy**:

- Mobile-first CSS
- `useResponsive` hook for component logic
- Different views: Cards (mobile) vs Table (desktop)
- Touch-friendly interactions on mobile

---

## 🎨 Styling System

**Approach**: CSS Modules + Global CSS Variables

**Global Variables** (`app/globals.css`):

```css
--primary-green: #4caf50
--accent-color: #1a73e8
--error-color: #d32f2f
--text-primary: #1a1a1a
--border-radius-md: 8px
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
```

**Component Styles**: Scoped CSS Modules prevent conflicts

---

## 🔌 API Integration

**Base URL**: Configured in `lib/http.js`

**Environment Variable**:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Axios Instance**: Pre-configured with base URL and headers

---

## 📦 State Management

**Strategy**: React built-in state (no Redux)

- `useState` - Component state
- `useEffect` - Side effects & data fetching
- `useMemo` - Computed values
- Props - Parent-child communication

**Why?**:

- Simple application
- No complex global state
- Better performance
- Easier to understand

---

## 🧪 Development Workflow

### Starting the Application

**Backend**:

```bash
cd server
npm install
npm start
# Runs on http://localhost:4000
```

**Frontend**:

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:3000
```

### Adding New Features

1. **New Page**: Create `src/app/[page-name]/page.js`
2. **New Component**: Add to appropriate `components/` subfolder
3. **New Hook**: Add to `hooks/` with `use` prefix
4. **New Utility**: Add to `lib/`
5. **Styles**: Create matching `.module.css` file

---

## 🔒 Environment Variables

### Client

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- Public variables must start with `NEXT_PUBLIC_`

### Server

- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `DEMO_MODE` - Enable/disable write operations

---

## 📚 Technology Stack

### Frontend

- **Framework**: Next.js 14
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **UI**: React 18

### Backend

- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Language**: JavaScript (Node.js)

---

## 🎯 Future Improvements

### Potential Enhancements:

1. **Testing** - Jest + React Testing Library
2. **Authentication** - JWT-based auth
3. **TypeScript** - Type safety
4. **API Validation** - Zod/Yup schemas
5. **Logging** - Winston/Pino
6. **Caching** - Redis for API responses
7. **File Upload** - Document attachments
8. **Email Notifications** - Case updates
9. **Export** - PDF generation
10. **Search** - Elasticsearch for advanced search

---

## 📖 Documentation

- **README.md** - Project overview & setup
- **QUICK_START.md** - 5-minute setup guide
- **MIGRATION_GUIDE.md** - Vite to Next.js migration
- **IMPROVEMENTS_SUMMARY.md** - UI/UX improvements
- **PROJECT_STRUCTURE.md** - This file

---

## 🤝 Contributing Guidelines

### Code Style

1. Use Prettier for formatting
2. Follow ESLint rules
3. Use meaningful variable names
4. Add comments for complex logic
5. Keep functions small and focused

### Component Guidelines

1. One component per file
2. Props validation (propTypes or JSDoc)
3. Consistent file structure
4. Separate concerns (logic vs presentation)

### Commit Messages

```
feat: Add new feature
fix: Bug fix
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance tasks
```

---

## 📞 Support

For questions or issues:

1. Check existing documentation
2. Review code comments
3. Consult Next.js/React documentation

---

**Last Updated**: October 2025  
**Maintained By**: Development Team  
**Status**: ✅ Production Ready

