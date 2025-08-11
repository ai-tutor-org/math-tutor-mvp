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

### B1: Game Foundation Setup
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
  - Glowing effect for interventions
- **Files Affected**:
  - `src/components/SortingBin.jsx` (new)
  - `src/components/SortingBin.css` (new)
- **Testing Notes**: Test PNG loading, hover effects, drop detection, counter updates

**B1.5 - Implement Basic Drag and Drop**
- **ID**: GAME-005
- **Title**: Set up Framer Motion drag and drop system
- **Description**: Implement basic drag and drop functionality between shapes pile and sorting bins
- **Dependencies**: GAME-003, GAME-004
- **Acceptance Criteria**:
  - Shapes can be dragged from pile to bins
  - Drop detection works correctly
  - Shapes return to pile on incorrect drops (0.6s animation)
  - Random positioning when returning to pile
  - Smooth drag experience with proper constraints
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/GameShape.jsx`
  - `src/components/SortingBin.jsx`
- **Testing Notes**: Test drag from pile to bins, verify return animation, check performance with all 12 shapes



### B2: Game Logic Implementation
**Status**: ⏳ **Pending**

**B2.1 - Implement Shape Type Attempt Tracking**
- **ID**: GAME-006
- **Title**: Build attempt tracking system per shape type
- **Description**: Track incorrect attempts per shape type (not individual shapes) to trigger interventions on 3rd wrong attempt
- **Dependencies**: GAME-005
- **Acceptance Criteria**:
  - Tracks attempts per shape type: triangle, circle, rectangle, square
  - Increments on incorrect drops only
  - Triggers intervention on 3rd incorrect attempt per shape type
  - Resets appropriately between game phases
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/utils/attemptTracker.js` (new)
- **Testing Notes**: Test attempt counting, intervention triggers

**B2.2 - Add Web Audio API Sound Effects**
- **ID**: GAME-007
- **Title**: Implement success/failure sound generation
- **Description**: Create Web Audio API sounds for success (higher pitch pop) and failure (lower pitch bloop), quieter than TTS
- **Dependencies**: GAME-006
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



**B2.3 - Create Intervention System Logic**
- **ID**: GAME-008
- **Title**: Build targeted intervention and correction system
- **Description**: Implement intervention overlay and automated correction for struggling users
- **Dependencies**: GAME-006, GAME-007
- **Acceptance Criteria**:
  - Triggers on 3rd incorrect attempt per shape type
  - Shows targeted feedback based on specific shape and bin
  - Provides automated correction if user still fails
  - Respects help limit (2 max interventions)
  - Updates help star counter appropriately
- **Files Affected**:
  - `src/components/InterventionOverlay.jsx` (new)
  - `src/components/InterventionOverlay.css` (new)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test intervention triggers, automated correction, help limits, verify state transitions with edge cases



**B2.4 - Implement Help Counter and Star System**
- **ID**: GAME-009
- **Title**: Build help stars indicator for final challenge
- **Description**: Create progress indicator showing available help (2 stars) during final challenge only
- **Dependencies**: GAME-008
- **Acceptance Criteria**:
  - Shows 2 stars during final challenge phase only
  - Stars fade when help is used
  - Hidden during other game phases
  - Visual indicator of remaining help available
- **Files Affected**:
  - `src/components/ProgressIndicator.jsx` (new)
  - `src/components/ProgressIndicator.css` (new)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test visibility during final challenge, star fading

**B2.5 - Add Shape Return Animations**
- **ID**: GAME-010
- **Title**: Implement shape return to pile animations
- **Description**: Create smooth 0.6s animations for shapes returning to pile with random positioning
- **Dependencies**: GAME-005, GAME-007
- **Acceptance Criteria**:
  - 0.6s animation duration for shape returns
  - Random positioning in pile area
  - Smooth animation with proper easing
  - No overlap issues with other shapes
  - Works with both incorrect drops and automated corrections
- **Files Affected**:
  - `src/components/GameShape.jsx`
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test return animations, verify timing and positioning

### B3: Intervention System Implementation
**Status**: ⏳ **Pending**

**B3.1 - Create InterventionOverlay Component**
- **ID**: GAME-011
- **Title**: Build modal overlay for targeted help
- **Description**: Create overlay component that appears during interventions with specific shape-focused feedback
- **Dependencies**: GAME-008
- **Acceptance Criteria**:
  - Modal-style overlay that appears during interventions
  - Shows specific feedback based on shape type and incorrect bin
  - Clear visual design that doesn't obstruct game view
  - Smooth enter/exit animations
  - Accessible for screen readers
- **Files Affected**:
  - `src/components/InterventionOverlay.jsx`
  - `src/components/InterventionOverlay.css`
- **Testing Notes**: Test overlay appearance, different feedback messages

**B3.2 - Implement Targeted Feedback Logic**
- **ID**: GAME-012
- **Title**: Build context-aware feedback system
- **Description**: Create smart feedback that provides specific guidance based on the shape being sorted and the incorrect bin chosen
- **Dependencies**: GAME-011
- **Acceptance Criteria**:
  - Feedback specific to shape type (e.g., "A triangle has 3 sides")
  - References the incorrect bin chosen
  - Guides user to correct bin
  - Consistent with educational messaging style
- **Files Affected**:
  - `src/data/feedbackMessages.js` (new)
  - `src/components/InterventionOverlay.jsx`
- **Testing Notes**: Test different shape/bin combinations for appropriate feedback

**B3.3 - Add Automated Correction System**
- **ID**: GAME-013
- **Title**: Implement automated shape placement
- **Description**: Build system that automatically places shapes in correct bins when user continues to struggle
- **Dependencies**: GAME-011, GAME-012
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

**B3.4 - Implement Help Limit Enforcement**
- **ID**: GAME-014
- **Title**: Build help limit system (2 max interventions)
- **Description**: Enforce maximum of 2 interventions during final challenge, after which user must solve independently
- **Dependencies**: GAME-009, GAME-013
- **Acceptance Criteria**:
  - Tracks intervention count during final challenge
  - Allows maximum 2 interventions
  - After limit reached, no more interventions trigger
  - User must solve remaining shapes through trial and error
  - Clear indication when help is exhausted
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/ProgressIndicator.jsx`
- **Testing Notes**: Test help limit enforcement, behavior after limit reached

**B3.5 - Create Glowing Bucket Effects**
- **ID**: GAME-015
- **Title**: Implement visual feedback for interventions
- **Description**: Add glowing effects to correct bins during interventions and hover state enhancements
- **Dependencies**: GAME-004, GAME-011
- **Acceptance Criteria**:
  - Correct bin glows during intervention
  - Smooth glow animation with appropriate colors
  - Enhanced hover effects (1.1x scaling with aspect-ratio preservation)
  - Glowing stops when intervention ends
  - No performance impact from glow effects
- **Files Affected**:
  - `src/components/SortingBin.jsx`
  - `src/components/SortingBin.css`
- **Testing Notes**: Test glow effects, hover scaling, performance impact

### B4: Advanced Game Flow
**Status**: ⏳ **Pending**

**B4.1 - Implement Q1-Q2: Introduction and Tools**
- **ID**: GAME-016
- **Title**: Build intro phase with "I can help!" button and container animations
- **Description**: Implement first two interactions - problem introduction and tools reveal
- **Dependencies**: GAME-001, GAME-015
- **Acceptance Criteria**:
  - Q1: Jumbled shapes pile visible, "I can help!" button functional
  - Q2: Four containers animate in (0.8s) after button click
  - Proper tutor text for both phases
  - Smooth transition between Q1 and Q2
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/data/gamePhases.js` (new)
- **Testing Notes**: Test button functionality, container animations, tutor text

**B4.2 - Implement Q3: Modeling Phase**
- **ID**: GAME-017
- **Title**: Build automated demonstration with square sorting
- **Description**: Implement "I Do" phase where system demonstrates sorting one square automatically
- **Dependencies**: GAME-016
- **Acceptance Criteria**:
  - Automated square selection and movement to correct bin
  - Tutor explains square properties during animation
  - Success sound plays when shape is sorted
  - Smooth transition to guided phase
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test automated sorting animation, sound effects, tutor timing

**B4.3 - Implement Q4-Q5: Guided Practice**
- **ID**: GAME-018
- **Title**: Build guided triangle sorting with disabled shapes
- **Description**: Implement guided phase where user sorts one triangle with other shapes semi-transparent
- **Dependencies**: GAME-017
- **Acceptance Criteria**:
  - Only triangle enabled for interaction (other shapes semi-transparent)
  - Basic success/failure feedback without interventions
  - Shape returns to pile on incorrect drop (0.6s animation)
  - Transition to practice phase after success
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/GameShape.jsx`
- **Testing Notes**: Test shape enabling/disabling, return animations

**B4.4 - Implement Q6-Q7: Practice Phase**
- **ID**: GAME-019
- **Title**: Build practice sorting with 3 shapes and basic interventions
- **Description**: Implement practice phase with 3 shapes (rectangle, circle, square) and intervention system
- **Dependencies**: GAME-018, GAME-008 (intervention system)
- **Acceptance Criteria**:
  - 3 shapes available for sorting (rectangle, circle, square)
  - Intervention triggers on 3rd wrong attempt per shape type
  - Basic targeted feedback and automated correction
  - Transition to final challenge after all 3 sorted
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test intervention triggers, automated corrections, phase transition

**B4.5 - Implement Q8-Q9: Intervention System Integration**
- **ID**: GAME-020
- **Title**: Integrate targeted intervention and automated correction
- **Description**: Implement Q8 (targeted intervention) and Q9 (automated correction) within game flow
- **Dependencies**: GAME-019, GAME-011, GAME-012, GAME-013
- **Acceptance Criteria**:
  - Targeted feedback based on shape type and incorrect bin
  - Glowing bucket indication during intervention
  - Automated correction if user still fails after intervention
  - Proper help counter management
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/InterventionOverlay.jsx`
- **Testing Notes**: Test intervention flow, glowing effects, automated correction

**B4.6 - Implement Q10: Final Challenge Setup**
- **ID**: GAME-021
- **Title**: Build transition to final challenge with help stars
- **Description**: Implement transition phase that introduces remaining 8 shapes and help star system
- **Dependencies**: GAME-020, GAME-009 (help counter)
- **Acceptance Criteria**:
  - Remaining 8 shapes appear at top
  - Help stars (⭐ ⭐) counter visible
  - Tutor transition speech
  - intervention_count reset to 0
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/components/ProgressIndicator.jsx`
- **Testing Notes**: Test shape appearance, help counter visibility, state reset

**B4.7 - Implement Q11: Final Challenge Gameplay**
- **ID**: GAME-022
- **Title**: Build final challenge with limited help system
- **Description**: Implement complex final challenge logic with help limits and attempt tracking
- **Dependencies**: GAME-021, GAME-014 (help limit enforcement)
- **Acceptance Criteria**:
  - Full drag/drop functionality for all 8 remaining shapes
  - Help limit enforcement (2 max interventions)
  - After help exhausted, silent failure mode (no interventions)
  - Star counter updates when help is used
  - Transition to completion when all shapes sorted
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test help limits, silent failure mode, completion triggers

**B4.8 - Implement Q12: Game Completion**
- **ID**: GAME-023
- **Title**: Build performance-based completion messages
- **Description**: Implement adaptive completion phase with different messages based on performance
- **Dependencies**: GAME-022
- **Acceptance Criteria**:
  - Perfect score message: "A perfect score! You're a true shape superstar!"
  - Help used message: "All sorted! Fantastic job finishing the puzzle..."
  - Performance tracking accurate (zero interventions vs interventions used)
  - Smooth transition to final recap
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/data/completionMessages.js` (new)
- **Testing Notes**: Test both message types based on actual performance

**B4.9 - Implement Q13: Final Recap**
- **ID**: GAME-024
- **Title**: Build final shape properties summary
- **Description**: Implement final recap view with shape categories and properties
- **Dependencies**: GAME-023
- **Acceptance Criteria**:
  - Clean summary graphic with all 4 shape types
  - Key properties visually highlighted for each shape
  - "Next" button functionality (exits to home page)
  - Professional visual design
- **Files Affected**:
  - `src/components/ShapeSummary.jsx` (already planned)
  - `src/components/ShapeSummary.css` (already planned)
  - `src/components/ShapeSorterGame.jsx`
- **Testing Notes**: Test recap display, Next button navigation

**B4.10 - Add Celebratory Animations**
- **ID**: GAME-025
- **Title**: Create completion celebration effects
- **Description**: Implement confetti and star animations for game completion with 3-second duration
- **Dependencies**: GAME-023 (Q12 completion)
- **Acceptance Criteria**:
  - Celebratory animation triggers on game completion
  - 3-second duration with confetti/stars effects
  - Performance-optimized animations
  - Works on different screen sizes
  - Smooth transition to completion message
- **Files Affected**:
  - `src/components/CelebrationEffect.jsx` (new)
  - `src/components/CelebrationEffect.css` (new)
- **Testing Notes**: Test celebration animation, verify timing and performance

**B4.11 - Integrate TTS with Dynamic Content**
- **ID**: GAME-026
- **Title**: Connect game with TTSManager for speech
- **Description**: Integrate all tutor speech with existing TTSManager, including dynamic performance-based content
- **Dependencies**: GAME-024 (Q13 recap)
- **Acceptance Criteria**:
  - All tutor text plays through existing TTSManager
  - Dynamic content generation based on user performance
  - Speech timing doesn't conflict with game sounds
  - Proper audio hierarchy (TTS louder than game sounds)
  - Error handling if TTS fails (visual feedback only)
- **Files Affected**:
  - `src/components/ShapeSorterGame.jsx`
  - `src/contentData.js`
- **Testing Notes**: Test speech playback, dynamic content, audio levels, verify TTS + Web Audio coordination



### B5: Polish and Final Integration
**Status**: ⏳ **Pending**

**B5.1 - Optimize Animation Timings**
- **ID**: GAME-027
- **Title**: Fine-tune all animation specifications
- **Description**: Ensure all animations meet specified timings and provide smooth user experience
- **Dependencies**: GAME-010, GAME-015, GAME-025
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

**B5.2 - Implement Semi-Transparent Disabled Shapes**
- **ID**: GAME-028
- **Title**: Add visual feedback for guided phase
- **Description**: Make non-active shapes semi-transparent during guided interaction phase
- **Dependencies**: GAME-003, GAME-018 (Q4-Q5 guided practice)
- **Acceptance Criteria**:
  - Other shapes fade to semi-transparent during guided phase (Q4)
  - Smooth opacity transitions
  - Clear visual distinction between active and inactive shapes
  - No interaction possible with disabled shapes
- **Files Affected**:
  - `src/components/GameShape.jsx`
  - `src/components/GameShape.css`
- **Testing Notes**: Test guided phase shape states, verify opacity and interactions

**B5.3 - Add ContentData Integration**
- **ID**: GAME-029
- **Title**: Connect game to lesson content data system
- **Description**: Integrate ShapeSorterGame with contentData.js as a presentation in the lesson system
- **Dependencies**: GAME-026, GAME-028
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

**B5.4 - Error Handling and Edge Cases**
- **ID**: GAME-030
- **Title**: Implement comprehensive error handling
- **Description**: Add robust error handling for all game scenarios using global toast system
- **Dependencies**: GAME-007, GAME-029
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
- **Dependencies**: GAME-027, GAME-028, GAME-029, GAME-030
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

**Total Todos**: 37 (10 Phase A ✅ + 27 Phase B)
**Current Status**: 
- Phase A: ✅ **COMPLETED** - Global toast infrastructure ready
- Phase B: ⏳ **PENDING** - Shape Sorting Game implementation

**Critical Path Dependencies**:
1. ✅ Phase A must be completed before Phase B
2. Foundation components (B1) before game logic (B2)
3. Game logic (B2) before intervention system (B3)
4. Core systems (B1-B3) before advanced flow (B4)
5. Complete functionality (B4) before polish (B5)

**Key Milestones**:
- ✅ A3.3: Phase A Complete - Global toast system ready
- ⏳ B1.5: Basic game structure functional
- ⏳ B3.5: Complete intervention system working
- ⏳ B4.9: All 13 interaction phases implemented (Q1-Q13)
- ⏳ B4.11: Full game experience with TTS integration
- ⏳ B5.5: Production-ready Shape Sorting Game

**B4 Phase Breakdown (13 Interaction Implementation)**:
- B4.1-B4.2: Introduction and modeling (Q1-Q3)
- B4.3-B4.4: Guided and practice phases (Q4-Q7)
- B4.5-B4.7: Intervention system and final challenge setup (Q8-Q11)
- B4.8-B4.9: Completion and recap (Q12-Q13)
- B4.10-B4.11: Polish integration (celebration + TTS) 