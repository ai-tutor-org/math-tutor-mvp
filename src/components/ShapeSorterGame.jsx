import React, { useReducer, useLayoutEffect, useRef, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameShape from './GameShape';
import SortingBin from './SortingBin';
import { 
    generateShapes, 
    SHAPE_TYPES, 
    CONTAINER_DEFINITIONS, 
    getShapeTypeCounts,
    isValidDrop,
    getPracticePhaseShapes,
    getGuidedPhaseShapes,
    getChallengePhaseShapes
} from '../data/shapeDefinitions';
import { useShapeAnimations } from '../hooks/useShapeAnimations';
import './ShapeSorterGame.css';

// Game phases following the 13 interaction sequence
const GAME_PHASES = {
    INTRO: 'intro',                    // Q1: Problem introduction
    TOOLS: 'tools',                    // Q2: Tools reveal
    MODELING: 'modeling',              // Q3: Automated demo (1 square)
    GUIDED: 'guided',                  // Q4: Guided practice (1 triangle)
    GUIDED_SUCCESS: 'guided_success',  // Q5: Guided success transition
    PRACTICE_SETUP: 'practice_setup',  // Q6: Practice setup (3 shapes)
    PRACTICE: 'practice',              // Q7: Practice with interventions
    INTERVENTION: 'intervention',      // Q8: Targeted intervention
    CORRECTION: 'correction',          // Q9: Automated correction
    CHALLENGE_SETUP: 'challenge_setup', // Q10: Final challenge setup
    CHALLENGE: 'challenge',            // Q11: Final challenge (8 shapes)
    COMPLETION: 'completion',          // Q12: Performance-based completion
    RECAP: 'recap'                     // Q13: Final recap
};

// Deterministic shape state calculator based on current phase
const getShapeStatesForPhase = (phase, shapes, targetCount = 12) => {
    let selectedShapes;
    
    // Select appropriate shapes based on phase
    switch(phase) {
        case GAME_PHASES.GUIDED:
            // Guided phase: 1 triangle
            selectedShapes = getGuidedPhaseShapes(shapes);
            break;
            
        case GAME_PHASES.PRACTICE:
        case GAME_PHASES.PRACTICE_SETUP:
            // Practice phases: triangle, circle, square
            selectedShapes = getPracticePhaseShapes(shapes);
            break;
            
        case GAME_PHASES.CHALLENGE:
        case GAME_PHASES.CHALLENGE_SETUP:
            // Challenge phases: 8 diverse shapes (2 of each type)
            selectedShapes = getChallengePhaseShapes(shapes);
            break;
            
        default:
            // All other phases: use first N shapes as before
            selectedShapes = shapes.slice(0, Math.min(targetCount, 12));
            break;
    }
    
    // Determine which shapes should be disabled
    const interactivePhases = [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE];
    
    if (interactivePhases.includes(phase)) {
        // Interactive phase: shapes are enabled for interaction
        const disabledShapeIds = shapes
            .filter(s => !selectedShapes.some(selected => selected.id === s.id))
            .map(s => s.id);
        
        return {
            activeShapes: selectedShapes,
            disabledShapes: disabledShapeIds
        };
    } else {
        // Non-interactive phase: all shapes are disabled
        const result = {
            activeShapes: selectedShapes,
            disabledShapes: selectedShapes.map(s => s.id) // All disabled for non-interactive phases
        };
        return result;
    }
};

// Initial game state structure
const initialState = {
    currentPhase: GAME_PHASES.INTRO,
    shapes: [],
    bins: {
        [SHAPE_TYPES.TRIANGLE]: { shapes: [], count: 0, isGlowing: false },
        [SHAPE_TYPES.CIRCLE]: { shapes: [], count: 0, isGlowing: false },
        [SHAPE_TYPES.RECTANGLE]: { shapes: [], count: 0, isGlowing: false },
        [SHAPE_TYPES.SQUARE]: { shapes: [], count: 0, isGlowing: false }
    },
    interventionCount: 0,
    maxInterventions: 2,
    targetShapes: 12, // Total shapes to work with
    currentShape: null,
    showCelebration: false,
    shapeAttempts: {
        [SHAPE_TYPES.TRIANGLE]: 0,
        [SHAPE_TYPES.CIRCLE]: 0,
        [SHAPE_TYPES.RECTANGLE]: 0,
        [SHAPE_TYPES.SQUARE]: 0
    },
    showContainers: false,
    activeShapes: [],
    disabledShapes: [],
    pileArea: { width: 400, height: 300 },
    showInterventionOverlay: false,
    interventionData: null,
    showProgressIndicator: false,
    shapesInitialized: false,
    demoStarted: false, // Flag to prevent multiple demo executions
    initialActiveCount: 0,
    lastFailedShape: null,
    waitingForPostAnimationTTS: false
};

// Game state reducer for managing all state transitions
const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PILE_AREA':
            return { 
                ...state, 
                pileArea: action.pileArea 
            };

        case 'SET_PHASE':
            return { 
                ...state, 
                currentPhase: action.phase,
                // Reset demo flag when changing phases
                demoStarted: action.phase === GAME_PHASES.MODELING ? false : state.demoStarted
            };

        case 'SHOW_CONTAINERS':
            return { 
                ...state, 
                showContainers: true 
            };

        case 'INITIALIZE_SHAPES':
            // Use deterministic state calculator based on current phase
            const targetCount = action.targetShapes || state.targetShapes;
            const shapeStates = getShapeStatesForPhase(state.currentPhase, action.shapes, targetCount);
            
            return {
                ...state,
                shapes: action.shapes,
                activeShapes: shapeStates.activeShapes,
                disabledShapes: shapeStates.disabledShapes,
                shapesInitialized: true,
                initialActiveCount: shapeStates.activeShapes.length
            };

        case 'ENABLE_SHAPES':
            return {
                ...state,
                activeShapes: action.shapeIds,
                disabledShapes: state.shapes
                    .filter(s => !action.shapeIds.includes(s.id))
                    .map(s => s.id)
            };

        case 'UPDATE_SHAPE_POSITION':
            return {
                ...state,
                shapes: state.shapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { ...shape, position: action.position }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { ...shape, position: action.position }
                        : shape
                )
            };

        // Unified Animation System Actions
        case 'ANIMATE_SHAPE':
            return {
                ...state,
                shapes: state.shapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            animation: {
                                ...action.animation,
                                startTime: action.animation.startTime || Date.now()
                            }
                          }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            animation: {
                                ...action.animation,
                                startTime: action.animation.startTime || Date.now()
                            }
                          }
                        : shape
                )
            };

        case 'STOP_SHAPE_ANIMATION':
            return {
                ...state,
                shapes: state.shapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            animation: {
                                type: 'none',
                                target: null,
                                duration: 0,
                                easing: 'easeOut',
                                onComplete: null,
                                startTime: null
                            }
                          }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            animation: {
                                type: 'none',
                                target: null,
                                duration: 0,
                                easing: 'easeOut',
                                onComplete: null,
                                startTime: null
                            }
                          }
                        : shape
                )
            };

        case 'COMPLETE_SHAPE_ANIMATION':
            const animatingShape = [...state.shapes, ...state.activeShapes]
                .find(s => s.id === action.shapeId);
            
            
            // Call completion callback if it exists
            if (animatingShape?.animation?.onComplete) {
                // Use setTimeout to avoid calling during reducer
                setTimeout(() => {
                    animatingShape.animation.onComplete(action.shapeId);
                }, 0);
            }
            
            // Clear animation state from both shapes arrays
            return {
                ...state,
                shapes: state.shapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            animation: {
                                type: 'none',
                                target: null,
                                duration: 0,
                                easing: 'easeOut',
                                onComplete: null,
                                startTime: null
                            }
                          }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            animation: {
                                type: 'none',
                                target: null,
                                duration: 0,
                                easing: 'easeOut',
                                onComplete: null,
                                startTime: null
                            }
                          }
                        : shape
                )
            };


        case 'SORT_SHAPE':
            const { shapeId: sortShapeId, binType } = action;
            const shape = state.shapes.find(s => s.id === sortShapeId);
            if (!shape) return state;
            
            return {
                ...state,
                shapes: state.shapes.filter(s => s.id !== sortShapeId),
                bins: {
                    ...state.bins,
                    [binType]: {
                        ...state.bins[binType],
                        shapes: [...state.bins[binType].shapes, shape],
                        count: state.bins[binType].count + 1
                    }
                }
            };

        case 'INCREMENT_ATTEMPTS':
            return {
                ...state,
                shapeAttempts: {
                    ...state.shapeAttempts,
                    [action.shapeType]: state.shapeAttempts[action.shapeType] + 1
                }
            };

        case 'RESET_ATTEMPTS':
            return {
                ...state,
                shapeAttempts: {
                    [SHAPE_TYPES.TRIANGLE]: 0,
                    [SHAPE_TYPES.CIRCLE]: 0,
                    [SHAPE_TYPES.RECTANGLE]: 0,
                    [SHAPE_TYPES.SQUARE]: 0
                }
            };

        case 'SHOW_INTERVENTION':
            return {
                ...state,
                showInterventionOverlay: true,
                interventionData: action.data
            };

        case 'HIDE_INTERVENTION':
            return {
                ...state,
                showInterventionOverlay: false,
                interventionData: null
            };

        case 'SET_BIN_GLOW':
            return {
                ...state,
                bins: {
                    ...state.bins,
                    [action.binType]: {
                        ...state.bins[action.binType],
                        isGlowing: action.isGlowing
                    }
                }
            };

        case 'SHOW_PROGRESS_INDICATOR':
            return {
                ...state,
                showProgressIndicator: action.show
            };


        case 'SET_CELEBRATION':
            return { 
                ...state, 
                showCelebration: action.show 
            };

        case 'SHAPE_DROP':
            const { shapeId: dropShapeId, shapeType, targetBin, isValidDrop: isValid } = action;
            
            if (isValid) {
                // Move shape to correct bin
                const updatedBins = {
                    ...state.bins,
                    [targetBin]: {
                        ...state.bins[targetBin],
                        shapes: [...state.bins[targetBin].shapes, dropShapeId],
                        count: state.bins[targetBin].count + 1,
                        isGlowing: false
                    }
                };
                
                // Remove shape from all arrays to prevent state inconsistency
                const updatedActiveShapes = state.activeShapes.filter(s => s.id !== dropShapeId);
                const updatedShapes = state.shapes.filter(s => s.id !== dropShapeId);
                const updatedDisabledShapes = state.disabledShapes.filter(id => id !== dropShapeId);
                
                return {
                    ...state,
                    bins: updatedBins,
                    shapes: updatedShapes,
                    activeShapes: updatedActiveShapes,
                    disabledShapes: updatedDisabledShapes // Critical fix: clean up disabled array
                };
            } else {
                // Handle incorrect drop - increment attempts and check for interventions
                const newAttempts = state.shapeAttempts[shapeType] + 1;
                
                // Ensure shape stays enabled after invalid drop
                const cleanDisabledShapes = state.disabledShapes.filter(id => id !== dropShapeId);
                
                return {
                    ...state,
                    shapeAttempts: {
                        ...state.shapeAttempts,
                        [shapeType]: newAttempts
                    },
                    // Explicitly ensure shape remains enabled after invalid drop
                    disabledShapes: cleanDisabledShapes,
                    // Store intervention data for useEffect to handle
                    lastFailedShape: { type: shapeType, attempts: newAttempts, id: dropShapeId }
                };
            }

        // Removed SET_BIN_HOVER - hover handled by component

        case 'SET_TARGET_SHAPES':
            return {
                ...state,
                targetShapes: action.count
            };

        case 'SET_MAX_INTERVENTIONS':
            return {
                ...state,
                maxInterventions: action.count
            };

        case 'SET_ACTIVE_SHAPES':
            return {
                ...state,
                activeShapes: action.shapes
            };

        case 'SET_DISABLED_SHAPES':
            return {
                ...state,
                disabledShapes: action.shapeIds
            };
        case 'UPDATE_SHAPE_HIGHLIGHT':
            return {
                ...state,
                shapes: state.shapes.map(shape => 
                    shape.id === action.shapeId 
                        ? { ...shape, isHighlighted: action.isHighlighted }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape => 
                    shape.id === action.shapeId 
                        ? { ...shape, isHighlighted: action.isHighlighted }
                        : shape
                )
            };

        case 'START_DEMO':
            return {
                ...state,
                demoStarted: true
            };

        case 'CLEAR_LAST_FAILED_SHAPE':
            return {
                ...state,
                lastFailedShape: null
            };

        case 'SET_WAITING_FOR_POST_ANIMATION_TTS':
            return {
                ...state,
                waitingForPostAnimationTTS: action.waiting
            };

        default:
            return state;
    }
};

const ShapeSorterGame = ({ contentProps = {}, startAnimation = false, onAnimationComplete, onShapeHint, onShapeAutoHelp, onShapeCorrection }) => {
    
    // Calculate initial state based on props (like other components)
    const initialGameState = useMemo(() => {
        const { phaseConfig } = contentProps;
        const phase = phaseConfig?.initialPhase || GAME_PHASES.INTRO;
        
        
        return {
            ...initialState,
            currentPhase: phase,
            targetShapes: phaseConfig?.targetShapes || initialState.targetShapes,
            maxInterventions: phaseConfig?.maxInterventions || initialState.maxInterventions,
            showContainers: ['tools', 'modeling', 'guided', 'practice', 'challenge'].includes(phase)
        };
    }, [contentProps]);

    const [state, dispatch] = useReducer(gameReducer, initialGameState);
    
    // Initialize unified animation system
    const shapeAnimations = useShapeAnimations(dispatch);
    
    const gameContentRef = useRef(null); // For drag constraints - proper game boundaries
    const playAreaRef = useRef(null); // For positioning context
    
    // Unified coordinate system: Container positions cache (play-area relative)
    const containerPositionsRef = useRef(new Map());
    
    // Helper function to get play area dimensions
    const getPlayAreaDimensions = () => {
        if (!playAreaRef.current) return { width: 800, height: 600 }; // fallback
        return {
            width: playAreaRef.current.offsetWidth,
            height: playAreaRef.current.offsetHeight
        };
    };
    
    // Smart boundary detection with tolerance
    const BOUNDARY_TOLERANCE = 20; // pixels of tolerance for edge detection
    const CONTAINER_COLLISION_TOLERANCE = 10; // pixels to expand collision detection (make it more sensitive)
    
    const isWithinPlayAreaBounds = (x, y, shapeType, tolerance = BOUNDARY_TOLERANCE) => {
        const playDimensions = getPlayAreaDimensions();
        const shapeDims = getShapeDimensions(shapeType);
        
        // Use tolerance-based boundary checking instead of pixel-perfect
        return x >= -tolerance && 
               (x + shapeDims.width) <= (playDimensions.width + tolerance) &&
               y >= -tolerance && 
               (y + shapeDims.height) <= (playDimensions.height + tolerance);
    };
    
    
    // Helper function to update container positions cache (play-area relative)
    const updateContainerPositions = () => {
        const positions = new Map();
        const playArea = playAreaRef.current;
        if (!playArea) return;
        
        Object.values(SHAPE_TYPES).forEach(type => {
            const containerElement = document.querySelector(`[data-container-type="${type}"]`);
            if (containerElement) {
                // Get container position relative to play area
                const containerRect = containerElement.getBoundingClientRect();
                const playAreaRect = playArea.getBoundingClientRect();
                
                positions.set(type, {
                    x: containerRect.left - playAreaRect.left,
                    y: containerRect.top - playAreaRect.top,
                    width: containerRect.width,
                    height: containerRect.height,
                    centerX: (containerRect.left - playAreaRect.left) + containerRect.width / 2,
                    centerY: (containerRect.top - playAreaRect.top) + containerRect.height / 2
                });
            }
        });
        
        containerPositionsRef.current = positions;
    };
    
    // Update container positions when containers are rendered or window resizes
    useEffect(() => {
        const handleUpdate = () => {
            // Wait for next frame to ensure containers are rendered
            requestAnimationFrame(() => {
                updateContainerPositions();
            });
        };
        
        // Update on mount and when needed
        handleUpdate();
        
        // Update on window resize
        window.addEventListener('resize', handleUpdate);
        
        return () => {
            window.removeEventListener('resize', handleUpdate);
        };
    }, [state.currentPhase, state.bins]); // Re-run when phase changes or bins update

    // Demonstration logic for MODELING phase - triggered by phase initialization
    useEffect(() => {
        if (state.currentPhase === GAME_PHASES.MODELING && 
            state.activeShapes.length > 0 && 
            state.shapesInitialized &&
            !state.demoStarted) { // Only run once
            
            
            // Mark demo as started to prevent re-execution
            dispatch({ type: 'START_DEMO' });
            
            // Find a square to demonstrate with
            const squareToDemo = state.activeShapes.find(shape => shape.type === SHAPE_TYPES.SQUARE);
            
            if (squareToDemo) {
                // Start demonstration immediately after TTS
                
                // Highlight the square
                dispatch({ 
                    type: 'UPDATE_SHAPE_HIGHLIGHT', 
                    shapeId: squareToDemo.id, 
                    isHighlighted: true 
                });
                
                // Glow the squares container
                dispatch({ 
                    type: 'SET_BIN_GLOW', 
                    binType: SHAPE_TYPES.SQUARE, 
                    isGlowing: true 
                });
                
                // After 2 seconds for highlighting effect and container rendering, start the drag animation
                setTimeout(() => {
                    // Use unified coordinate system from cache
                    updateContainerPositions(); // Ensure cache is fresh
                    const containerPos = containerPositionsRef.current.get(SHAPE_TYPES.SQUARE);
                    let targetPosition = { x: 200, y: 350 }; // fallback position in play area
                    
                    if (containerPos) {
                        // Calculate target position using cached container position (already play-area relative)
                        targetPosition = {
                            x: containerPos.centerX - 30, // Center of container minus shape half-width
                            y: containerPos.centerY - 30  // Center of container minus shape half-height
                        };
                    }
                    
                    // Start the animation using unified system
                    shapeAnimations.startDemoAnimation(
                        squareToDemo.id, 
                        targetPosition
                        // No callback needed - GameShape handles completion via onAnimationComplete
                    );
                    
                    // Animation completion is now handled by handleShapeAnimationComplete callback
                }, 2000); // Increased to match highlighting delay
            }
        }
    }, [state.currentPhase, state.activeShapes.length, state.shapesInitialized, state.demoStarted, onAnimationComplete]);

    // Completion detection for interactive phases (GUIDED, PRACTICE, CHALLENGE)
    const completionTriggeredRef = useRef(false);
    
    useEffect(() => {
        const completablePhases = [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE];
        
        // Only trigger completion for actual completable phases and prevent duplicate triggers
        if (completablePhases.includes(state.currentPhase) && 
            state.shapesInitialized &&  // Only after shapes are loaded
            state.initialActiveCount > 0 &&  // Had shapes to begin with
            state.activeShapes.length === 0 &&  // Now empty (completed)
            !state.waitingForPostAnimationTTS &&  // Not waiting for post-animation TTS
            !completionTriggeredRef.current) {  // Haven't already triggered completion
            
            completionTriggeredRef.current = true; // Prevent duplicate triggers
            
            // Signal completion to InteractiveLesson after brief delay
            setTimeout(() => {
                if (window.advanceToNextInteraction) {
                    window.advanceToNextInteraction();
                }
            }, 1500); // Allow time to see success message
        }
    }, [state.currentPhase, state.activeShapes.length, state.shapesInitialized, state.initialActiveCount, state.waitingForPostAnimationTTS]);
    
    // Reset completion flag when phase changes
    useEffect(() => {
        completionTriggeredRef.current = false;
    }, [state.currentPhase]);

    // Handle intervention logic for incorrect drops
    useEffect(() => {
        if (!state.lastFailedShape || !onShapeHint || !onShapeAutoHelp || !onShapeCorrection) return;

        const { type: shapeType, attempts, id: shapeId } = state.lastFailedShape;
        
        // Trigger interventions during guided practice (Q4), practice (Q7), and challenge (Q11)
        const interventionPhases = [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE];
        if (!interventionPhases.includes(state.currentPhase)) return;

        if (attempts === 2) {
            // 2nd wrong attempt: show targeted intervention (hint)
            onShapeHint(shapeType);
            
            // Highlight the correct container
            dispatch({ 
                type: 'SET_BIN_GLOW', 
                binType: shapeType, 
                isGlowing: true 
            });
            
            // Turn off glow after 3 seconds
            setTimeout(() => {
                dispatch({ 
                    type: 'SET_BIN_GLOW', 
                    binType: shapeType, 
                    isGlowing: false 
                });
            }, 3000);
            
        } else if (attempts === 3) {
            // 3rd wrong attempt: Show pre-animation help message, then animate, then show post-animation encouragement
            onShapeAutoHelp(shapeType);
            
            // Start auto-placement animation after TTS starts
            setTimeout(() => {
                // Use unified coordinate system from cache (same as demo animation)
                updateContainerPositions(); // Ensure cache is fresh
                const containerPos = containerPositionsRef.current.get(shapeType);
                let targetPosition = { x: 200, y: 350 }; // fallback position in play area
                
                if (containerPos) {
                    // Calculate target position using cached container position (already play-area relative)
                    targetPosition = {
                        x: containerPos.centerX - 30, // Center of container minus shape half-width
                        y: containerPos.centerY - 30  // Center of container minus shape half-height
                    };
                }
                
                
                // Start the auto-placement animation using unified system
                shapeAnimations.startDemoAnimation(
                    shapeId, 
                    targetPosition
                    // Let GameShape's onAnimationComplete handle completion naturally (like demo animation)
                );
                
                
                // Store the shape type for the animation completion handler
                window.pendingCorrectionShapeType = shapeType;
            }, 1000); // Delay to allow TTS to start (same as demo timing)
        }

        // Clear the lastFailedShape to prevent re-triggering
        dispatch({ type: 'CLEAR_LAST_FAILED_SHAPE' });
        
    }, [state.lastFailedShape, state.currentPhase, onShapeHint, onShapeAutoHelp, onShapeCorrection]);

    // Handle post-animation TTS completion notification
    useEffect(() => {
        const handlePostAnimationTTSComplete = () => {
            if (state.waitingForPostAnimationTTS) {
                dispatch({ type: 'SET_WAITING_FOR_POST_ANIMATION_TTS', waiting: false });
                
                // Now check if we should complete the interaction
                const completablePhases = [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE];
                if (completablePhases.includes(state.currentPhase) && 
                    state.shapesInitialized &&
                    state.initialActiveCount > 0 &&
                    state.activeShapes.length === 0 &&
                    !completionTriggeredRef.current) { // Use same flag to prevent duplicate triggers
                    
                    completionTriggeredRef.current = true; // Prevent duplicate triggers
                    
                    // Brief delay then advance
                    const timeoutId = setTimeout(() => {
                        if (window.advanceToNextInteraction) {
                            window.advanceToNextInteraction();
                        }
                    }, 100);
                    
                    // Store timeout ID for cleanup
                    if (!window.shapeSorterTimeouts) window.shapeSorterTimeouts = [];
                    window.shapeSorterTimeouts.push(timeoutId);
                }
            }
        };

        // Expose the callback globally
        window.notifyPostAnimationTTSComplete = handlePostAnimationTTSComplete;

        return () => {
            delete window.notifyPostAnimationTTSComplete;
        };
    }, [state.waitingForPostAnimationTTS, state.currentPhase, state.shapesInitialized, state.initialActiveCount, state.activeShapes.length]);

    // Cleanup global state on component unmount
    useEffect(() => {
        return () => {
            // Clean up any pending global state to prevent race conditions
            delete window.pendingCorrectionShapeType;
            
            // Cancel any pending timeouts to prevent stale closures from firing
            if (window.shapeSorterTimeouts) {
                window.shapeSorterTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
                delete window.shapeSorterTimeouts;
            }
        };
    }, []);

    // Initialize play area dimensions on mount using unified coordinate system
    useLayoutEffect(() => {
        if (!playAreaRef.current || !gameContentRef.current) return;
        
        const playDimensions = getPlayAreaDimensions();
        
        
        const playArea = { 
            width: Math.round(playDimensions.width), 
            height: Math.round(playDimensions.height) 
        };
        
        dispatch({ type: 'SET_PILE_AREA', pileArea: playArea }); // Reuse existing action for area dimensions
    }, []);

    // Responsive handling for play area resizing
    useEffect(() => {
        if (!playAreaRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            // Play area resized - may need to reposition shapes
            // Future: Recalculate shape positions if pile moves within play-area
            // For now, drag constraints will handle boundaries automatically
        });
        
        resizeObserver.observe(playAreaRef.current);
        
        return () => resizeObserver.disconnect();
    }, []);

    // Initialize shapes after play area is set AND phase is properly set from contentProps
    useEffect(() => {
        if (state.pileArea.width > 0 && state.shapes.length === 0 && contentProps.phaseConfig) {
            
            // Generate the 12 shapes
            const generatedShapes = generateShapes();
            
            // Generate positions in upper 60% of play-area only (clear separation from containers)
            const positionedShapes = generatedShapes.map((shape, index) => ({
                ...shape,
                position: { 
                    x: 40 + (index % 6) * 75,  // 6 shapes per row with 75px spacing
                    y: 40 + Math.floor(index / 6) * 70   // Only use upper area, max y = 40 + 2*70 = 180px
                }
            }));
            
            const finalShapes = positionedShapes;
            
            // Initialize shapes with proper target count
            const { phaseConfig } = contentProps;
            const targetCount = phaseConfig?.targetShapes || state.targetShapes || 12;
            
            dispatch({ 
                type: 'INITIALIZE_SHAPES', 
                shapes: finalShapes,
                targetShapes: targetCount
            });
            
        }
    }, [state.pileArea, state.shapes.length, contentProps]);

    // Handle phase changes from contentProps updates
    useEffect(() => {
        const { phaseConfig } = contentProps;
        const newPhase = phaseConfig?.initialPhase;
        const newTargetShapes = phaseConfig?.targetShapes;
        const newMaxInterventions = phaseConfig?.maxInterventions;
        
        if (newPhase && newPhase !== state.currentPhase) {
            // Phase has changed - update phase and recalculate shape states
            dispatch({ type: 'SET_PHASE', phase: newPhase });
            
            // Update containers visibility based on phase
            const shouldShowContainers = ['tools', 'modeling', 'guided', 'guided_success', 'practice_setup', 'practice', 'intervention', 'correction', 'challenge_setup', 'challenge', 'completion', 'recap'].includes(newPhase);
            if (shouldShowContainers !== state.showContainers) {
                dispatch({ type: 'SHOW_CONTAINERS' });
            }
            
            // Update target shapes and max interventions if provided
            if (newTargetShapes !== undefined && newTargetShapes !== state.targetShapes) {
                dispatch({ type: 'SET_TARGET_SHAPES', count: newTargetShapes });
            }
            if (newMaxInterventions !== undefined && newMaxInterventions !== state.maxInterventions) {
                dispatch({ type: 'SET_MAX_INTERVENTIONS', count: newMaxInterventions });
            }
            
            // Recalculate shape states based on new phase and target count
            if (state.shapes.length > 0) {
                const targetCount = newTargetShapes || state.targetShapes;
                const shapeStates = getShapeStatesForPhase(newPhase, state.shapes, targetCount);
                
                // Update both active and disabled shapes properly
                dispatch({
                    type: 'SET_ACTIVE_SHAPES',
                    shapes: shapeStates.activeShapes
                });
                
                // Update disabled shapes directly instead of using ENABLE_SHAPES
                dispatch({
                    type: 'SET_DISABLED_SHAPES',
                    shapeIds: shapeStates.disabledShapes
                });
            }
        }
    }, [contentProps, state.currentPhase, state.targetShapes, state.maxInterventions, state.shapes]);
    
    // Removed reactive shape enabling - now handled deterministically in INITIALIZE_SHAPES


    // Handle shape animation completion for immediate timing
    const handleShapeAnimationComplete = (shapeId, type = 'demo') => {
        
        // Handle demo animation completion specifically
        if (type === 'unified-demo' && state.currentPhase === GAME_PHASES.MODELING) {
            const animatedShape = state.activeShapes.find(s => s.id === shapeId);
            if (animatedShape && animatedShape.type === SHAPE_TYPES.SQUARE) {
                
                // First complete the animation to clear animation state
                dispatch({
                    type: 'COMPLETE_SHAPE_ANIMATION',
                    shapeId
                });
                
                // Then trigger SHAPE_DROP
                dispatch({
                    type: 'SHAPE_DROP',
                    shapeId: shapeId,
                    shapeType: SHAPE_TYPES.SQUARE,
                    targetBin: SHAPE_TYPES.SQUARE,
                    isValidDrop: true
                });
                
                // Trigger parent callback after brief moment for visual feedback
                setTimeout(() => {
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                }, 300);
                
                return;
            }
        }

        // Handle bounce animation completion
        if (type === 'unified-bounce' && 
            [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE].includes(state.currentPhase)) {
            
            
            // Clear animation state and sync position to Redux
            dispatch({
                type: 'COMPLETE_SHAPE_ANIMATION',
                shapeId
            });
            
            // Make sure shape remains enabled for dragging
            const currentShape = state.activeShapes.find(s => s.id === shapeId);
            if (currentShape) {
                dispatch({
                    type: 'UPDATE_SHAPE_POSITION',
                    shapeId: shapeId,
                    position: currentShape.position // Maintain current position
                });
            }
            
            return;
        }

        // Handle auto-placement animation completion (intervention 3rd attempt)
        if (type === 'unified-demo' && 
            [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE].includes(state.currentPhase)) {
            
            
            const animatedShape = state.activeShapes.find(s => s.id === shapeId);
            
            if (animatedShape) {
                
                // First complete the animation to clear animation state
                dispatch({
                    type: 'COMPLETE_SHAPE_ANIMATION',
                    shapeId
                });
                
                
                // Then trigger SHAPE_DROP for auto-placement
                dispatch({
                    type: 'SHAPE_DROP',
                    shapeId: shapeId,
                    shapeType: animatedShape.type,
                    targetBin: animatedShape.type,
                    isValidDrop: true
                });
                
                // Check if this was an auto-placement intervention and trigger post-animation feedback
                if (window.pendingCorrectionShapeType) {
                    const shapeType = window.pendingCorrectionShapeType;
                    delete window.pendingCorrectionShapeType;
                    
                    // Set flag to wait for post-animation TTS completion
                    dispatch({ type: 'SET_WAITING_FOR_POST_ANIMATION_TTS', waiting: true });
                    
                    // Immediately trigger post-animation encouragement TTS
                    if (onShapeCorrection) {
                        onShapeCorrection(shapeType);
                    }
                }
                
                return;
            }
        }
        
        // Handle other unified animation completions
        if (type.startsWith('unified-')) {
            // Clear animation state for other animation types
            dispatch({
                type: 'COMPLETE_SHAPE_ANIMATION',
                shapeId
            });
            return;
        }
        
    };

    // Function removed - no longer needed without pile constraints

    // Container-aware bounce back with collision validation and retry logic
    const bounceToRandomPositionInShapeArea = (shapeId) => {
        if (!playAreaRef.current) return;
        
        const shape = state.activeShapes.find(s => s.id === shapeId);
        if (!shape) {
            return;
        }
        
        
        const playDimensions = getPlayAreaDimensions();
        const shapeDims = getShapeDimensions(shape.type);
        
        // Define safe zone parameters
        const MARGIN = 40;
        const maxShapeAreaHeight = playDimensions.height * 0.6; // Only upper 60% for shapes
        const maxAttempts = 10; // Retry limit to avoid infinite loops
        
        let validPosition = null;
        let attempts = 0;
        
        // Find a position that's clear of all containers
        while (!validPosition && attempts < maxAttempts) {
            const randomX = MARGIN + Math.random() * (playDimensions.width - shapeDims.width - MARGIN * 2);
            const randomY = MARGIN + Math.random() * (maxShapeAreaHeight - shapeDims.height - MARGIN * 2);
            
            // Validate position is clear of containers and within bounds
            if (isPositionClearOfContainers(randomX, randomY, shape.type) && 
                isWithinPlayAreaBounds(randomX, randomY, shape.type, 0)) { // Use 0 tolerance for strict validation
                validPosition = { x: randomX, y: randomY };
            }
            
            attempts++;
        }
        
        // Fallback to center-left if no valid position found
        if (!validPosition) {
            validPosition = {
                x: MARGIN,
                y: playDimensions.height * 0.3 // Middle of upper shape area
            };
        }
        
        
        // Use unified animation system for bounce back
        shapeAnimations.startBounceAnimation(shapeId, validPosition);
        
        
    };

    // Get shape dimensions based on type
    const getShapeDimensions = (shapeType) => {
        switch(shapeType) {
            case SHAPE_TYPES.TRIANGLE:
                return { width: 60, height: 52 };
            case SHAPE_TYPES.CIRCLE:
                return { width: 60, height: 60 };
            case SHAPE_TYPES.RECTANGLE:
                return { width: 80, height: 50 };
            case SHAPE_TYPES.SQUARE:
                return { width: 60, height: 60 };
            default:
                return { width: 60, height: 60 };
        }
    };

    // AABB Collision Detection - Check if two rectangles overlap
    const checkAABBCollision = (rect1, rect2) => {
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    };

    // Check if shape overlaps with any container using unified coordinate system with tolerance
    const getOverlappingContainer = (shapeX, shapeY, shapeType) => {
        const shapeDims = getShapeDimensions(shapeType);

        // Shape bounds in play-area coordinates (unified system)
        // Expand shape bounds OUTWARD to make collision detection more sensitive (easier to trigger)
        const shapeBounds = {
            left: shapeX - CONTAINER_COLLISION_TOLERANCE,
            right: shapeX + shapeDims.width + CONTAINER_COLLISION_TOLERANCE,
            top: shapeY - CONTAINER_COLLISION_TOLERANCE,
            bottom: shapeY + shapeDims.height + CONTAINER_COLLISION_TOLERANCE
        };

        // Check each container using cached positions (also in play-area coordinates)
        for (const [containerType, containerPos] of containerPositionsRef.current) {
            const containerBounds = {
                left: containerPos.x,
                right: containerPos.x + containerPos.width,
                top: containerPos.y,
                bottom: containerPos.y + containerPos.height
            };
            
            if (checkAABBCollision(shapeBounds, containerBounds)) {
                return containerType;
            }
        }
        
        return null;
    };

    // Check if position is clear of all containers
    const isPositionClearOfContainers = (x, y, shapeType) => {
        return getOverlappingContainer(x, y, shapeType) === null;
    };
    

    // Shape drag handlers
    const handleShapeDragStart = (shape) => {
        if (state.disabledShapes.includes(shape.id)) {
            return false;
        }
        // Clear any existing hover states
        setDragHoverState({});
    };
    
    // Track drag position to update container hover states
    const handleShapeDrag = (shape, _event, info) => {
        if (state.disabledShapes.includes(shape.id)) {
            return;
        }
        
        // Get current position during drag
        const currentX = info.point?.x ?? (info.offset.x + (shape.position?.x || 0));
        const currentY = info.point?.y ?? (info.offset.y + (shape.position?.y || 0));
        
        // Update hover states for visual feedback
        updateDragHover(currentX, currentY, shape.type);
    };

    const handleShapeDragEnd = (shape, _event, info) => {        
        if (state.disabledShapes.includes(shape.id)) {
            return;
        }
        
        // Clear hover states
        setDragHoverState({});
        
        // Get final position from enhanced motion tracking (already in play-area coordinates)
        const finalX = info.point?.x ?? (info.offset.x + (shape.position?.x || 0));
        const finalY = info.point?.y ?? (info.offset.y + (shape.position?.y || 0));
        
        
        // Use AABB collision to check if shape overlaps with any container
        const overlappingContainer = getOverlappingContainer(finalX, finalY, shape.type);
        
        if (overlappingContainer) {
            const isValid = overlappingContainer === shape.type;
            
            if (isValid) {
                // Valid drop - move to container
                dispatch({
                    type: 'SHAPE_DROP',
                    shapeId: shape.id,
                    shapeType: shape.type,
                    targetBin: overlappingContainer,
                    isValidDrop: true
                });
            } else {
                // Invalid drop on wrong container - track attempt and bounce back
                dispatch({
                    type: 'SHAPE_DROP',
                    shapeId: shape.id,
                    shapeType: shape.type,
                    targetBin: overlappingContainer,
                    isValidDrop: false
                });
                
                // Bounce back to shape area
                bounceToRandomPositionInShapeArea(shape.id);
            }
        } else {
            // Not overlapping any container - allow drop anywhere within reasonable bounds
            const playDimensions = getPlayAreaDimensions();
            const shapeDims = getShapeDimensions(shape.type);
            
            // If shape is way outside bounds, clamp to safe area
            const clampedX = Math.max(0, Math.min(finalX, playDimensions.width - shapeDims.width));
            const clampedY = Math.max(0, Math.min(finalY, playDimensions.height - shapeDims.height));
            
            dispatch({
                type: 'UPDATE_SHAPE_POSITION',
                shapeId: shape.id,
                position: { x: clampedX, y: clampedY }
            });
        }
    };

    // Container refs for collision detection
    const containerRefs = useRef({
        [SHAPE_TYPES.TRIANGLE]: null,
        [SHAPE_TYPES.CIRCLE]: null,
        [SHAPE_TYPES.RECTANGLE]: null,
        [SHAPE_TYPES.SQUARE]: null
    });
    
    // Track which container is being dragged over for visual feedback
    const [dragHoverState, setDragHoverState] = useState({});
    
    // Update collision detection during drag
    const updateDragHover = (shapeX, shapeY, shapeType) => {
        const overlappingContainer = getOverlappingContainer(shapeX, shapeY, shapeType);
        
        setDragHoverState(() => {
            const newState = {};
            Object.values(SHAPE_TYPES).forEach(type => {
                newState[type] = type === overlappingContainer;
            });
            return newState;
        });
    };

    // Render current phase content
    const renderPhaseContent = () => {
        
        switch (state.currentPhase) {
            case GAME_PHASES.INTRO:
                return (
                    <div className="phase-intro">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={shape.isHighlighted}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                        </div>
                    </div>
                );

            case GAME_PHASES.TOOLS:
                return (
                    <div className="phase-tools">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={true} // All shapes disabled in TOOLS phase
                                    isHighlighted={false}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            {state.showContainers && (
                                <motion.div 
                                    className="containers-area"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    {Object.values(SHAPE_TYPES).map(shapeType => (
                                        <SortingBin
                                            key={shapeType}
                                            type={shapeType}
                                            count={state.bins[shapeType].count}
                                            isGlowing={state.bins[shapeType].isGlowing}
                                            isDraggedOver={dragHoverState[shapeType] || false}
                                            ref={el => containerRefs.current[shapeType] = el}
                                        />
                                ))}
                            </motion.div>
                        )}
                        </div>
                    </div>
                );

            case GAME_PHASES.MODELING:
                return (
                    <div className="phase-modeling">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => {
                                // In MODELING phase, only highlight the demo square, disable all interaction
                                const isDemoSquare = shape.type === SHAPE_TYPES.SQUARE && shape.isHighlighted;
                                return (
                                    <GameShape
                                        key={shape.id}
                                        shape={shape}
                                        isDisabled={true} // All shapes disabled during demo - no user interaction
                                        isHighlighted={isDemoSquare} // Only demo square highlighted
                                        onDragStart={handleShapeDragStart}
                                        onDrag={handleShapeDrag}
                                        onDragEnd={handleShapeDragEnd}
                                        onAnimationComplete={handleShapeAnimationComplete}
                                        dragConstraints={false}
                                    />
                                );
                            })}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.GUIDED:
                return (
                    <div className="phase-guided">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={shape.isHighlighted}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.GUIDED_SUCCESS:
                return (
                    <div className="phase-guided-success">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={true}
                                    isHighlighted={false}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={false}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.PRACTICE_SETUP:
                return (
                    <div className="phase-practice-setup">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={shape.isHighlighted}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.PRACTICE:
                return (
                    <div className="phase-practice">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={shape.isHighlighted}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.INTERVENTION:
                return (
                    <div className="phase-intervention">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={true} // Highlight shapes during intervention
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.CORRECTION:
                return (
                    <div className="phase-correction">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={true} // Disabled during automated correction
                                    isHighlighted={false}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={false}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.CHALLENGE_SETUP:
                return (
                    <div className="phase-challenge-setup">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={shape.isHighlighted}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.CHALLENGE:
                return (
                    <div className="phase-challenge">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Shapes positioned freely */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={state.disabledShapes.includes(shape.id)}
                                    isHighlighted={shape.isHighlighted}
                                    onDragStart={handleShapeDragStart}
                                    onDrag={handleShapeDrag}
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={false}
                                />
                            ))}
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={state.bins[shapeType].isGlowing}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.COMPLETION:
                return (
                    <div className="phase-completion">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Containers positioned at bottom - no shapes shown */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={false}
                                        isDraggedOver={dragHoverState[shapeType] || false}
                                        ref={el => containerRefs.current[shapeType] = el}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.RECAP:
                // Static shapes for recap - one of each type in 2x2 grid
                const recapShapes = [
                    {
                        id: 'recap-triangle',
                        type: SHAPE_TYPES.TRIANGLE,
                        color: '#8A9BA8', // Vibrant bluish-grey (same as game shapes)
                        size: 200, // Much bigger size to fill container
                        position: { x: 0, y: 0 },
                        thickness: 'normal',
                        variant: 'equilateral'
                    },
                    {
                        id: 'recap-circle',
                        type: SHAPE_TYPES.CIRCLE,
                        color: '#8A9BA8', // Vibrant bluish-grey (same as game shapes)
                        size: 200, // Much bigger size to fill container
                        position: { x: 0, y: 0 },
                        thickness: 'normal'
                    },
                    {
                        id: 'recap-rectangle',
                        type: SHAPE_TYPES.RECTANGLE,
                        color: '#8A9BA8', // Vibrant bluish-grey (same as game shapes)
                        size: 200, // Much bigger size to fill container
                        position: { x: 0, y: 0 },
                        thickness: 'normal'
                    },
                    {
                        id: 'recap-square',
                        type: SHAPE_TYPES.SQUARE,
                        color: '#8A9BA8', // Vibrant bluish-grey (same as game shapes)
                        size: 200, // Much bigger size to fill container
                        position: { x: 0, y: 0 },
                        thickness: 'normal'
                    }
                ];

                return (
                    <div className="phase-recap">
                        <div className="recap-shapes-grid">
                            {recapShapes.map((shape) => (
                                <div key={shape.id} className="recap-shape-container">
                                    <GameShape
                                        shape={shape}
                                        isDisabled={true}
                                        isHighlighted={contentProps?.highlightedShape === shape.type}
                                        dragConstraints={false}
                                        className="recap-size"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="phase-default">
                        <div className="implementation-status">
                            <h4>Current State:</h4>
                            <ul>
                                <li>Phase: {state.currentPhase}</li>
                                <li>Shapes loaded: {state.shapes.length}</li>
                                <li>Containers visible: {state.showContainers ? 'Yes' : 'No'}</li>
                                <li>Active shapes: {state.activeShapes.length}</li>
                            </ul>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="game-content" ref={gameContentRef}>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={state.currentPhase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="phase-container"
                >
                    {renderPhaseContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ShapeSorterGame;