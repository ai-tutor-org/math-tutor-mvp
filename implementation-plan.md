<!-- This file contains the detailed specification for a presentation including all interactions, content, and expected behaviors. It serves as the single source of truth for what needs to be implemented. This is a game which has various interactions to teach shape sorting through a guided learning experience. -->

# Shape Sorting Game Implementation Plan

## Technical Overview

### Architecture Strategy

The Shape Sorting Game will be implemented as a single, complex React component (`ShapeSorterGame`) that manages multiple interaction states within one presentation. Unlike our previous approach of separate interactions, this game requires a state machine pattern to handle the 13 different interaction phases seamlessly.

**Core Architecture Decisions:**

-   **Single Component Approach**: One `ShapeSorterGame` component manages all 13 interactions
-   **State Machine Pattern**: Use `useReducer` for complex state transitions between interaction phases
-   **Conditional Rendering**: Different UI elements appear/disappear based on current interaction state
-   **Audio Integration**: Full TTS integration with dynamic speech and Web Audio API for game sounds
-   **Animation System**: Framer Motion for shape movements, container animations, and celebratory effects (3s duration)
-   **Global Notification Infrastructure**: Independent ToastProvider system implemented first at App.jsx level

### Component Hierarchy

```
ShapeSorterGame (Main Component)
├── GameContainer (Overall layout with clean dark theme)
├── ShapesPile (Top area with randomly positioned shapes)
├── SortingBins (Four container PNGs with counters, 1.1x hover scaling, aspect-ratio maintained)
├── InterventionOverlay (For targeted help)
├── ProgressIndicator (Help stars counter - final challenge only)
├── CelebrationEffect (Completion animations - 3 second duration)
└── ShapeSummary (Final recap view)

# Independent Global Infrastructure (implemented first)
App.jsx
└── ToastProvider (Platform-wide notification wrapper - wraps entire application)
    └── ... existing app structure
```

### Implementation Scope and Sequence

#### Phase A: Global Toast Infrastructure (Implemented First)

-   **Purpose**: Platform-wide notification system (completely independent)
-   **Implementation Level**: App.jsx wrapper for entire application
-   **Scope**: Global ToastProvider, useToast hook, NotificationService
-   **Configuration**: Messages and toast types via props/context, obvious defaults in component
-   **Independence**: Separate from error boundaries and game logic

#### Phase B: Shape Sorting Game (Implemented Second)

-   **Focus**: Complete implementation of 13-interaction shape sorting game
-   **Components**: All game-specific components (ShapeSorterGame, GameShape, SortingBin, etc.)
-   **Integration**: Uses global toast system implemented in Phase A
-   **Dependencies**: Leverages completed global toast infrastructure

## Component Analysis

### Phase A: Global Infrastructure (Implemented First)

-   **ToastProvider.jsx** - Global notification context wrapper (App.jsx level)
-   **NotificationService.js** - Service layer for managing notifications
-   **useToast.js** - Custom hook for consistent toast usage
-   **Toast styling configuration** - Dark theme integration with configurable messages

### Phase B: Shape Sorting Game (Implemented Second)

1. **ShapeSorterGame.jsx** - Main game component with state machine
2. **GameShape.jsx** - Individual draggable shape component with subtle size variations and simple shadows
3. **SortingBin.jsx** - Drop zone container component with counter display, 1.1x hover scaling, and aspect-ratio preservation
4. **InterventionOverlay.jsx** - Modal-like overlay for targeted help
5. **CelebrationEffect.jsx** - Confetti and star animations (3 second duration)
6. **ShapeSummary.jsx** - Final recap with shape properties

### External Libraries to Add

-   **react-hot-toast** - Toast notification library (for global infrastructure - Phase A)

### Existing Components to Leverage

-   **TTSManager** - For all speech synthesis (higher volume than game sounds)
-   **InteractiveLesson** - Main lesson container (no changes needed)
-   **Material-UI components** - Buttons, animations
-   **Framer Motion** - For all animations and drag/drop

### Utilities Needed

-   **Shape definitions** - Data structure for triangle variations (broadly different, not educational detail)
-   **Web Audio API manager** - Simple tone generation for success/failure sounds
-   **Performance tracker** - Track attempts per shape type (not individual shapes)

## Data Structure Design

### contentData.js Structure

```javascript
'shape-sorting-game': {
    interactions: [
        {
            id: 'shape-sorting-intro',
            type: 'shape-sorting-game',
            tutorText: "Oh no! Welcome to the Shape Factory...",
            ContentComponent: ShapeSorterGame,
            contentProps: {
                totalShapes: 12, // 3 of each type with variations
                helpLimit: 2,
                shapeVariations: {
                    triangles: ['variant1', 'variant2', 'variant3'], // Broadly different, not educational
                    sizes: [80, 100, 120], // Subtle size variations in %
                    thickness: ['thin', 'normal', 'thick']
                },
                containerImages: {
                    triangles: 'triangles_container.png',
                    circles: 'circles_container.png',
                    squares: 'squares_container.png',
                    rectangles: 'rectangles_container.png'
                }
            },
            transitionType: 'auto' // Game manages its own transitions
        }
    ]
}
```

### Game State Structure

```javascript
{
    currentPhase: 'intro' | 'tools' | 'modeling' | 'guided' | 'practice' | 'challenge' | 'complete' | 'recap',
    shapes: Array<{id, type, variant, size, thickness, position, attempts, isHighlighted, isDisabled}>,
    bins: Array<{type, shapes, count, isGlowing, isHovered}>,
    interventionCount: 0,
    maxInterventions: 2,
    currentShape: null,
    showCelebration: false,
    shapeAttempts: {triangle: 0, circle: 0, rectangle: 0, square: 0}, // Track per shape type
    gameStats: {perfectScore: boolean, totalAttempts: number}
    // Note: notifications handled by global toast system (available by Phase B)
}
```

### Global Toast Infrastructure (Phase A)

```javascript
// ToastProvider context structure (App.jsx level)
{
    showToast: (message, type, options?) => void,
    showSuccess: (message, options?) => void,
    showError: (message, options?) => void,
    showWarning: (message, options?) => void,
    showInfo: (message, options?) => void
}

// Toast configuration (configurable via props/context)
{
    duration: 5000, // Default 5 seconds, configurable
    position: 'top-right', // Default position, configurable
    style: {
        // Dark theme styling to match application, configurable
    },
    // Messages and toast types passed via props/context
    // Obvious defaults handled within component
}

// App.jsx integration
<ToastProvider config={{duration: 5000, position: 'top-right'}}>
    <App /> // existing app structure
</ToastProvider>
```

### Shape Distribution by Phase

-   **Q3 (Modeling)**: 1 square (automated demo)
-   **Q4 (Guided)**: 1 triangle (user interaction, other shapes semi-transparent)
-   **Q6-Q7 (Practice)**: 3 shapes (rectangle, circle, square)
-   **Q10-Q11 (Challenge)**: 8 remaining shapes (2 more of each type)
-   **Total**: 12 shapes (3 triangles: broadly different variants, 3 circles, 3 rectangles, 3 squares)

### Animation Timings

-   **Container slide-in**: 0.8 seconds
-   **Shape return animation**: 0.6 seconds
-   **Celebration duration**: 3 seconds
-   **Simple shadows**: Static CSS shadows (no drag-following complexity)
-   **Container hover scaling**: 1.1x scale with aspect ratio maintained
-   **Toast notifications**: 5 seconds default duration (configurable)

### Container Asset Integration

```javascript
// Container PNG files in /public/images/
const containerAssets = {
	triangles: "/images/triangles_container.png",
	circles: "/images/circles_container.png",
	squares: "/images/squares_container.png",
	rectangles: "/images/rectangles_container.png",
};
```

## Integration Points

### TTS Integration

-   **Dynamic Speech**: Game generates different tutor text based on performance
-   **Context-Aware Feedback**: Shape-specific and attempt-specific responses
-   **Performance-Based Completion**: Different ending speeches based on success rate
-   **Audio Hierarchy**: TTS at normal volume, game sounds at lower volume
-   **Error Handling**: Graceful degradation if TTS fails (visual feedback + toast notifications)

### Global Notification Integration (Available by Phase B)

-   **Completed Infrastructure**: Global toast system implemented in Phase A
-   **Platform-Wide Consistency**: Same notification system across all lessons/chapters/classes
-   **Configurable Messages**: Toast messages and types passed via props/context
-   **Service Layer**: Centralized notification logic for all platform features

### Lesson System Integration

-   **Single Interaction**: Game appears as one interaction in contentData.js
-   **Internal State Management**: Game handles all 13 phases internally
-   **Completion Callback**: Automatically navigates to home page on completion
-   **Progress Tracking**: Integrates with existing lesson progression after "measurement-practice-activities"

### Animation Coordination

-   **No TTS Conflicts**: Game manages its own speech timing
-   **Smooth Transitions**: Between game phases without lesson system intervention
-   **Audio Feedback**: Web Audio API tones independent of TTS
-   **Aspect-Ratio Preservation**: Container scaling (1.1x) maintains proportions

## Development Phases

### Phase A1: Global Toast Infrastructure Implementation (Priority 1)

-   Install and configure react-hot-toast library
-   Create ToastProvider component with configurable props/context for messages and types
-   Implement App.jsx level wrapper for entire application
-   Create useToast hook for consistent notification usage across platform
-   Set up default styling (dark theme) with configuration options
-   Implement NotificationService for centralized notification logic
-   Document usage patterns for platform-wide adoption

### Phase A2: Global Toast Testing and Documentation

-   Test toast notifications with different message types and configurations
-   Verify App.jsx level integration works across all routes
-   Create usage documentation for future lessons/chapters/classes
-   Ensure proper error boundary separation (independent systems)

### Phase B1: Game Foundation Setup

-   Create ShapeSorterGame component with basic state machine
-   Implement shape data structures with triangle variants and size variations
-   Set up basic drag and drop with Framer Motion and simple CSS shadows
-   Create sorting bins using specific container PNGs with CSS scaling and counters
-   Basic state transitions between first 3 interactions
-   Integrate with completed global toast system from Phase A

### Phase B2: Game Logic Implementation (Core Mechanics)

-   Implement attempt tracking per shape type (not individual shapes)
-   Add Web Audio API sound generation (higher pitch pop, lower pitch bloop, quieter than TTS)
-   Create intervention system logic (triggers on 3rd wrong attempt per shape type)
-   Implement help counter and star system (final challenge only)
-   Add shape return-to-pile animations (0.6s) with random positioning
-   Use global toast system for audio/technical failure notifications

### Phase B3: Intervention System (Targeted Help)

-   Create InterventionOverlay component
-   Implement targeted feedback logic
-   Add automated correction system
-   Integrate help limit enforcement (2 max interventions)
-   Create glowing bucket effects and hover states with 1.1x scaling

### Phase B4: Advanced Game Flow (Full Experience)

-   Implement all 13 interaction phases
-   Add celebratory animations and effects (3 second duration)
-   Create performance-based completion messages
-   Implement final recap with shape properties
-   Full TTS integration with dynamic content

### Phase B5: Polish and Final Integration

-   Smooth animations with specified timings (containers 0.8s, returns 0.6s, celebration 3s, hover 1.1x)
-   Audio timing optimization with Web Audio API
-   Semi-transparent disabled shapes during guided phase
-   Error handling and edge cases with global toast notifications
-   Performance optimization and final testing

## Risk Assessment

### High-Risk Areas

1. **Complex State Management**: 13 interactions in one component
    - _Mitigation_: Use useReducer with clear action types
2. **App.jsx Level Integration**: Global toast provider affecting entire application
    - _Mitigation_: Implement and test Phase A thoroughly before Phase B
3. **Shape Type Attempt Tracking**: Per type vs per individual shape
    - _Mitigation_: Clear data structure for shape type attempts
4. **Web Audio API Integration**: Simple tone generation without conflicts
    - _Mitigation_: Test audio early, use global toast for error notifications

### Medium-Risk Areas

1. **Animation Complexity**: Multiple concurrent animations with 1.1x hover effects and aspect-ratio preservation
2. **State Synchronization**: Between game state and TTS
3. **Shape Variations**: Three triangle types with size and thickness variations
4. **Container PNG Integration**: CSS scaling with hover effects while maintaining aspect ratio
5. **Toast Configuration Management**: Ensuring proper message/type passing via props/context

### Low-Risk Areas

1. **Component Integration**: Well-established patterns
2. **Data Structure**: Simple shape and bin concepts
3. **Basic UI**: Similar to existing lesson components
4. **Clean Dark Theme**: Minimal background complexity
5. **Simple Shadows**: Basic CSS shadows without drag complexity
6. **Toast Library**: react-hot-toast is battle-tested and reliable
7. **Container Assets**: Confirmed PNG files available in /public/images/
8. **Sequential Implementation**: Phase A completed before Phase B dependencies

## Testing Strategy

### Phase A Testing (Global Toast Infrastructure)

1. **App.jsx Integration**: Verify toast provider wraps entire application correctly
2. **Cross-Route Testing**: Test notifications work across all existing routes
3. **Configuration Testing**: Verify configurable messages, types, and styling options
4. **Hook Testing**: Test useToast hook functionality across different components
5. **Error Boundary Separation**: Ensure toast system is independent of error boundaries

### Phase B Testing (Shape Sorting Game)

1. **Game Foundation**: Shape rendering, basic interactions, container integration
2. **Toast Integration**: Verify game properly uses global toast system from Phase A
3. **Container Integration**: PNG loading, 1.1x hover scaling, aspect-ratio preservation
4. **Interaction Flow**: Test all 13 interaction phases sequentially
5. **Animation Testing**: Verify all timing specifications (0.8s, 0.6s, 3s, 1.1x)
6. **Audio Integration**: Web Audio API functionality with toast error notifications
7. **Edge Cases**: Rapid clicking, invalid drops, hover state management

### Integration Testing

-   **Platform Scalability**: Toast system usage across different game scenarios
-   **Performance Testing**: Game performance with global toast system active
-   **User Experience**: Smooth integration between game and notification system

### Success Criteria

-   **Phase A**: Global toast system working at App.jsx level across entire platform
-   **Phase B**: Smooth transitions between all 13 game phases with specified timings
-   Accurate attempt tracking per shape type
-   Clear visual feedback with 1.1x hover effects, simple shadows, and aspect-ratio preserved scaling
-   Performance-based completion messages
-   Automatic navigation to home page on completion
-   Web Audio API sounds with global toast error notifications
-   Configurable toast messages and types working properly
-   Platform-ready notification system for future lessons/chapters/classes

## Recommended Technology Decisions

### Toast Notification Library Choice

**Recommendation: react-hot-toast**

**Why react-hot-toast over react-toastify:**

-   **Smaller bundle size**: ~3KB vs ~15KB
-   **Better performance**: No DOM manipulation, uses React portals
-   **Simpler API**: More intuitive for React developers
-   **Better TypeScript support**: Built with TypeScript from ground up
-   **Customizable styling**: Easier to match your dark theme
-   **Promise support**: Built-in support for async operations

### Global State Management Approach

**Recommendation: React Context + Custom Hooks**

**Why Context over Redux/Zustand for notifications:**

-   **Platform Scale Considerations**:
    -   Multiple lessons → chapters → classes → platform
    -   Notifications needed across all levels
    -   Simple state (just notification queue)
    -   No complex state mutations needed
-   **Context Benefits**:
    -   Built into React (no extra dependencies)
    -   Perfect for simple global state like notifications
    -   Easy to wrap entire app at App.jsx level
    -   Scales well with the lesson/chapter/class hierarchy
-   **Custom Hook Pattern**:
    -   `useToast()` hook for consistent usage
    -   Encapsulates notification logic
    -   Easy to extend for future features

## Final Implementation Specifications

### Complete Asset Integration

-   **Container Images**: All confirmed available in `/public/images/`
    -   `triangles_container.png`
    -   `circles_container.png`
    -   `squares_container.png`
    -   `rectangles_container.png`

### Finalized Architecture Decisions

-   **ToastProvider Location**: App.jsx level wrapping entire application
-   **Implementation Sequence**: Toast infrastructure first (Phase A), then game (Phase B)
-   **Configuration Strategy**: Messages and types via props/context, defaults in component
-   **Error Boundary**: Separate from notification system
-   **Testing Approach**: Focus on actual integration, no complex isolation

### Finalized Animation Specifications

-   **Container Hover**: 1.1x scale with aspect-ratio preservation
-   **Toast Duration**: 5 seconds default (configurable)
-   **Audio Timing**: 0.8s containers, 0.6s returns, 3s celebration
-   **Shadow Implementation**: Simple CSS shadows for performance

### Platform Integration Strategy

-   **Sequential Implementation**: Global infrastructure first, game second
-   **App-Level Integration**: Toast provider wraps entire application
-   **Configurable System**: Messages and toast types configurable via props/context
-   **Future-Ready**: Platform-wide notification system ready for all future features

## Plan Finalization Review

✅ **Architecture Complete**: Single component with state machine managing 13 interactions
✅ **Technology Stack Finalized**: react-hot-toast + React Context at App.jsx level
✅ **Implementation Sequence Defined**: Phase A (toast infrastructure) → Phase B (game)
✅ **Asset Integration Confirmed**: All container PNG files identified and available
✅ **Animation Specifications Set**: All timings and scale factors defined
✅ **Configuration Strategy Decided**: Props/context for messages, component defaults
✅ **Error Boundary Separation**: Independent systems confirmed
✅ **Testing Approach Simplified**: Focus on actual integration, no complex isolation
✅ **Platform Scalability Designed**: App-level toast system ready for platform growth
✅ **Risk Assessment Done**: High/medium/low risks identified with mitigations
✅ **Success Criteria Defined**: Clear metrics for both phases

**This implementation plan is now complete and ready for detailed todo creation.** All clarifications have been addressed, implementation sequence finalized, and architectural decisions confirmed. The plan provides a clear roadmap for implementing both the global toast infrastructure (Phase A) and the Shape Sorting Game (Phase B) in the optimal sequence for platform scalability and development efficiency.
