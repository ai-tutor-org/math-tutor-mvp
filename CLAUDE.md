# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a React-based educational application for teaching basic math concepts, built with Vite. The app uses a lesson-based architecture with interactive components and TTS (Text-to-Speech) functionality.

### Key Architecture Patterns

- **Modular Content Management**: All lesson content is organized in `src/content/` with separate files for lessons and presentation groups, imported through `src/content/index.js`
- **Component-based Interactions**: Interactive elements are implemented as reusable components in `src/components/` that can be dynamically rendered based on content data
- **State-driven Progression**: The lesson flow is controlled by state indices (`currentPresIndex`, `currentInteractionIndex`) that track progress through structured content
- **Individual CSS files for each component** with matching naming conventions
- **Custom Hook Pattern**: Business logic is extracted into reusable hooks in `src/hooks/`

### Core Data Structure

The content system has three levels:
1. **Lessons**: Top-level containers with sequences of presentations (`lessons` object)
2. **Presentations**: Groups of related interactions (`presentations` object)
3. **Interactions**: Individual learning activities with tutor dialogue and optional interactive components

### Navigation Flow

The app follows this user journey:
1. Home (`/`) → Lesson selection
2. InteractiveLesson (`/lesson/:lessonId`) → Main learning experience

### Key Technologies

- **React 18** with hooks and functional components
- **React Router DOM** for navigation
- **Material-UI (MUI)** for UI components and styling
- **Framer Motion** for animations and transitions
- **Emotion** for CSS-in-JS styling
- **Eleven Labs API** for text-to-speech functionality

### Component Architecture

- **TutorAvatar**: Animated tutor character with speaking/waving states
- **TTSManager**: Handles text-to-speech with callbacks for speech lifecycle
- **Interactive Components**: Specialized components like `RoomIllustration`, `RulerMeasurement`, `ShapeMeasurement` that handle specific learning activities
- **Common Components**: Reusable UI elements in `src/components/common/`
- **Layout Components**: App structure components in `src/components/layout/`
- **Developer Tools**: Dev-mode components in `src/components/dev/`

### State Management

The app uses React's built-in state management with:
- Lesson progression state (`currentPresIndex`, `currentInteractionIndex`)
- UI state (`isSpeaking`, `showNextButton`, `isWaving`, `animationTrigger`)
- Dynamic content state (`dynamicTutorText` for answer feedback)
- Audio state (`isTTSEnabled`, `isAudioLoading`)

## Development Guidelines

### Adding New Content
If you want to add new presentations or interactions, follow best practices from @adding-new-presentations-process.md.

### Important Rules:
- **TTS Content**: All TTS content must be in `src/content/` files for pre-generation by `generate_audio.py`
- **Unique IDs**: IDs must be unique across all presentations
- **Component Imports**: ContentComponents need to be imported at the top of presentation files in `src/content/presentations/`
- **Component Mapping**: Update `componentMap` in `InteractiveLesson.jsx` when adding new interaction types
- **Interaction Flow**: After creating all interactions in a presentation, connect them with proper navigation
- **TTS Rule**: Never call `triggerTTS()` manually - TTSManager automatically triggers TTS when `dynamicTutorText` changes, so only use `setDynamicTutorText()`
- **Custom Logic**: When changing interactions, check for custom code in `InteractiveLesson.jsx`

### Code Style:
- Each component has a matching CSS file with the same name
- Use Material-UI components consistently throughout the app
- Follow React hooks patterns for state management
- Custom hooks should be placed in `src/hooks/` directory
- Use Emotion for CSS-in-JS when needed alongside MUI

## Project Structure

```
src/
├── components/
│   ├── common/                  // Reusable UI components (buttons, inputs, cards)
│   ├── dev/                     // Developer tools and menus
│   ├── layout/                  // App structure components (TTSManager, TutorAvatar)
│   └── presentations/           // Lesson-specific interactive components
│       ├── 01-introduction/     // Room illustrations, rulers, measurements
│       ├── 02-measurement/      // Shape measurement activities
│       ├── 03-shape-sorting/    // Shape sorting game components
│       ├── 04-farmer-missions/  // Farm-themed perimeter activities
│       └── 05-shape-designer/   // Shape design challenges
├── content/
│   ├── index.js                 // Main export point
│   ├── lessons.js               // Lesson structure definitions
│   └── presentations/           // Content data files
│       ├── 01-introduction.js   // Standard units intro
│       ├── 02-measurement.js    // Measurement practice
│       ├── 03-shape-sorting.js  // Shape sorting game
│       ├── 04-farmer-missions.js // All farmer missions
│       ├── 05-shape-designer.js // Shape designer challenges
│       └── 06-summary.js        // Lesson summary
├── data/
│   └── shapeDefinitions.js      // Shape configuration data
├── hooks/                       // Custom React hooks
│   ├── useClickSound.js         // Audio feedback for interactions
│   ├── useMeasurementInput.js   // Measurement input validation
│   ├── useMobileDetection.js    // Mobile device detection
│   ├── usePerimeterInput.js     // Perimeter calculation logic
│   ├── useShapeAnimations.js    // Shape animation utilities
│   └── useShapeDesignInput.js   // Shape design input handling
├── pages/                       // Route components
│   ├── Home.jsx                 // Landing page
│   ├── InteractiveLesson.jsx    // Main lesson experience
│   ├── Lesson.jsx               // Individual lesson wrapper
│   └── LessonStart.jsx          // Pre-lesson introduction
└── utils/
    └── devMode.js               // Developer mode utilities
```

## Content Structure & Guidelines

**Content Guidelines:**
- Keep most text content on left side (tutor speech) with CTAs and input boxes
- Right side is for games and complex interactions
- Use consistent interaction IDs across presentations
- Always provide both `tutorText` and `audioFile` for TTS content

**Component Mapping:**
Interactive components are mapped in `InteractiveLesson.jsx:59-78` via `componentMap` object.

### Audio System:
- Audio files are pre-generated and stored in `public/audio/`
- Audio mapping is maintained in `public/audio/audio_mapping.json`
- TTS generation script: `generate_audio.py`
- Click sounds and haptic feedback via `useClickSound` hook

### Development Tools:
- Developer mode accessible via `?dev=true` URL parameter
- Interactive lesson navigation and debugging tools
- Mobile restriction overlay for desktop-only features

### Testing & Linting:
- Run `npm run lint` for ESLint validation
- Run `npm run dev` for development server
- Run `npm run build` for production build
