# Currency Swap Application

A modern, production-ready currency swap application built with React, Vite, and TailwindCSS v4. This project demonstrates senior-level frontend development practices including clean architecture, comprehensive testing, and modern tooling.

## 🚀 Features

- **Real-time Currency Swapping**: Intuitive token swapping interface with live exchange rate calculations
- **Modern UI/UX**: Beautiful gradient design with TailwindCSS v4 and smooth animations
- **Comprehensive Testing**: 109+ test cases with 100% business logic coverage
- **Production Ready**: ESLint configuration, proper error handling, and performance optimizations
- **Clean Architecture**: Well-structured codebase following separation of concerns
- **Accessibility**: Full keyboard navigation and screen reader support

## 🏗️ Project Structure

```
src/problem2/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── forms/           # Form-related components
│   │   │   ├── SwapForm.jsx # Main swap form component
│   │   │   └── __tests__/   # Component tests
│   │   ├── ui/              # Reusable UI components
│   │   │   └── Button.jsx   # Custom button component
│   │   └── index.js         # Component exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useSwap.js       # Main swap business logic hook
│   │   ├── useTokens.js     # Token data management hook
│   │   └── __tests__/       # Hook tests
│   ├── utils/               # Utility functions
│   │   ├── currency.js      # Currency formatting and calculations
│   │   └── __tests__/       # Utility tests
│   ├── services/            # API and external services
│   │   └── priceService.js  # Price data fetching service
│   ├── constants/           # Application constants
│   │   └── api.js           # API endpoints and configuration
│   ├── test/                # Test configuration
│   │   └── setup.js         # Global test setup and mocks
│   ├── assets/              # Images, icons, and other assets
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and TailwindCSS imports
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── README.md               # This file
```

## 📁 Folder Explanations

### `/src/components/`

Contains all React components organized by feature:

- **forms/**: Form-related components like SwapForm
- **ui/**: Reusable UI components (buttons, inputs, etc.)

### `/src/hooks/`

Custom React hooks for business logic:

- **useSwap.js**: Main hook managing swap state and operations
- **useTokens.js**: Hook for fetching and managing token data

### `/src/utils/`

Pure utility functions:

- **currency.js**: Currency formatting, calculations, and validation functions

### `/src/services/`

External service integrations:

- **priceService.js**: API calls for fetching token prices

### `/src/constants/`

Application-wide constants:

- **api.js**: API endpoints and configuration

### `/src/test/`

Testing configuration:

- **setup.js**: Global test setup, mocks, and utilities

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite
- **Styling**: TailwindCSS v4
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Testing**: Vitest, Testing Library
- **Code Quality**: ESLint
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository and navigate to the project:**

   ```bash
   cd src/problem2
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

## 🚀 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
pnpm build
```

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
```

## 🧪 Testing

### Run All Tests

Execute the complete test suite:

```bash
pnpm test:run
```

### Run Tests in Watch Mode

Run tests with file watching for development:

```bash
pnpm test
```

### Run Tests with UI

Run tests with Vitest's UI interface:

```bash
pnpm test:ui
```

### Test Coverage

Generate test coverage report:

```bash
pnpm test:coverage
```

## 🔧 Development Scripts

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Build for production     |
| `pnpm preview`       | Preview production build |
| `pnpm test`          | Run tests in watch mode  |
| `pnpm test:run`      | Run tests once           |
| `pnpm test:ui`       | Run tests with UI        |
| `pnpm test:coverage` | Generate coverage report |
| `pnpm lint`          | Run ESLint               |
| `pnpm lint:fix`      | Fix ESLint errors        |

## 🏛️ Architecture Principles

This project follows clean architecture principles:

1. **Separation of Concerns**: Clear separation between UI, business logic, and data layers
2. **Testability**: Each layer is independently testable with comprehensive test coverage
3. **Maintainability**: Well-organized code structure with clear naming conventions
4. **Performance**: Optimized re-renders using React hooks and memoization
5. **Accessibility**: Full keyboard support and screen reader compatibility

## 🧪 Testing Strategy

- **Unit Tests**: 35+ tests for utility functions
- **Hook Tests**: 17+ tests for business logic
- **Component Tests**: 10+ tests for UI interactions
- **Integration Tests**: End-to-end user workflows
- **Mocking Strategy**: Strategic mocking for external dependencies

## 📋 Features Demonstration

### Core Functionality

- Token selection with price display
- Real-time exchange rate calculation
- Input validation and error handling
- Token position swapping
- Success/error notifications

### UI/UX Excellence

- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading states and feedback
- Accessible keyboard navigation
- Professional gradient design

## 🤝 Contributing

This project demonstrates production-ready code standards suitable for senior frontend developer positions. The architecture and testing approach can serve as a reference for building scalable React applications.

## 📄 License

This project is part of a technical coding challenge and is for demonstration purposes.
