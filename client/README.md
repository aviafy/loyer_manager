# საქმის მენეჯერი - Case Manager

Modern case management system built with Next.js and React.

## 🚀 Features

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Mobile-First Design**: Fully responsive across all devices
- **Fast Performance**: Built with Next.js for optimal speed
- **Georgian Language Support**: Complete Georgian localization
- **Advanced Search**: Real-time search with debouncing
- **Data Export**: Excel export functionality
- **Sortable Tables**: Click column headers to sort data
- **Modal Forms**: Elegant modal dialogs for creating/editing cases

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules
- **HTTP Client**: Axios
- **Font**: Noto Sans Georgian

## 🛠️ Installation

1. Install dependencies:

```bash
npm install
```

2. Make sure the backend server is running on `http://localhost:4000`

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── cases/[id]/        # Case details page
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Home page (cases list)
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── cases/             # Case-related components
│   │   │   ├── CaseCard.js
│   │   │   ├── CaseForm.js
│   │   │   ├── CasesTable.js
│   │   │   └── SearchBar.js
│   │   ├── layout/            # Layout components
│   │   │   └── Header.js
│   │   └── ui/                # Reusable UI components
│   │       └── Modal.js
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDebounce.js
│   │   └── useResponsive.js
│   └── lib/                   # Utilities
│       ├── http.js            # Axios configuration
│       └── utils.js           # Helper functions
├── public/                    # Static assets
├── next.config.js             # Next.js configuration
├── jsconfig.json              # JavaScript configuration
└── package.json               # Dependencies

```

## 🎨 Design System

### Color Palette

- **Primary Green**: #4caf50
- **Primary Light**: #d9f2d9
- **Primary Border**: #bfe5bf
- **Accent Blue**: #1a73e8
- **Error Red**: #d32f2f

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: > 1024px

## 🔧 Configuration

The API base URL can be modified in `src/lib/http.js`:

```javascript
baseURL: "http://localhost:4000/api";
```

## 📱 Features Overview

### Cases List Page

- Search and filter cases by multiple fields
- Sort by clicking column headers
- Select rows with visual feedback
- Double-click to edit
- Mobile: Card view for better readability
- Desktop: Full table view

### Case Form

- Add new cases
- Edit existing cases
- Form validation
- Auto-save with loading states
- Mobile-optimized layout

### Case Details Page

- View complete case information
- Organized sections for better readability
- Mobile-friendly layout
- Easy navigation back to list

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- The application requires the backend API to be running
- Demo mode disables write operations
- All dates should be in YYYY-MM-DD format
- Excel export uses server-side generation

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the development team.

## 📄 License

Proprietary - All rights reserved
