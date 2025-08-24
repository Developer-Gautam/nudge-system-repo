# Frontend Structure

## Overview
The frontend is now organized into a clean, component-based architecture using vanilla JavaScript with ES6 modules.

## Directory Structure

```
src/
├── main.js                 # Entry point - initializes the app
├── style.css              # Global styles
├── components/            # Reusable UI components
│   └── NudgeModal.js     # Inactivity reminder modal
├── pages/                 # Page-level components
│   ├── AuthPage.js       # Login/Register page
│   └── QuestionnairePage.js # Main questionnaire interface
├── services/              # API and external services
│   └── api.js            # Backend API communication
└── utils/                 # Utility classes and helpers
    ├── appController.js   # Main app state management
    └── activityTracker.js # Inactivity detection and tracking
```

## Components

### Pages
- **AuthPage**: Handles user authentication (login/register)
- **QuestionnairePage**: Main questionnaire interface with progress tracking

### Components
- **NudgeModal**: Reusable modal for inactivity reminders

### Services
- **ApiService**: Centralized API communication with error handling

### Utils
- **AppController**: Manages application state and page transitions
- **ActivityTracker**: Handles inactivity detection and nudge timing

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Components can be easily reused
3. **Maintainability**: Easy to find and modify specific functionality
4. **Testability**: Each component can be tested independently
5. **Scalability**: Easy to add new features and components
