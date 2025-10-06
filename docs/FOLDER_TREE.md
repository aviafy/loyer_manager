# 🌳 Complete Folder Tree

## Clean & Modern Structure

```
anri/                                    # Root directory
│
├── 📁 client/                          # Frontend Application (Next.js 14)
│   │
│   ├── 📁 src/                         # Source code
│   │   │
│   │   ├── 📁 app/                     # Next.js App Router (Pages)
│   │   │   ├── 📄 layout.js           # Root layout with Header
│   │   │   ├── 📄 page.js             # Home page - Cases list
│   │   │   ├── 📄 page.module.css     # Home page styles
│   │   │   ├── 📄 globals.css         # Global styles & CSS variables
│   │   │   │
│   │   │   └── 📁 cases/
│   │   │       └── 📁 [id]/           # Dynamic route for case details
│   │   │           ├── 📄 page.js     # Case details page
│   │   │           └── 📄 page.module.css
│   │   │
│   │   ├── 📁 components/              # React Components
│   │   │   │
│   │   │   ├── 📁 cases/              # Case-specific components
│   │   │   │   ├── 📄 CaseCard.js     # Mobile card view
│   │   │   │   ├── 📄 CaseCard.module.css
│   │   │   │   ├── 📄 CaseForm.js     # Add/Edit form
│   │   │   │   ├── 📄 CaseForm.module.css
│   │   │   │   ├── 📄 CasesTable.js   # Desktop table view
│   │   │   │   ├── 📄 CasesTable.module.css
│   │   │   │   ├── 📄 SearchBar.js    # Search & filter
│   │   │   │   └── 📄 SearchBar.module.css
│   │   │   │
│   │   │   ├── 📁 layout/             # Layout components
│   │   │   │   ├── 📄 Header.js       # Top navigation
│   │   │   │   └── 📄 Header.module.css
│   │   │   │
│   │   │   └── 📁 ui/                 # Reusable UI components
│   │   │       ├── 📄 Modal.js        # Modal dialog
│   │   │       └── 📄 Modal.module.css
│   │   │
│   │   ├── 📁 hooks/                   # Custom React Hooks
│   │   │   ├── 📄 useDebounce.js      # Debounced values
│   │   │   └── 📄 useResponsive.js    # Responsive breakpoints
│   │   │
│   │   └── 📁 lib/                     # Utilities & Configuration
│   │       ├── 📄 http.js             # Axios instance (API client)
│   │       └── 📄 utils.js            # Helper functions
│   │
│   ├── 📁 public/                      # Static assets
│   │   └── (empty - ready for images, fonts, etc.)
│   │
│   ├── 📄 .eslintrc.json              # ESLint configuration
│   ├── 📄 .gitignore                  # Git ignore rules
│   ├── 📄 jsconfig.json               # JavaScript config & path aliases
│   ├── 📄 next.config.js              # Next.js configuration
│   ├── 📄 package.json                # Dependencies & scripts
│   ├── 📄 package-lock.json           # Dependency lock file
│   │
│   ├── 📄 README.md                   # Client documentation
│   ├── 📄 QUICK_START.md              # Quick setup guide
│   ├── 📄 MIGRATION_GUIDE.md          # Vite → Next.js migration
│   └── 📄 IMPROVEMENTS_SUMMARY.md     # UI/UX improvements
│
├── 📁 server/                          # Backend Application (Express + MongoDB)
│   │
│   ├── 📁 src/                         # Source code
│   │   │
│   │   ├── 📁 db/                     # Database
│   │   │   └── 📄 mongoose.js         # MongoDB connection
│   │   │
│   │   ├── 📁 models/                 # Data Models
│   │   │   └── 📄 Case.js             # Case schema (Mongoose)
│   │   │
│   │   ├── 📁 routes/                 # API Routes
│   │   │   └── 📄 cases.js            # Case endpoints
│   │   │
│   │   └── 📄 index.js                # Express app entry point
│   │
│   ├── 📄 package.json                # Dependencies & scripts
│   └── 📄 package-lock.json           # Dependency lock file
│
├── 📄 .gitignore                       # Root git ignore
├── 📄 README.md                        # Main project README
├── 📄 PROJECT_STRUCTURE.md             # Architecture documentation
├── 📄 CLEANUP_SUMMARY.md               # What was cleaned up
└── 📄 FOLDER_TREE.md                   # This file

```

---

## 📊 Structure Statistics

### Client (`client/src/`)

| Folder        | Files        | Purpose                  |
| ------------- | ------------ | ------------------------ |
| `app/`        | 5            | Pages & routing          |
| `components/` | 14           | React components (+ CSS) |
| `hooks/`      | 2            | Custom hooks             |
| `lib/`        | 2            | Utilities                |
| **Total**     | **23 files** | Clean & organized        |

### Server (`server/src/`)

| Folder    | Files       | Purpose             |
| --------- | ----------- | ------------------- |
| `db/`     | 1           | Database connection |
| `models/` | 1           | Mongoose schemas    |
| `routes/` | 1           | API endpoints       |
| **Total** | **4 files** | Simple & effective  |

---

## 🎯 Design Principles

### ✅ Flat Structure

- Maximum 3 levels deep
- No unnecessary nesting
- Easy to navigate

### ✅ Feature-Based Organization

```
components/
├── cases/      ← All case-related components
├── layout/     ← Layout/navigation
└── ui/         ← Reusable primitives
```

### ✅ Co-location

- Components next to their styles
- Related files grouped together
- Easy to find and modify

### ✅ Separation of Concerns

```
app/         ← Pages (routing)
components/  ← UI (presentation)
hooks/       ← Logic (reusable)
lib/         ← Utilities (helpers)
```

---

## 📝 Naming Conventions

### Folders

- `lowercase` for special folders (`app/`, `lib/`)
- `lowercase` for feature folders (`cases/`, `layout/`)

### Files

- **Pages**: `page.js` (Next.js convention)
- **Components**: `PascalCase.js` (e.g., `CaseCard.js`)
- **Styles**: `ComponentName.module.css`
- **Hooks**: `useHookName.js`
- **Utils**: `camelCase.js` (e.g., `http.js`, `utils.js`)

### Code

- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS Modules**: `.camelCase`

---

## 🔍 File Purpose Guide

### Frontend Key Files

#### Pages (`app/`)

```
layout.js              → Root layout, includes Header
page.js                → Home page with cases list
cases/[id]/page.js     → Dynamic case details page
globals.css            → Global styles & CSS variables
```

#### Components

```
cases/CaseCard.js      → Mobile card view for cases
cases/CaseForm.js      → Add/edit form with validation
cases/CasesTable.js    → Desktop table view
cases/SearchBar.js     → Search & filter controls
layout/Header.js       → Top navigation bar
ui/Modal.js            → Reusable modal dialog
```

#### Hooks

```
useDebounce.js         → Debounce values (search optimization)
useResponsive.js       → Detect mobile/desktop breakpoints
```

#### Utilities

```
http.js                → Axios instance with base URL
utils.js               → Helper functions (parseAmount, parseDate)
```

### Backend Key Files

```
index.js               → Express app setup & routes
db/mongoose.js         → MongoDB connection
models/Case.js         → Case schema definition
routes/cases.js        → CRUD endpoints for cases
```

---

## 🚀 Adding New Features

### New Page

```
1. Create: src/app/[page-name]/page.js
2. Add styles: page.module.css (optional)
3. Route: Automatic!
```

### New Component

```
1. Choose folder: cases/, layout/, or ui/
2. Create: ComponentName.js
3. Add styles: ComponentName.module.css
4. Import & use
```

### New Hook

```
1. Create: src/hooks/useHookName.js
2. Export: export default function useHookName() { ... }
3. Import & use
```

### New Utility

```
1. Add to: src/lib/utils.js
2. Or create: src/lib/newUtil.js
3. Export & import
```

---

## 🎨 Import Patterns

### With Path Aliases (`@/`)

```javascript
// Pages & Components
import Header from "@/components/layout/Header";
import CaseCard from "@/components/cases/CaseCard";
import Modal from "@/components/ui/Modal";

// Hooks
import useDebounce from "@/hooks/useDebounce";
import useResponsive from "@/hooks/useResponsive";

// Utilities
import http from "@/lib/http";
import { parseAmount, parseDate } from "@/lib/utils";

// Styles
import styles from "./ComponentName.module.css";
```

---

## 📦 Dependencies Overview

### Client Dependencies

```json
{
  "next": "^14.2.0", // React framework
  "react": "^18.3.0", // UI library
  "react-dom": "^18.3.0", // React DOM
  "axios": "^1.12.2" // HTTP client
}
```

### Server Dependencies

```json
{
  "express": "^4.x", // Web framework
  "mongoose": "^8.x", // MongoDB ODM
  "cors": "^2.x", // CORS support
  "dotenv": "^16.x" // Environment variables
}
```

---

## 🔄 Data Flow

```
User Interaction
    ↓
Component (app/ or components/)
    ↓
Hook (optional - hooks/)
    ↓
API Call (lib/http.js)
    ↓
Backend (server/routes/)
    ↓
Database (server/models/)
    ↓
Response
    ↓
State Update
    ↓
UI Re-render
```

---

## ✨ Why This Structure?

### 1. **Simple**

- Only essential folders
- No confusion about where files go
- Easy to learn

### 2. **Scalable**

- Clear places for new features
- Grows naturally
- No restructuring needed

### 3. **Maintainable**

- Easy to find files
- Related code together
- Clear dependencies

### 4. **Modern**

- Next.js 14 conventions
- Industry best practices
- Future-proof

### 5. **Fast**

- Optimized for performance
- Minimal overhead
- Quick builds

---

## 🎯 Comparison

### Before Cleanup

```
❌ 10+ folders in src/
❌ Empty directories
❌ Mixed patterns
❌ Hard to navigate
❌ Legacy code
```

### After Cleanup

```
✅ 4 folders in src/
✅ All used
✅ Consistent
✅ Easy navigation
✅ Modern code
```

---

**Clean structure = Happy developers = Better product!** 🎉

