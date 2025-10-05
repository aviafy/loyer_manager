# 🚀 Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:4000`

## Installation & Running

### 1. First Time Setup

```bash
cd client
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 🎯 What's New?

### Vite → Next.js Migration Complete! ✅

**Old Commands** (Don't use anymore):

```bash
npm run dev    # Used to run Vite
npm run build  # Used to build with Vite
```

**New Commands** (Use these now):

```bash
npm run dev    # Runs Next.js dev server (port 3000)
npm run build  # Creates production build
npm start      # Runs production server
npm run lint   # Runs ESLint
```

---

## 📱 Key Features

### Desktop View (> 1024px)

- Full table layout
- All columns visible
- Sortable columns
- Row selection
- Double-click to edit

### Mobile View (< 768px)

- Card-based layout
- Touch-friendly
- Full-screen modals
- Optimized forms

### Both Views

- Real-time search with debouncing
- Add/Edit/Delete cases
- Excel export
- Demo mode support
- Georgian language

---

## 🎨 UI/UX Improvements

✅ Modern, clean design
✅ Smooth animations
✅ Better mobile experience
✅ Professional color scheme
✅ Improved forms with validation
✅ Loading and empty states
✅ Modal dialogs with animations
✅ Responsive on all devices

---

## 📂 Project Structure

```
client/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   │   ├── page.js            # Cases List (Home)
│   │   ├── cases/[id]/        # Case Details
│   │   ├── layout.js          # Root Layout with Header
│   │   └── globals.css        # Global Styles
│   │
│   ├── components/
│   │   ├── cases/             # Case Components
│   │   │   ├── CaseCard.js           (Mobile view)
│   │   │   ├── CaseForm.js           (Add/Edit form)
│   │   │   ├── CasesTable.js         (Desktop view)
│   │   │   └── SearchBar.js          (Search & filter)
│   │   ├── layout/            # Layout Components
│   │   │   └── Header.js             (Top navigation)
│   │   └── ui/                # Reusable UI
│   │       └── Modal.js              (Modal dialog)
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   ├── useDebounce.js            (Search debouncing)
│   │   └── useResponsive.js          (Responsive detection)
│   │
│   └── lib/                   # Utilities
│       ├── http.js                   (Axios config)
│       └── utils.js                  (Helper functions)
│
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
├── jsconfig.json             # JavaScript config (path aliases)
├── package.json              # Dependencies
└── README.md                 # Full documentation
```

---

## 🔧 Configuration

### API Endpoint

Edit `src/lib/http.js` if your backend URL is different:

```javascript
baseURL: "http://localhost:4000/api";
```

### Path Aliases

Use `@/` to import from `src/`:

```javascript
import Header from "@/components/layout/Header";
import http from "@/lib/http";
```

---

## 🌐 Browser Requirements

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

All modern browsers supported. IE11 not supported.

---

## 📝 Common Tasks

### Add a New Component

1. Create in appropriate folder (`components/cases/`, `components/ui/`, etc.)
2. Create matching `.module.css` file
3. Import and use

### Add a New Page

1. Create folder in `src/app/`
2. Add `page.js` file
3. Add optional `page.module.css`
4. Route is automatic! (file-based routing)

### Modify Styles

- **Global styles**: Edit `src/app/globals.css`
- **Component styles**: Edit corresponding `.module.css`
- **Colors/Variables**: Modify CSS variables in `globals.css`

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill the process using port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or use a different port:
npm run dev -- -p 3001
```

### Backend not responding

- Make sure server is running on port 4000
- Check `http://localhost:4000/api/health`
- Verify CORS is enabled on backend

### Module not found errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles not updating

- Hard refresh browser (Ctrl+Shift+R)
- Clear Next.js cache: Delete `.next` folder
- Restart dev server

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

## ✅ Checklist

Before you start:

- [ ] Node.js 18+ installed
- [ ] Backend server running
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Browser open to `http://localhost:3000`

---

## 🎉 You're All Set!

The application is now:

- ✨ Modern and beautiful
- 📱 Mobile-friendly
- ⚡ Fast and optimized
- 🎨 Easy to customize
- 📦 Ready for production

Happy coding! 🚀
