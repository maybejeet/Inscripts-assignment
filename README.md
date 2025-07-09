# Inscripts Internship Assignment - Job Request Spreadsheet

A modern, interactive spreadsheet application for managing job requests built with React, TypeScript, and Vite. This application provides a professional interface for tracking job submissions, status updates, and team assignments.

## Features

- 📊 **Interactive Spreadsheet**: View and manage job requests in a clean, table-based interface
- 🔍 **Advanced Filtering**: Filter data by status, priority, and submitter
- 📈 **Sorting Capabilities**: Sort data by any column (title, date, status, priority, etc.)
- 👁️ **Field Visibility**: Hide/show columns dynamically
- 📤 **Export Functionality**: Export data to CSV or JSON formats
- 📥 **Import Support**: Import data from CSV/JSON files
- 🔗 **Share Feature**: Share spreadsheet with team members
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 📱 **Mobile Responsive**: Works on all device sizes

## Tech Stack

- **Frontend**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Table Library**: TanStack Table (React Table v8)
- **Spreadsheet Engine**: Handsontable (for advanced features)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maybejeet/Inscripts-assignment
   cd Inscripts-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Row/             # Toolbar and action components
│   ├── Spreadsheet/     # Main spreadsheet component
│   ├── Title Row/       # Title/header components
│   ├── Topbar/          # Top navigation bar
│   └── ui/              # Base UI components (buttons, dialogs, etc.)
├── hooks/               # Custom React hooks
│   └── useData.ts       # Data management hook
├── lib/                 # Utility functions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Key Components

### Data Management (`useData` hook)
- Centralized state management for job requests
- Sorting, filtering, and field visibility logic
- Export/import functionality
- Type-safe data operations

### Spreadsheet Component
- Main table interface
- Row selection and highlighting
- Responsive design
- Status and priority color coding

### Toolbar (Row Component)
- Dynamic toolbar with toggle functionality
- Sort, filter, and field visibility controls
- Export options (CSV/JSON)
- Import functionality
- Share capabilities

## Data Structure

Each job request contains:
- **ID**: Unique identifier
- **Title**: Job request description
- **Submitted Date**: When the request was submitted
- **Status**: Current status (In-process, Need to start, Complete, Blocked)
- **Submitter**: Person who submitted the request
- **URL**: Related website/resource
- **Assigned**: Person assigned to the task
- **Priority**: Task priority (High, Medium, Low)
- **Due Date**: When the task should be completed
- **Estimated Value**: Estimated monetary value

## Trade-offs & Design Decisions

### 1. **Component Architecture**
- **Choice**: Modular component structure with separate concerns
- **Trade-off**: More files to maintain vs. better organization and reusability
- **Reason**: Easier maintenance, testing, and future feature additions

### 2. **State Management**
- **Choice**: Custom hook (`useData`) instead of Redux/Zustand
- **Trade-off**: Less powerful global state vs. simpler implementation
- **Reason**: Application complexity doesn't justify heavy state management libraries

### 3. **UI Library Selection**
- **Choice**: Radix UI primitives + custom components
- **Trade-off**: More setup work vs. full control over styling
- **Reason**: Better accessibility, customization, and smaller bundle size than full UI frameworks

### 4. **Data Persistence**
- **Choice**: In-memory storage with local file export/import
- **Trade-off**: No automatic persistence vs. simpler implementation
- **Reason**: Internship assignment scope; real app would need backend integration

### 5. **TypeScript Configuration**
- **Choice**: Strict TypeScript with `verbatimModuleSyntax`
- **Trade-off**: More verbose imports vs. better type safety
- **Reason**: Prevents runtime errors and improves developer experience

### 6. **Build Tool**
- **Choice**: Vite over Create React App
- **Trade-off**: Newer ecosystem vs. faster builds and better DX
- **Reason**: Significantly faster development server and build times

### 7. **Table Implementation**
- **Choice**: Custom table with TanStack Table + Handsontable integration
- **Trade-off**: More complex setup vs. powerful features
- **Reason**: Professional spreadsheet experience while maintaining React paradigms

### 8. **Responsive Design**
- **Choice**: Mobile-first responsive design
- **Trade-off**: More CSS complexity vs. better user experience
- **Reason**: Modern applications must work on all devices

## Known Limitations

1. **No Backend Integration**: Data is stored in memory only
2. **Limited Import Validation**: Basic file type checking only
3. **No Real-time Collaboration**: Single-user application
4. **No Undo/Redo**: Actions are immediately applied
5. **No Data Validation**: Minimal input validation on data entry


## License

This project is part of an internship assignment and is for educational purposes.

## Support

For questions or issues, please contact the development team or create an issue in the repository.
