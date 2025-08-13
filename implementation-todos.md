<!--
# Implementation Todos

## Purpose
This file contains the detailed, actionable todo list for implementing the current presentation. Each todo is specific, testable, and maps directly to the implementation plan.

## Usage
- Generated from the implementation plan
- Contains pinpoint implementation details for each task
- Organized in sequential order for efficient development
- Each todo should be independently testable
- Used for tracking progress during implementation
- Updated as todos are completed or modified during development

## Todo Structure
Each todo should include:
- **ID**: Unique identifier for the todo
- **Title**: Clear, concise description of the task
- **Description**: Detailed explanation of what needs to be done
- **Dependencies**: Other todos that must be completed first
- **Acceptance Criteria**: How to verify the todo is complete
- **Files Affected**: Which files will be created/modified
- **Testing Notes**: How to test the implementation

## Progress Tracking
- ⏳ **Pending**: Not started
- 🚧 **In Progress**: Currently being worked on
- ✅ **Completed**: Finished and tested
- ❌ **Blocked**: Cannot proceed due to dependencies or issues
-->

# Shape Sorting Game Implementation Todos

## Phase A: Global Toast Infrastructure ✅ **COMPLETED**

### A1: Setup and Dependencies
**Status**: ✅ **Completed**

**A1.1 - Install react-hot-toast Library** ✅ **Completed**
- **ID**: TOAST-001
- **Title**: Install and configure react-hot-toast dependency
- **Description**: Add react-hot-toast library to the project and verify installation
- **Dependencies**: None
- **Acceptance Criteria**: 
  - react-hot-toast appears in package.json ✅
  - Library imports successfully without errors ✅
  - No version conflicts with existing dependencies ✅
- **Files Affected**: 
  - `package.json` ✅
- **Testing Notes**: Run `npm install` and verify no errors, test basic import ✅

**A1.2 - Create ToastProvider Component** ✅ **Completed**
- **ID**: TOAST-002
- **Title**: Create configurable ToastProvider wrapper component
- **Description**: Build the global ToastProvider component with configurable props for messages, types, duration, and styling
- **Dependencies**: TOAST-001 ✅
- **Acceptance Criteria**:
  - ToastProvider component accepts config props (duration, position, style) ✅
  - Component wraps children and provides toast context ✅
  - Default values: 5s duration, top-right position, dark theme styling ✅
  - Supports configurable messages and toast types via props/context ✅
- **Files Affected**:
  - `src/components/ToastProvider.jsx` (created) ✅
  - `src/components/ToastProvider.css` (created) ✅
- **Testing Notes**: Test with basic config props, verify context provision ✅

**A1.3 - Create useToast Custom Hook** ✅ **Completed**
- **ID**: TOAST-003
- **Title**: Implement useToast hook for consistent usage patterns
- **Description**: Create custom hook that encapsulates toast notification logic with methods for different toast types
- **Dependencies**: TOAST-002 ✅
- **Acceptance Criteria**:
  - Hook provides showToast, showSuccess, showError, showWarning, showInfo methods ✅
  - Methods accept message and optional configuration parameters ✅
  - Hook integrates with react-hot-toast library ✅
  - Consistent API across all toast types ✅
- **Files Affected**:
  - `src/hooks/toast/useToast.js` (created and organized) ✅
- **Testing Notes**: Test each method with different message types and configurations ✅

**A1.4 - Create NotificationService** ✅ **Completed**
- **ID**: TOAST-004
- **Title**: Build centralized notification service layer
- **Description**: Implement service layer for managing notifications across the platform with queue management and error handling
- **Dependencies**: TOAST-003 ✅
- **Acceptance Criteria**:
  - Service provides centralized notification logic ✅
  - Handles notification queuing and management ✅
  - Provides error handling and fallback strategies ✅
  - Designed for platform-wide use across lessons/chapters/classes ✅
- **Files Affected**:
  - `src/services/NotificationService.js` (created) ✅
- **Testing Notes**: Test service with multiple notifications, verify queue management ✅

### A2: App Integration and Styling
**Status**: ✅ **Completed**

**A2.1 - Integrate ToastProvider at App.jsx Level** ✅ **Completed**
- **ID**: TOAST-005
- **Title**: Wrap entire application with ToastProvider at App.jsx level
- **Description**: Integrate ToastProvider as the top-level wrapper to provide toast functionality across entire application
- **Dependencies**: TOAST-002, TOAST-003, TOAST-004 ✅
- **Acceptance Criteria**:
  - ToastProvider wraps entire app structure in App.jsx ✅
  - Configuration passed via props (duration: 5000, position: 'top-right') ✅
  - Toast context available throughout application ✅
  - No interference with existing app functionality ✅
- **Files Affected**:
  - `src/App.jsx` ✅
- **Testing Notes**: Navigate through existing routes, verify toast context accessible everywhere ✅

**A2.2 - Implement Dark Theme Toast Styling** ✅ **Completed**
- **ID**: TOAST-006
- **Title**: Configure toast styling to match application dark theme
- **Description**: Style toast notifications with dark theme colors, proper contrast, and visual consistency with existing UI
- **Dependencies**: TOAST-005 ✅
- **Acceptance Criteria**:
  - Toast notifications match application dark theme ✅
  - Proper contrast for accessibility ✅
  - Different colors for success (green), error (red), warning (yellow), info (blue) ✅
  - Consistent typography and spacing with app design ✅
- **Files Affected**:
  - `src/components/ToastProvider.css` ✅
  - `src/components/ToastProvider.jsx` ✅
- **Testing Notes**: Test all toast types (success, error, warning, info) for visual consistency ✅

**A2.3 - Export Toast Components** ✅ **Completed**
- **ID**: TOAST-007
- **Title**: Add toast components to barrel exports
- **Description**: Export ToastProvider and useToast hook through component index for consistent imports
- **Dependencies**: TOAST-001, TOAST-002, TOAST-003 ✅
- **Acceptance Criteria**:
  - ToastProvider exported from components/index.js ✅
  - useToast hook exported appropriately ✅
  - Imports work consistently across application ✅
- **Files Affected**:
  - `src/components/index.js` ✅
  - `src/hooks/index.js` (created) ✅
- **Testing Notes**: Test imports from different parts of application ✅

### A3: Testing and Documentation
**Status**: ✅ **Completed**

**A3.1 - Test Global Toast Functionality** ✅ **Completed**
- **ID**: TOAST-008
- **Title**: Comprehensive testing of toast system across application
- **Description**: Test toast notifications work correctly across all existing routes and components
- **Dependencies**: TOAST-005, TOAST-006, TOAST-007 ✅
- **Acceptance Criteria**:
  - Toast notifications display correctly on all existing routes ✅
  - Different toast types render with proper styling ✅
  - Configuration options work as expected ✅
  - No console errors or memory leaks ✅
  - Toast positioning and timing work correctly ✅
- **Files Affected**: N/A (testing only) ✅
- **Testing Notes**: Test on home page, lesson routes, settings (if exists), various screen sizes ✅

**A3.2 - Document Toast Usage Patterns** ✅ **Completed**
- **ID**: TOAST-009
- **Title**: Create documentation for platform-wide toast usage
- **Description**: Document how to use the toast system for future lessons, chapters, and platform features
- **Dependencies**: TOAST-008 ✅
- **Acceptance Criteria**:
  - Clear usage examples for all toast types ✅
  - Configuration options documented ✅
  - Best practices for different scenarios ✅
  - Integration patterns for new components ✅
- **Files Affected**:
  - `src/hooks/toast/README-Toast.md` (created and organized) ✅
  - Add comments in ToastProvider.jsx ✅
- **Testing Notes**: Follow documentation to implement test notifications ✅

**A3.3 - Verify Error Boundary Separation** ✅ **Completed**
- **ID**: TOAST-010
- **Title**: Ensure toast system is independent of error boundaries
- **Description**: Verify that toast notifications work independently of React error boundaries and don't interfere with error handling
- **Dependencies**: TOAST-008 ✅
- **Acceptance Criteria**:
  - Toast system continues working during component errors ✅
  - Error boundaries don't affect toast functionality ✅
  - Toast and error handling are completely separate systems ✅
- **Files Affected**: N/A (testing only) ✅
- **Testing Notes**: Simulate component errors, verify toast independence ✅

## Phase B: Shape Sorting Game (Implemented Second)

### B1: Foundation Setup (Independent Batch)
**Status**: ⏳ **Pending**

**B1.1 - Create ShapeSorterGame Main Component**
- **ID**: GAME-001
- **Title**: Build main game component with state machine structure
- **Description**: Create the primary ShapeSorterGame component with useReducer for managing 13 interaction phases
- **Dependencies**: TOAST-010 (Phase A complete)
- **Acceptance Criteria**:
  - Component uses useReducer for state management
  - Initial state structure includes all required properties
  - Basic phase transitions work (intro → tools → modeling)
  - Component integrates with global toast system for error notifications
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx` (new)
  - `src/components/ShapeSorterGame.css` (new)
- **Testing Notes**: Test basic rendering and state transitions

**B1.2 - Define Shape Data Structures**
- **ID**: GAME-002
- **Title**: Implement shape definitions with variations
- **Description**: Create data structures for 12 shapes (3 triangles, 3 circles, 3 rectangles, 3 squares) with size and thickness variations
- **Dependencies**: GAME-001
- **Acceptance Criteria**:
  - 12 total shapes: 3 of each type (triangle, circle, rectangle, square)
  - Triangle variants: 3 broadly different types (not educational detail)
  - Size variations: 80%, 100%, 120% (subtle differences)
  - Thickness variations: thin, normal, thick
  - Shape positions randomized/jumbled
- **Files Affected**:
  - `src/data/shapeDefinitions.js` (new)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Verify 12 unique shapes with correct variations

**B1.3 - Create GameShape Component**
- **ID**: GAME-003
- **Title**: Build individual draggable shape component
- **Description**: Create reusable component for individual shapes with drag functionality, size variations, and simple shadows
- **Dependencies**: GAME-002
- **Acceptance Criteria**:
  - Component renders different shape types (triangle, circle, rectangle, square)
  - Implements Framer Motion drag functionality
  - Supports size and thickness variations
  - Simple CSS shadows (no drag-following complexity)
  - Semi-transparent when disabled (guided phase)
- **Files Affected**:
  - `src/components/GameShape.jsx` (new)
  - `src/components/GameShape.css` (new)
- **Testing Notes**: Test dragging, different shape types, disabled state

**B1.4 - Create SortingBin Component**
- **ID**: GAME-004
- **Title**: Build drop zone container with PNG assets
- **Description**: Create sorting bin component using container PNG files with counters and hover effects
- **Dependencies**: GAME-003
- **Acceptance Criteria**:
  - Uses specific PNG files: triangles_container.png, circles_container.png, squares_container.png, rectangles_container.png
  - Displays shape counter below each container
  - 1.1x hover scaling with aspect-ratio preservation
  - Drop detection functionality
  - Glowing effect capability for interventions
- **Files Affected**:
  - `src/components/SortingBin.jsx` (new)
  - `src/components/SortingBin.css` (new)
- **Testing Notes**: Test PNG loading, hover effects, drop detection, counter updates

**B1.5 - Implement Basic Drag and Drop with Positioning**
- **ID**: GAME-005
- **Title**: Set up Framer Motion drag and drop with shape positioning utilities
- **Description**: Implement basic drag and drop functionality with existing positioning utilities for proper shape arrangement
- **Dependencies**: GAME-003, GAME-004
- **Acceptance Criteria**:
  - Shapes can be dragged from pile to bins
  - Drop detection works correctly
  - Uses existing `shapePositioning.js` utilities for overlap prevention
  - Shapes return to pile on incorrect drops (0.6s animation)
  - Random positioning when returning to pile using utilities
  - Smooth drag experience with proper constraints
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/GameShape.jsx`
  - `src/components/SortingBin.jsx`
  - `src/utils/shapePositioning.js` (integrate existing)
- **Testing Notes**: Test drag from pile to bins, verify return animation, check positioning utilities integration

### B2: Core Game Mechanics (Independent Batch)
**Status**: ⏳ **Pending**

**B2.1 - Implement Shape Type Attempt Tracking**
- **ID**: GAME-006
- **Title**: Build attempt tracking system per shape type
- **Description**: Track incorrect attempts per shape type (not individual shapes) to trigger interventions on 3rd wrong attempt
- **Dependencies**: GAME-005
- **Acceptance Criteria**:
  - Tracks attempts per shape type: triangle, circle, rectangle, square
  - Increments on incorrect drops only
  - Triggers intervention flag on 3rd incorrect attempt per shape type
  - Resets appropriately between game phases
  - Clear data structure for attempt management
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/utils/attemptTracker.js` (new)
- **Testing Notes**: Test attempt counting, intervention trigger flags, phase reset behavior

**B2.2 - Add Web Audio API Sound Effects**
- **ID**: GAME-007
- **Title**: Implement success/failure sound generation
- **Description**: Create Web Audio API sounds for success (higher pitch pop) and failure (lower pitch bloop), quieter than TTS
- **Dependencies**: None (independent of attempt tracking)
- **Acceptance Criteria**:
  - Success sound: higher pitch, pleasant tone
  - Failure sound: lower pitch, gentle tone
  - Sounds are quieter than TTS speech
  - Graceful degradation if Web Audio API fails
  - Uses global toast for audio failure notifications
- **Files Affected**:
  - `src/utils/audioManager.js` (new)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test both sounds, verify volume levels, test fallback, verify cross-browser compatibility

**B2.3 - Enhance Shape Return Animations**
- **ID**: GAME-008
- **Title**: Implement smooth shape return animations with positioning
- **Description**: Create polished 0.6s animations for shapes returning to pile with proper positioning using existing utilities
- **Dependencies**: GAME-005 (positioning utilities)
- **Acceptance Criteria**:
  - 0.6s animation duration for shape returns
  - Uses positioning utilities for non-overlapping placement
  - Smooth animation with proper easing
  - No overlap issues with other shapes
  - Works with both incorrect drops and manual corrections
- **Files Affected**:
  - `src/components/GameShape.jsx`
  - `src/components/ShapeSorterGame.jsx`
  - `src/utils/shapePositioning.js` (integrate existing)
- **Testing Notes**: Test return animations, verify timing and positioning, test overlap prevention

**B2.4 - Integrate Basic Success/Failure Handling**
- **ID**: GAME-009
- **Title**: Connect attempt tracking with audio feedback
- **Description**: Integrate attempt tracking system with audio feedback and basic game progression logic
- **Dependencies**: GAME-006, GAME-007, GAME-008
- **Acceptance Criteria**:
  - Successful drops play success sound and update counters
  - Failed drops play failure sound, increment attempts, and return shape
  - Proper integration between tracking and audio systems
  - Clean state management for success/failure flows
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test success/failure flows, verify audio timing, test state consistency

### B3: Intervention Foundation (Independent Batch)
**Status**: ⏳ **Pending**

**B3.1 - Create InterventionOverlay Component**
- **ID**: GAME-010
- **Title**: Build modal overlay for targeted help
- **Description**: Create overlay component that appears during interventions with specific shape-focused feedback
- **Dependencies**: None (independent component)
- **Acceptance Criteria**:
  - Modal-style overlay that appears during interventions
  - Shows specific feedback based on shape type and incorrect bin
  - Clear visual design that doesn't obstruct game view
  - Smooth enter/exit animations
  - Accessible for screen readers
- **Files Affected**:
  - `src/components/InterventionOverlay.jsx` (new)
  - `src/components/InterventionOverlay.css` (new)
- **Testing Notes**: Test overlay appearance, animation timing, accessibility

**B3.2 - Implement Targeted Feedback System**
- **ID**: GAME-011
- **Title**: Build context-aware feedback logic
- **Description**: Create smart feedback that provides specific guidance based on the shape being sorted and the incorrect bin chosen
- **Dependencies**: GAME-010
- **Acceptance Criteria**:
  - Feedback specific to shape type (e.g., "A triangle has 3 sides")
  - References the incorrect bin chosen
  - Guides user to correct bin
  - Consistent with educational messaging style
- **Files Affected**:
  - `src/data/feedbackMessages.js` (new)
  - `src/components/InterventionOverlay.jsx`
- **Testing Notes**: Test different shape/bin combinations for appropriate feedback

**B3.3 - Create Automated Correction System**
- **ID**: GAME-012
- **Title**: Implement automated shape placement
- **Description**: Build system that automatically places shapes in correct bins when user continues to struggle
- **Dependencies**: GAME-010, GAME-011
- **Acceptance Criteria**:
  - Activates if user fails after targeted intervention
  - Smooth animation of shape moving to correct bin
  - Updates bin counters appropriately
  - Provides encouraging tutor feedback
  - Tracks that help was used
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/utils/automatedCorrection.js` (new)
- **Testing Notes**: Test automated placement, verify counters and feedback

**B3.4 - Create Help Counter and Star System**
- **ID**: GAME-013
- **Title**: Build help stars indicator for final challenge
- **Description**: Create progress indicator showing available help (2 stars) during final challenge only
- **Dependencies**: GAME-012 (for help usage tracking)
- **Acceptance Criteria**:
  - Shows 2 stars during final challenge phase only
  - Stars fade when help is used
  - Hidden during other game phases
  - Visual indicator of remaining help available
  - Integrates with help limit enforcement
- **Files Affected**:
  - `src/components/ProgressIndicator.jsx` (new)
  - `src/components/ProgressIndicator.css` (new)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test visibility during final challenge, star fading, help limit tracking

### B4A: Basic Game Flow (Q1-Q6) (Independent Batch)
**Status**: ⏳ **Pending**

**B4A.1 - Implement Q1: Problem Introduction**
- **ID**: GAME-014
- **Title**: Build initial problem introduction phase
- **Description**: Implement Q1 with jumbled shapes pile and problem introduction
- **Dependencies**: B1 (Foundation), B2 (Core Mechanics)
- **Acceptance Criteria**:
  - Jumbled shapes pile visible with proper positioning
  - All shapes disabled for interaction initially
  - Proper tutor text: "Oh no! Welcome to the Shape Factory..."
  - "I can help!" button visible and functional
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/data/gamePhases.js` (new)
- **Testing Notes**: Test initial state, button functionality

**B4A.2 - Implement Q2: Tools Reveal**
- **ID**: GAME-015
- **Title**: Build tools reveal with container animations
- **Description**: Implement Q2 where containers animate in after help button click
- **Dependencies**: GAME-014
- **Acceptance Criteria**:
  - Four containers animate in (0.8s) after button click
  - Smooth container slide-in animation
  - Proper tutor text for tools introduction
  - Transition to modeling phase setup
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test container animations, timing, tutor text

**B4A.3 - Implement Q3: Modeling Phase**
- **ID**: GAME-016
- **Title**: Build automated demonstration with square sorting
- **Description**: Implement "I Do" phase where system demonstrates sorting one square automatically
- **Dependencies**: GAME-015
- **Acceptance Criteria**:
  - Automated square selection and movement to correct bin
  - Tutor explains square properties during animation
  - Success sound plays when shape is sorted
  - Smooth transition to guided phase
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test automated sorting animation, sound effects, tutor timing

**B4A.4 - Implement Q4: Guided Practice Setup**
- **ID**: GAME-017
- **Title**: Build guided triangle sorting with disabled shapes
- **Description**: Implement guided phase where user sorts one triangle with other shapes semi-transparent
- **Dependencies**: GAME-016
- **Acceptance Criteria**:
  - Only triangle enabled for interaction
  - Other shapes become semi-transparent and non-interactive
  - Basic success/failure feedback without interventions
  - Proper tutor guidance text
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/GameShape.jsx`
- **Testing Notes**: Test shape enabling/disabling, opacity changes, interaction restrictions

**B4A.5 - Implement Q5: Guided Success Transition**
- **ID**: GAME-018
- **Title**: Handle guided practice completion
- **Description**: Implement transition logic when guided triangle sorting is completed successfully
- **Dependencies**: GAME-017
- **Acceptance Criteria**:
  - Shape returns to pile on incorrect drop (0.6s animation)
  - Success feedback when triangle sorted correctly
  - Automatic transition to practice phase after success
  - Proper state management for phase transition
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test success detection, transition timing, state changes

**B4A.6 - Implement Q6: Practice Phase Setup**
- **ID**: GAME-019
- **Title**: Build practice sorting with 3 shapes
- **Description**: Implement practice phase with 3 shapes (rectangle, circle, square) enabled
- **Dependencies**: GAME-018
- **Acceptance Criteria**:
  - 3 shapes available for sorting (rectangle, circle, square)
  - All other shapes remain disabled/transparent
  - Basic success/failure feedback (no interventions yet)
  - Proper tutor text for practice phase
  - Foundation ready for intervention integration
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test 3-shape enabling, basic feedback, phase setup

### B4B: Intervention Integration (Q7-Q10) (Independent Batch)
**Status**: ⏳ **Pending**

**B4B.1 - Implement Q7: Practice with Interventions**
- **ID**: GAME-020
- **Title**: Integrate intervention system into practice phase
- **Description**: Add intervention triggers to Q6 practice phase with attempt tracking
- **Dependencies**: B3 (Intervention Foundation), GAME-019
- **Acceptance Criteria**:
  - Intervention triggers on 3rd wrong attempt per shape type
  - Uses intervention overlay and targeted feedback
  - Maintains practice phase with 3 shapes
  - Proper attempt tracking integration
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - Integration with B3 intervention components
- **Testing Notes**: Test intervention triggers, attempt tracking, overlay integration

**B4B.2 - Implement Q8: Targeted Intervention**
- **ID**: GAME-021
- **Title**: Execute targeted intervention flow
- **Description**: Implement full targeted intervention experience within practice phase
- **Dependencies**: GAME-020
- **Acceptance Criteria**:
  - Targeted feedback based on shape type and incorrect bin
  - Glowing bucket indication during intervention
  - Clear intervention flow with proper timing
  - User can attempt correction after intervention
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/InterventionOverlay.jsx`
- **Testing Notes**: Test intervention flow, glowing effects, user experience

**B4B.3 - Implement Q9: Automated Correction**
- **ID**: GAME-022
- **Title**: Execute automated correction flow
- **Description**: Implement automated correction if user still fails after intervention
- **Dependencies**: GAME-021
- **Acceptance Criteria**:
  - Automated correction activates if user fails after intervention
  - Smooth animation of shape moving to correct bin
  - Updates bin counters appropriately
  - Provides encouraging tutor feedback
  - Tracks that help was used
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test automated correction, animation smoothness, help tracking

**B4B.4 - Implement Q10: Final Challenge Setup**
- **ID**: GAME-023
- **Title**: Build transition to final challenge with help stars
- **Description**: Implement transition phase that introduces remaining 8 shapes and help star system
- **Dependencies**: GAME-022, B3 (Help Counter System)
- **Acceptance Criteria**:
  - Remaining 8 shapes appear and become available
  - Help stars (⭐ ⭐) counter visible
  - Tutor transition speech for final challenge
  - Intervention count reset to 0 for final challenge
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/ProgressIndicator.jsx`
- **Testing Notes**: Test shape appearance, help counter visibility, state reset

### B4C: Final Challenge (Q11-Q13) (Independent Batch)
**Status**: ⏳ **Pending**

**B4C.1 - Implement Q11: Final Challenge Gameplay**
- **ID**: GAME-024
- **Title**: Build final challenge with limited help system
- **Description**: Implement complex final challenge logic with help limits and attempt tracking
- **Dependencies**: GAME-023
- **Acceptance Criteria**:
  - Full drag/drop functionality for all 8 remaining shapes
  - Help limit enforcement (2 max interventions)
  - After help exhausted, silent failure mode (no interventions)
  - Star counter updates when help is used
  - Transition to completion when all shapes sorted
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test help limits, silent failure mode, completion triggers

**B4C.2 - Implement Q12: Game Completion**
- **ID**: GAME-025
- **Title**: Build performance-based completion messages
- **Description**: Implement adaptive completion phase with different messages based on performance
- **Dependencies**: GAME-024
- **Acceptance Criteria**:
  - Perfect score message: "A perfect score! You're a true shape superstar!"
  - Help used message: "All sorted! Fantastic job finishing the puzzle..."
  - Performance tracking accurate (zero interventions vs interventions used)
  - Celebratory animations (3-second duration)
  - Smooth transition to final recap
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/data/completionMessages.js` (new)
  - `src/components/CelebrationEffect.jsx` (new)
  - `src/components/CelebrationEffect.css` (new)
- **Testing Notes**: Test both message types, celebration timing, performance tracking

**B4C.3 - Implement Q13: Final Recap**
- **ID**: GAME-026
- **Title**: Build final shape properties summary
- **Description**: Implement final recap view with shape categories and properties
- **Dependencies**: GAME-025
- **Acceptance Criteria**:
  - Clean summary graphic with all 4 shape types
  - Key properties visually highlighted for each shape
  - "Next" button functionality (exits to home page)
  - Professional visual design
  - Automatic navigation capability
- **Files Affected**:
  - `src/components/ShapeSummary.jsx` (new)
  - `src/components/ShapeSummary.css` (new)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test recap display, Next button navigation, visual design

### B5: Polish & Integration (Independent Batch)
**Status**: ⏳ **Pending**

**B5.1 - Optimize Animation Timings**
- **ID**: GAME-027
- **Title**: Fine-tune all animation specifications
- **Description**: Ensure all animations meet specified timings and provide smooth user experience
- **Dependencies**: All B4 batches complete
- **Acceptance Criteria**:
  - Container slide-in: 0.8 seconds
  - Shape return animation: 0.6 seconds
  - Celebration duration: 3 seconds
  - Container hover: 1.1x scaling with aspect-ratio preservation
  - All animations smooth and performant
- **Files Affected**:
  - Multiple component CSS files
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Time all animations, verify smoothness across devices

**B5.2 - Add ContentData Integration**
- **ID**: GAME-028
- **Title**: Connect game to lesson content data system
- **Description**: Integrate ShapeSorterGame with contentData.js as a presentation in the lesson system
- **Dependencies**: GAME-026 (Q13 complete)
- **Acceptance Criteria**:
  - Game appears as 'shape-sorting-game' presentation in contentData.js
  - Follows "measurement-practice-activities" presentation
  - Proper transition integration with lesson system
  - Game manages internal phases without lesson system interference
  - Automatic navigation to home page on completion
- **Files Affected**:
  - `src/contentData.js`
  - `src/components/index.js`
- **Testing Notes**: Test lesson progression, verify game integration

**B5.3 - Integrate TTS with Dynamic Content**
- **ID**: GAME-029
- **Title**: Connect game with TTSManager for speech
- **Description**: Integrate all tutor speech with existing TTSManager, including dynamic performance-based content
- **Dependencies**: GAME-028
- **Acceptance Criteria**:
  - All tutor text plays through existing TTSManager
  - Dynamic content generation based on user performance
  - Speech timing doesn't conflict with game sounds
  - Proper audio hierarchy (TTS louder than game sounds)
  - Error handling if TTS fails (visual feedback only)
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/contentData.js`
- **Testing Notes**: Test speech playback, dynamic content, audio levels

**B5.4 - Error Handling and Edge Cases**
- **ID**: GAME-030
- **Title**: Implement comprehensive error handling
- **Description**: Add robust error handling for all game scenarios using global toast system
- **Dependencies**: GAME-029
- **Acceptance Criteria**:
  - Web Audio API failure notifications via toast
  - Container PNG loading error handling
  - Invalid drag/drop state recovery
  - Memory leak prevention
  - Graceful degradation for all features
- **Files Affected**:
  - All game component files
  - `src/utils/errorHandler.js` (new)
- **Testing Notes**: Test error scenarios, verify toast notifications

**B5.5 - Performance Optimization and Final Testing**
- **ID**: GAME-031
- **Title**: Optimize performance and conduct final integration testing
- **Description**: Final performance optimization and comprehensive testing of complete system
- **Dependencies**: GAME-030
- **Acceptance Criteria**:
  - Smooth performance with 12 shapes and animations
  - No memory leaks during extended play
  - Responsive performance on different screen sizes
  - All 13 interaction phases work correctly
  - Toast integration functions properly
  - Game statistics tracking accurate
  - Completion and navigation work correctly
- **Files Affected**: All game files (optimization)
- **Testing Notes**: Complete game walkthrough, performance monitoring, edge case testing

## Summary

**Total Todos**: 31 (10 Phase A ✅ + 21 Phase B)
**Current Status**: 
- Phase A: ✅ **COMPLETED** - Global toast infrastructure ready
- Phase B: ⏳ **PENDING** - Shape Sorting Game implementation

**Independent Batch Structure**:
1. ✅ Phase A: Complete - Global toast system ready
2. ⏳ B1: Foundation Setup (5 todos) - Basic game structure
3. ⏳ B2: Core Game Mechanics (4 todos) - Tracking, audio, animations
4. ⏳ B3: Intervention Foundation (4 todos) - Help system components  
5. ⏳ B4A: Basic Game Flow Q1-Q6 (6 todos) - Core interactions
6. ⏳ B4B: Intervention Integration Q7-Q10 (4 todos) - Help system integration
7. ⏳ B4C: Final Challenge Q11-Q13 (3 todos) - Completion experience
8. ⏳ B5: Polish & Integration (5 todos) - Final optimization

**Key Milestones**:
- ✅ A3.3: Phase A Complete - Global toast system ready  
- ⏳ B1.5: Foundation complete - Basic game structure functional
- ⏳ B2.4: Core mechanics complete - Tracking and audio working
- ⏳ B3.4: Intervention foundation complete - Help system components ready
- ⏳ B4A.6: Basic flow complete - Q1-Q6 interactions working
- ⏳ B4B.4: Intervention integration complete - Q7-Q10 with help system
- ⏳ B4C.3: Final challenge complete - Q11-Q13 completion experience
- ⏳ B5.5: Production-ready Shape Sorting Game

**Batch Testing Strategy**:
Each batch can be independently implemented, tested, and validated before proceeding to the next batch. This allows for:
- Isolated testing of each system
- Early detection of integration issues
- Incremental progress tracking
- Flexible development scheduling 