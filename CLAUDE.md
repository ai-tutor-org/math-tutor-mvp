# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint`
- **Deploy to GitHub Pages**: `npm run deploy`

## Architecture Overview

This is a React-based educational application for teaching perimeter concepts, built with Vite. The app uses a lesson-based architecture with interactive components and TTS (Text-to-Speech) functionality.

### Key Architecture Patterns

- **Centralized Content Management**: All lesson content is managed in `src/contentData.js` which defines lesson sequences, presentations, and interactions
- **Component-based Interactions**: Interactive elements are implemented as reusable components in `src/components/` that can be dynamically rendered based on content data
- **State-driven Progression**: The lesson flow is controlled by state indices (`currentPresIndex`, `currentInteractionIndex`) that track progress through structured content
- **Dynamic Layout System**: The UI can switch between `full-screen` and `dual-panel` layouts depending on the interaction type

### Core Data Structure

The content system has three levels:
1. **Lessons**: Top-level containers with sequences of presentations (`lessons` object)
2. **Presentations**: Groups of related interactions (`presentations` object)
3. **Interactions**: Individual learning activities with tutor dialogue and optional interactive components

### Navigation Flow

The app follows this user journey:
1. Home (`/`) → Chapter selection
2. InteractiveLesson (`/lesson/:lessonId`) → Main learning experience

### Key Technologies

- **React 18** with hooks and functional components
- **React Router DOM** for navigation
- **Framer Motion** for animations and transitions
- **Matter.js** for physics simulations
- **PIXI.js** for advanced graphics rendering
- **Web Speech API** for text-to-speech functionality

### Component Architecture

- **TutorAvatar**: Animated tutor character with speaking/waving states
- **TTSManager**: Handles text-to-speech with callbacks for speech lifecycle
- **Interactive Components**: Specialized components like `RoomIllustration`, `RulerMeasurement`, `ShapeMeasurement` that handle specific learning activities
- **Layout System**: Components can request layout changes (e.g., switch to dual-panel view)

### State Management

The app uses React's built-in state management with:
- Lesson progression state (`currentPresIndex`, `currentInteractionIndex`)
- UI state (`layout`, `isSpeaking`, `showNextButton`)
- Dynamic content state (`dynamicTutorText` for answer feedback)

If you want to add new presentations or interactions, follow best practices from @adding-new-presentations.md.

**Important Notes:**
- All TTS content must be in `contentData.js` for pre-generation
- IDs must be unique across all presentations
- ContentComponents need to be imported at the top of the file
- Update `componentMap` in `InteractiveLesson.jsx` if using new interaction types


### Deployment

The app is configured for GitHub Pages deployment with:
- Base path set to `/math-tutor-mvp/` in `vite.config.js`
- Router basename configured in `App.jsx`
- Deployment script in `package.json`