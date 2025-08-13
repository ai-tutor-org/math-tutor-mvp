import React, { useReducer, useLayoutEffect, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameShape from './GameShape';
import SortingBin from './SortingBin';
import { 
    generateShapes, 
    SHAPE_TYPES, 
    CONTAINER_DEFINITIONS, 
    getShapeTypeCounts,
    isValidDrop 
} from '../data/shapeDefinitions';
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
    // Interactive phases where user can interact with shapes
    const interactivePhases = [GAME_PHASES.GUIDED, GAME_PHASES.PRACTICE, GAME_PHASES.CHALLENGE];
    
    if (interactivePhases.includes(phase)) {
        // Enable shapes up to target count, disable rest
        const enabledShapes = shapes.slice(0, targetCount);
        const disabledShapeIds = shapes
            .filter(s => !enabledShapes.some(enabled => enabled.id === s.id))
            .map(s => s.id);
        
        return {
            activeShapes: enabledShapes,
            disabledShapes: disabledShapeIds
        };
    }
    
    // Non-interactive phases: all shapes disabled
    return {
        activeShapes: shapes.slice(0, targetCount), // Still show target shapes
        disabledShapes: shapes.map(s => s.id)       // But all are disabled
    };
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
    gameStats: { 
        perfectScore: true, 
        totalAttempts: 0 
    },
    showContainers: false,
    activeShapes: [],
    disabledShapes: [],
    pileArea: { width: 400, height: 300 },
    showInterventionOverlay: false,
    interventionData: null,
    showProgressIndicator: false,
    helpStarsUsed: 0,
    shapesInitialized: false,
    demoStarted: false, // Flag to prevent multiple demo executions
    initialActiveCount: 0
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

        case 'BOUNCE_SHAPE':
            return {
                ...state,
                shapes: state.shapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            position: action.newPosition,
                            isBouncing: true // Flag for animation
                          }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { 
                            ...shape, 
                            position: action.newPosition,
                            isBouncing: true // Flag for animation
                          }
                        : shape
                )
            };

        case 'CLEAR_BOUNCE_FLAG':
            return {
                ...state,
                shapes: state.shapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { ...shape, isBouncing: false }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape =>
                    shape.id === action.shapeId 
                        ? { ...shape, isBouncing: false }
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
                },
                gameStats: {
                    ...state.gameStats,
                    totalAttempts: state.gameStats.totalAttempts + 1,
                    perfectScore: false
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

        case 'USE_HELP_STAR':
            return {
                ...state,
                helpStarsUsed: state.helpStarsUsed + 1,
                interventionCount: state.interventionCount + 1
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
                    disabledShapes: updatedDisabledShapes, // Critical fix: clean up disabled array
                    gameStats: {
                        ...state.gameStats,
                        totalAttempts: state.gameStats.totalAttempts + 1,
                        successfulDrops: (state.gameStats.successfulDrops || 0) + 1
                    }
                };
            } else {
                // Handle incorrect drop - increment attempts but don't change shape arrays
                return {
                    ...state,
                    shapeAttempts: {
                        ...state.shapeAttempts,
                        [shapeType]: state.shapeAttempts[shapeType] + 1
                    },
                    gameStats: {
                        ...state.gameStats,
                        totalAttempts: state.gameStats.totalAttempts + 1
                    }
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

        case 'START_SHAPE_ANIMATION':
            return {
                ...state,
                shapes: state.shapes.map(shape => 
                    shape.id === action.shapeId 
                        ? { ...shape, isAnimating: true, animationTarget: action.targetPosition }
                        : shape
                ),
                activeShapes: state.activeShapes.map(shape => 
                    shape.id === action.shapeId 
                        ? { ...shape, isAnimating: true, animationTarget: action.targetPosition }
                        : shape
                )
            };

        case 'START_DEMO':
            return {
                ...state,
                demoStarted: true
            };

        default:
            return state;
    }
};

const ShapeSorterGame = ({ contentProps = {}, startAnimation = false, onAnimationComplete }) => {
    
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
    const gameAreaRef = useRef(null);
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
    
    const shouldBounceFromBoundary = (x, y, shapeType) => {
        const playDimensions = getPlayAreaDimensions();
        const shapeDims = getShapeDimensions(shapeType);
        
        // Hard boundary check - shape is significantly outside play area
        const hardBoundaryViolation = x < -BOUNDARY_TOLERANCE || 
                                     (x + shapeDims.width) > (playDimensions.width + BOUNDARY_TOLERANCE) ||
                                     y < -BOUNDARY_TOLERANCE || 
                                     (y + shapeDims.height) > (playDimensions.height + BOUNDARY_TOLERANCE);
        
        return hardBoundaryViolation;
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
                    
                    // Start the animation
                    dispatch({
                        type: 'START_SHAPE_ANIMATION',
                        shapeId: squareToDemo.id,
                        targetPosition: targetPosition
                    });
                    
                    // Animation completion is now handled by handleShapeAnimationComplete callback
                }, 2000); // Increased to match highlighting delay
            }
        }
    }, [state.currentPhase, state.activeShapes.length, state.shapesInitialized, state.demoStarted, onAnimationComplete]);

    // Completion detection for GUIDED phase (triangle sorting)
    useEffect(() => {
        if (state.currentPhase === GAME_PHASES.GUIDED && 
            state.shapesInitialized &&  // Only after shapes are loaded
            state.initialActiveCount > 0 &&  // Had shapes to begin with
            state.activeShapes.length === 0) {  // Now empty (completed)
            
            
            // Signal completion to InteractiveLesson after brief delay
            setTimeout(() => {
                if (window.advanceToNextInteraction) {
                    window.advanceToNextInteraction();
                }
            }, 1500); // Allow time to see success message
        }
    }, [state.currentPhase, state.activeShapes.length, state.shapesInitialized, state.initialActiveCount]);

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

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                // Play area resized - may need to reposition shapes
                
                // Future: Recalculate shape positions if pile moves within play-area
                // For now, drag constraints will handle boundaries automatically
            }
        });
        
        resizeObserver.observe(playAreaRef.current);
        
        return () => resizeObserver.disconnect();
    }, []);

    // Initialize shapes after play area is set
    useEffect(() => {
        if (state.pileArea.width > 0 && state.shapes.length === 0) {
            
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
    
    // Removed reactive shape enabling - now handled deterministically in INITIALIZE_SHAPES

    // Help button should advance to next interaction, not manually change phases
    const handleHelpButtonClick = () => {
        // Let the parent component handle interaction advancement
        // This will properly follow the contentData flow
        if (window.advanceToNextInteraction) {
            window.advanceToNextInteraction();
        } else {
            // Fallback: dispatch a custom event that InteractiveLesson can listen to
            window.dispatchEvent(new CustomEvent('advanceInteraction'));
        }
    };

    // Handle shape animation completion for immediate timing
    const handleShapeAnimationComplete = (shapeId, type = 'demo') => {
        
        // Handle bounce completion
        if (type === 'bounce') {
            dispatch({
                type: 'CLEAR_BOUNCE_FLAG',
                shapeId
            });
            return;
        }
        
        // Immediately trigger SHAPE_DROP for demo square
        if (state.currentPhase === GAME_PHASES.MODELING) {
            const animatedShape = state.activeShapes.find(s => s.id === shapeId && s.isAnimating);
            if (animatedShape && animatedShape.type === SHAPE_TYPES.SQUARE) {
                
                // Immediate SHAPE_DROP without delay
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
                }, 300); // Brief delay just for visual confirmation
            }
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
        
        
        // Proper solution: Update position and let Framer Motion handle the transition
        dispatch({
            type: 'BOUNCE_SHAPE',
            shapeId,
            newPosition: validPosition
        });
        
        
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
    
    // Generate safe initial positions for shapes that avoid containers
    const generateSafeShapePositions = (numShapes) => {
        const positions = [];
        const playDimensions = getPlayAreaDimensions();
        const MARGIN = 40;
        const SHAPE_SPACING = 80; // Minimum space between shapes
        const maxShapeAreaHeight = playDimensions.height * 0.6;
        
        // Create a grid pattern for reliable positioning
        const cols = Math.ceil(Math.sqrt(numShapes));
        const rows = Math.ceil(numShapes / cols);
        
        const cellWidth = (playDimensions.width - MARGIN * 2) / cols;
        const cellHeight = (maxShapeAreaHeight - MARGIN * 2) / rows;
        
        let shapeIndex = 0;
        for (let row = 0; row < rows && shapeIndex < numShapes; row++) {
            for (let col = 0; col < cols && shapeIndex < numShapes; col++) {
                const x = MARGIN + col * cellWidth + cellWidth * 0.2; // 20% offset from cell edge
                const y = MARGIN + row * cellHeight + cellHeight * 0.2;
                
                positions.push({ x, y });
                shapeIndex++;
            }
        }
        
        return positions;
    };

    // Shape drag handlers
    const handleShapeDragStart = (shape, event, info) => {
        if (state.disabledShapes.includes(shape.id)) {
            return false;
        }
        
    };

    const handleShapeDragEnd = (shape, event, info) => {
        if (state.disabledShapes.includes(shape.id)) {
            return;
        }
        
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
                // Invalid drop on wrong container - bounce back to shape area
                bounceToRandomPositionInShapeArea(shape.id);
            }
        } else {
            // Not overlapping any container - check bounds using smart boundary detection
            if (shouldBounceFromBoundary(finalX, finalY, shape.type)) {
                // Shape outside hard boundaries - bounce back
                bounceToRandomPositionInShapeArea(shape.id);
            } else if (isWithinPlayAreaBounds(finalX, finalY, shape.type)) {
                // Shape within acceptable bounds - allow drop
                dispatch({
                    type: 'UPDATE_SHAPE_POSITION',
                    shapeId: shape.id,
                    position: { x: finalX, y: finalY }
                });
            } else {
                // Shape in tolerance zone - gently nudge back to safe area
                const playDimensions = getPlayAreaDimensions();
                const shapeDims = getShapeDimensions(shape.type);
                
                const clampedX = Math.max(0, Math.min(finalX, playDimensions.width - shapeDims.width));
                const clampedY = Math.max(0, Math.min(finalY, playDimensions.height - shapeDims.height));
                
                dispatch({
                    type: 'UPDATE_SHAPE_POSITION',
                    shapeId: shape.id,
                    position: { x: clampedX, y: clampedY }
                });
            }
        }
    };

    // SortingBin drop handlers (B1.4)
    const handleShapeDrop = (shapeId, shapeType, targetBin, isValid) => {
        dispatch({ 
            type: 'SHAPE_DROP', 
            shapeId, 
            shapeType, 
            targetBin, 
            isValidDrop: isValid 
        });
        
        if (isValid) {
        } else {
        }
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
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                    onDragEnd={handleShapeDragEnd}
                                    onAnimationComplete={handleShapeAnimationComplete}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                            onShapeDrop={handleShapeDrop}
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
                                        onDragEnd={handleShapeDragEnd}
                                        onAnimationComplete={handleShapeAnimationComplete}
                                        dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
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
                            {/* Show remaining shapes if any */}
                            {state.activeShapes.map(shape => (
                                <GameShape
                                    key={shape.id}
                                    shape={shape}
                                    isDisabled={true}
                                    isHighlighted={false}
                                    onDragStart={handleShapeDragStart}
                                    onDragEnd={handleShapeDragEnd}
                                    dragConstraints={gameContentRef || { left: 20, right: 580, top: 20, bottom: 250 }}
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
                                        onShapeDrop={handleShapeDrop}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case GAME_PHASES.RECAP:
                return (
                    <div className="phase-recap">
                        <div className="play-area" ref={playAreaRef}>
                            {/* Containers positioned at bottom */}
                            <div className="containers-area">
                                {Object.values(SHAPE_TYPES).map(shapeType => (
                                    <SortingBin
                                        key={shapeType}
                                        type={shapeType}
                                        count={state.bins[shapeType].count}
                                        isGlowing={false}
                                        onShapeDrop={handleShapeDrop}
                                    />
                                ))}
                            </div>
                            <div className="implementation-status">
                                <h4>Game Summary:</h4>
                                <ul>
                                    <li>Total Attempts: {state.gameStats.totalAttempts}</li>
                                    <li>Successful Drops: {state.gameStats.successfulDrops || 0}</li>
                                    <li>Shapes Sorted: {Object.values(state.bins).reduce((sum, bin) => sum + bin.count, 0)}</li>
                                    <li>Interventions Used: {state.interventionCount}/{state.maxInterventions}</li>
                                </ul>
                            </div>
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
                                <li>Total attempts: {state.gameStats.totalAttempts}</li>
                            </ul>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="shape-sorter-game" ref={gameAreaRef}>
            <div className="game-header">
                <h3 className="game-title">Shape Factory Sorting</h3>
                <div className="game-stats">
                    <span className="current-phase">Phase: {state.currentPhase}</span>
                    <span className="attempt-counter">Attempts: {state.gameStats.totalAttempts}</span>
                </div>
            </div>
            
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

            {/* Debug panel removed for clean interface */}
        </div>
    );
};

export default ShapeSorterGame;