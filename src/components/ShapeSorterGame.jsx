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
        [SHAPE_TYPES.TRIANGLE]: { shapes: [], count: 0, isGlowing: false, isHovered: false },
        [SHAPE_TYPES.CIRCLE]: { shapes: [], count: 0, isGlowing: false, isHovered: false },
        [SHAPE_TYPES.RECTANGLE]: { shapes: [], count: 0, isGlowing: false, isHovered: false },
        [SHAPE_TYPES.SQUARE]: { shapes: [], count: 0, isGlowing: false, isHovered: false }
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

        case 'SET_BIN_HOVER':
            return {
                ...state,
                bins: {
                    ...state.bins,
                    [action.binType]: {
                        ...state.bins[action.binType],
                        isHovered: action.isHovered
                    }
                }
            };

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
    console.log('🎯 ShapeSorterGame rendered with contentProps:', contentProps, 'startAnimation:', startAnimation);
    
    // Calculate initial state based on props (like other components)
    const initialGameState = useMemo(() => {
        const { phaseConfig } = contentProps;
        const phase = phaseConfig?.initialPhase || GAME_PHASES.INTRO;
        
        console.log('🎯 Calculating initial state from props - phase:', phase);
        
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
    
    // Function removed - no longer needed with unified play area

    // Demonstration logic for MODELING phase - triggered by phase initialization
    useEffect(() => {
        if (state.currentPhase === GAME_PHASES.MODELING && 
            state.activeShapes.length > 0 && 
            state.shapesInitialized &&
            !state.demoStarted) { // Only run once
            
            console.log('🎯 Starting demonstration after TTS completion');
            
            // Mark demo as started to prevent re-execution
            dispatch({ type: 'START_DEMO' });
            
            // Find a square to demonstrate with
            const squareToDemo = state.activeShapes.find(shape => shape.type === SHAPE_TYPES.SQUARE);
            
            if (squareToDemo) {
                // Start demonstration immediately after TTS
                console.log('🎯 Demonstrating square sort:', squareToDemo.id);
                
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
                    // Calculate target position relative to play area (unified coordinate system)
                    const containerElement = document.querySelector(`[data-container-type="${SHAPE_TYPES.SQUARE}"]`);
                    const playArea = playAreaRef.current;
                    let targetPosition = { x: 200, y: 350 }; // fallback position in play area
                    
                    if (containerElement && playArea) {
                        const containerRect = containerElement.getBoundingClientRect();
                        const playAreaRect = playArea.getBoundingClientRect();
                        
                        // Calculate position relative to play area (unified coordinate system)
                        targetPosition = {
                            x: containerRect.left + containerRect.width/2 - playAreaRect.left - 30, // Center of container minus shape half-width
                            y: containerRect.top + containerRect.height/2 - playAreaRect.top - 30   // Center of container minus shape half-height
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
            
            console.log('🎯 GUIDED phase completed - triangle sorted successfully');
            console.log('🎯 Initial active count:', state.initialActiveCount, 'Current active:', state.activeShapes.length);
            
            // Signal completion to InteractiveLesson after brief delay
            setTimeout(() => {
                if (window.advanceToNextInteraction) {
                    window.advanceToNextInteraction();
                }
            }, 1500); // Allow time to see success message
        }
    }, [state.currentPhase, state.activeShapes.length, state.shapesInitialized, state.initialActiveCount]);

    // Initialize play area dimensions on mount
    useLayoutEffect(() => {
        if (!playAreaRef.current || !gameContentRef.current) return;
        
        const playRect = playAreaRef.current.getBoundingClientRect();
        const contentRect = gameContentRef.current.getBoundingClientRect();
        
        console.log('🎯 Area setup - Play:', playRect.height, 'Content:', contentRect.height);
        
        const playArea = { 
            width: Math.round(playRect.width), 
            height: Math.round(playRect.height) 
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
            console.log('🎯 Initializing shapes with play area:', state.pileArea);
            
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
            
            console.log(`🎯 Generated ${positionedShapes.length} shapes for the Shape Factory!`);
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
    const handleShapeAnimationComplete = (shapeId) => {
        console.log('🎯 Shape animation completed:', shapeId);
        
        // Immediately trigger SHAPE_DROP for demo square
        if (state.currentPhase === GAME_PHASES.MODELING) {
            const animatedShape = state.activeShapes.find(s => s.id === shapeId && s.isAnimating);
            if (animatedShape && animatedShape.type === SHAPE_TYPES.SQUARE) {
                console.log('🎯 Demo square reached container, triggering immediate drop');
                
                // Immediate SHAPE_DROP without delay
                dispatch({
                    type: 'SHAPE_DROP',
                    shapeId: shapeId,
                    shapeType: SHAPE_TYPES.SQUARE,
                    targetBin: SHAPE_TYPES.SQUARE,
                    isValidDrop: true
                });
                
                console.log('🎯 Demo completed: Square sorted to squares container');
                
                // Trigger parent callback after brief moment for visual feedback
                setTimeout(() => {
                    if (onAnimationComplete) {
                        console.log('🎯 Demo animation completed, notifying parent');
                        onAnimationComplete();
                    }
                }, 300); // Brief delay just for visual confirmation
            }
        }
    };

    // Function removed - no longer needed without pile constraints

    // Bounce shape back to random position in shape area (avoiding containers at bottom)
    const bounceToRandomPositionInShapeArea = (shapeId) => {
        if (!playAreaRef.current) return;
        
        const playAreaRect = playAreaRef.current.getBoundingClientRect();
        
        // Generate random position in upper 60% of play-area only (clear separation from containers)
        const maxShapeAreaHeight = playAreaRect.height * 0.6; // Only upper 60% for shapes
        const randomX = 40 + Math.random() * (playAreaRect.width - 100);  // 40px margin, 60px shape width
        const randomY = 40 + Math.random() * (maxShapeAreaHeight - 100);  // Upper area only
        
        dispatch({
            type: 'UPDATE_SHAPE_POSITION',
            shapeId,
            position: { x: randomX, y: randomY }
        });
        
        console.log(`🎯 Bounced shape ${shapeId} back to shape area at (${randomX}, ${randomY})`);
    };

    // Centralized coordinate utilities for unified system
    const getPlayAreaCoords = (screenX, screenY) => {
        if (!playAreaRef.current) return { x: 0, y: 0 };
        const playAreaRect = playAreaRef.current.getBoundingClientRect();
        return {
            x: screenX - playAreaRect.left,
            y: screenY - playAreaRect.top
        };
    };

    const isWithinPlayArea = (playX, playY) => {
        if (!playAreaRef.current) return false;
        const playAreaRect = playAreaRef.current.getBoundingClientRect();
        return playX >= 20 && playX <= (playAreaRect.width - 80) && 
               playY >= 20 && playY <= (playAreaRect.height - 40);
    };

    const isWithinContainer = (playX, playY, containerType) => {
        const containers = document.querySelectorAll(`[data-container-type="${containerType}"]`);
        if (containers.length === 0) return false;
        
        const container = containers[0];
        const containerRect = container.getBoundingClientRect();
        const playAreaRect = playAreaRef.current?.getBoundingClientRect();
        
        if (!playAreaRect) return false;
        
        // Convert container bounds to play-area coordinates
        const containerPlayX1 = containerRect.left - playAreaRect.left;
        const containerPlayY1 = containerRect.top - playAreaRect.top;
        const containerPlayX2 = containerRect.right - playAreaRect.left;
        const containerPlayY2 = containerRect.bottom - playAreaRect.top;
        
        return playX >= containerPlayX1 && playX <= containerPlayX2 &&
               playY >= containerPlayY1 && playY <= containerPlayY2;
    };

    // Shape drag handlers
    const handleShapeDragStart = (shape, event, info) => {
        if (state.disabledShapes.includes(shape.id)) {
            return false;
        }
        
        console.log('🎯 Drag start:', shape.type, shape.id);
    };

    const handleShapeDragEnd = (shape, event, info) => {
        if (state.disabledShapes.includes(shape.id)) {
            return;
        }
        
        const dropX = info.point.x;
        const dropY = info.point.y;
        
        // Get final position from Framer Motion (play-area coordinates)
        const finalX = info.offset.x + (shape.position?.x || 0);
        const finalY = info.offset.y + (shape.position?.y || 0);
        
        console.log('🎯 Drag end:', shape.type);
        console.log('🎯 Screen coords:', dropX, dropY);
        console.log('🎯 Final position:', finalX, finalY);
        console.log('🎯 Original position:', shape.position?.x, shape.position?.y);
        
        // Check if shape is dropped on a sorting container
        let droppedOnContainer = false;
        const containers = document.querySelectorAll('[data-container-type]');
        
        // Convert final position to screen coordinates for consistent container detection
        const playAreaRect = playAreaRef.current?.getBoundingClientRect();
        if (playAreaRect) {
            const shapeScreenX = playAreaRect.left + finalX;
            const shapeScreenY = playAreaRect.top + finalY;
            
            console.log('🎯 Shape screen position:', shapeScreenX, shapeScreenY);
            
            containers.forEach(container => {
                const containerRect = container.getBoundingClientRect();
                
                console.log('🎯 Container bounds:', containerRect.left, containerRect.top, containerRect.right, containerRect.bottom);
                
                // Check if shape's final position overlaps with container (consistent screen coordinates)
                if (shapeScreenX >= containerRect.left && shapeScreenX <= containerRect.right &&
                    shapeScreenY >= containerRect.top && shapeScreenY <= containerRect.bottom) {
                    
                    const containerType = container.getAttribute('data-container-type');
                    const isValid = containerType === shape.type;
                    
                    console.log(`🎯 Shape ${shape.type} dropped on ${containerType} container - Valid: ${isValid}`);
                    
                    if (isValid) {
                        // Valid drop - move to container
                        dispatch({
                            type: 'SHAPE_DROP',
                            shapeId: shape.id,
                            shapeType: shape.type,
                            targetBin: containerType,
                            isValidDrop: true
                        });
                        droppedOnContainer = true;
                    } else {
                        // Invalid drop on wrong container - bounce back to shape area
                        bounceToRandomPositionInShapeArea(shape.id);
                        droppedOnContainer = true;
                        console.log(`🎯 Wrong container - bouncing back`);
                    }
                }
            });
        }
        
        // If not dropped on any container, allow shape to stay where dropped
        if (!droppedOnContainer) {
            const playAreaRect = playAreaRef.current?.getBoundingClientRect();
            
            if (playAreaRect) {
                // Only bounce back if completely outside play area bounds
                if (finalX < 20 || finalX > (playAreaRect.width - 80) || finalY < 20 || finalY > (playAreaRect.height - 40)) {
                    // Shape outside play area bounds - bounce back to shape area
                    bounceToRandomPositionInShapeArea(shape.id);
                    console.log(`🎯 Shape bounced back - outside play area bounds`);
                } else {
                    // Update position to final drag position (anywhere within play area is valid)
                    dispatch({
                        type: 'UPDATE_SHAPE_POSITION',
                        shapeId: shape.id,
                        position: { x: finalX, y: finalY }
                    });
                    console.log(`🎯 Shape dropped in empty space at (${finalX}, ${finalY}) - staying there`);
                }
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
            console.log(`🎯 Great! ${shapeType} sorted correctly!`);
        } else {
            console.log(`🎯 Oops! ${shapeType} belongs in a different container.`);
        }
    };

    const handleBinDragOver = (binType) => {
        dispatch({ type: 'SET_BIN_HOVER', binType, isHovered: true });
    };

    const handleBinDragLeave = (binType) => {
        dispatch({ type: 'SET_BIN_HOVER', binType, isHovered: false });
    };

    // Render current phase content
    const renderPhaseContent = () => {
        console.log('🎯 Rendering phase:', state.currentPhase, 'activeShapes:', state.activeShapes.length, 'showContainers:', state.showContainers);
        
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
                                            isHovered={state.bins[shapeType].isHovered}
                                            onShapeDrop={handleShapeDrop}
                                            onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={state.bins[shapeType].isHovered}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={false}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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
                                        isHovered={false}
                                        onShapeDrop={handleShapeDrop}
                                        onDragOver={handleBinDragOver}
                                        onDragLeave={handleBinDragLeave}
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