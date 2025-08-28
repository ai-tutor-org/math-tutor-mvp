import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Material-UI imports
import {
    Typography,
    Box,
    Paper
} from '@mui/material';

// ===================================================================
// CONTENT & DATA IMPORTS
// ===================================================================
import { lessons, presentations } from '../content';

// ===================================================================
// COMPONENT IMPORTS
// ===================================================================
import TTSManager from '../components/layout/TTSManager';
import { AudioControls, TutorAvatar, LessonTopBar } from '../components/lesson';
import MobileRestrictionOverlay from '../components/layout/MobileRestrictionOverlay';
import InteractiveUI from '../components/lesson/InteractiveUI';

// ===================================================================
// CORE ARCHITECTURE IMPORTS (Phase 2B)
// ===================================================================
import { LessonErrorBoundary } from '../core/LessonErrorBoundary';
import { LessonDebugger } from '../core/LessonDebugger';

// ===================================================================
// HOOKS & UTILITIES
// ===================================================================
import { useIsDevMode, useDevModeNavigate } from '../utils/devMode';
import { useMobileDetection } from '../hooks/useMobileDetection';
import { useClickSound } from '../hooks/useClickSound';
import useAnswerSound from '../hooks/useAnswerSound';

// Direct hook imports for React compliance (Phase 2B)
import usePerimeterInput from '../hooks/usePerimeterInput';
import useMeasurementInput from '../hooks/useMeasurementInput';
import useShapeDesignInput from '../hooks/useShapeDesignInput';

// Enhanced Coordinator Pattern (Phase 2B)
import { createLessonCoordinator } from '../coordinators/CoordinatorFactory';
import { LessonHookManager } from '../core/LessonHookManager';
import { getLessonConfig } from '../lessons/LessonRegistry';

// Component registry and utilities
import { componentMap } from '../utils/componentRegistry';
import { shouldAnimationLoop } from '../utils/animationHelpers';

import './InteractiveLesson.css';


const InteractiveLesson = () => {
    const navigate = useDevModeNavigate();
    const location = useLocation();
    const { userName = 'Explorer', lessonId = 'perimeter' } = location.state || {};

    // Developer mode detection
    const isDevMode = useIsDevMode();

    // Mobile detection
    const isMobile = useMobileDetection();

    // Lesson State
    const [currentPresIndex, setCurrentPresIndex] = useState(0);
    const [currentInteractionIndex, setCurrentInteractionIndex] = useState(0);

    // UI State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [dynamicTutorText, setDynamicTutorText] = useState(null); // For answer feedback
    const [activeFeedbackInteraction, setActiveFeedbackInteraction] = useState(null); // For feedback components
    const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction for conditional transitions
    const [isTTSPaused, setIsTTSPaused] = useState(false);

    // Mute State with localStorage persistence
    const [isMuted, setIsMuted] = useState(() => {
        const stored = localStorage.getItem('tts-muted');
        return stored === 'true';
    });

    // TTS Ref for direct control
    const ttsRef = React.useRef();

    // Video Ref for animation control
    const videoRef = React.useRef();

    // Click sound hook
    const playClickSound = useClickSound();
    
    // Answer sound hooks
    const { playCorrectSound, playIncorrectSound } = useAnswerSound();

    // Enhanced Coordinator Pattern - Dynamic Hook Loading (Phase 2B)
    const lessonConfig = useMemo(() => getLessonConfig(lessonId), [lessonId]);
    
    // Call hooks directly at top level - React compliant approach
    const rawPerimeterHook = usePerimeterInput();
    const rawMeasurementHook = useMeasurementInput();
    const rawShapeDesignHook = useShapeDesignInput();
    
    // Build lesson hooks object based on configuration
    const lessonHooks = useMemo(() => {
        const hooks = {};
        
        // Map configured hooks to actual hook instances
        if (lessonConfig?.hooks) {
            lessonConfig.hooks.forEach(hookConfig => {
                switch(hookConfig.name) {
                    case 'usePerimeterInput':
                        if (rawPerimeterHook) hooks[hookConfig.key] = rawPerimeterHook;
                        break;
                    case 'useMeasurementInput':
                        if (rawMeasurementHook) hooks[hookConfig.key] = rawMeasurementHook;
                        break;
                    case 'useShapeDesignInput':
                        if (rawShapeDesignHook) hooks[hookConfig.key] = rawShapeDesignHook;
                        break;
                    default:
                        console.warn(`[InteractiveLesson] Unknown hook: ${hookConfig.name}`);
                }
            });
        }
        
        return hooks;
    }, [lessonConfig, rawPerimeterHook, rawMeasurementHook, rawShapeDesignHook].filter(dep => dep !== undefined));
    
    const hookResetMethods = useMemo(() => 
        LessonHookManager.getResetMethods(lessonHooks), [lessonHooks]);

    // Maintain backward compatibility - extract individual hooks for existing code
    // Safety guards to prevent issues during initial render
    const measurementHook = lessonHooks.measurementHook || {};
    const perimeterHook = lessonHooks.perimeterHook || {};
    const shapeDesignHook = lessonHooks.shapeDesignHook || {};

    // TTS Pause/Resume handler
    const handleTTSPauseResume = useCallback(() => {
        playClickSound();

        // Only allow pause/resume while speaking or already paused
        if (!isSpeaking && !isTTSPaused) {
            return;
        }

        if (ttsRef.current) {
            if (isTTSPaused) {
                ttsRef.current.resumeTTS();
                setIsTTSPaused(false);
            } else {
                ttsRef.current.pauseTTS();
                setIsTTSPaused(true);
            }
        }
    }, [isTTSPaused, isSpeaking, playClickSound]);

    // Mute/Unmute handler
    const handleMuteToggle = useCallback(() => {
        playClickSound();
        setIsMuted(prev => {
            const newState = !prev;
            localStorage.setItem('tts-muted', newState.toString());
            return newState;
        });
    }, [playClickSound]);


    // Data from contentData.js
    const lesson = useMemo(() => lessons[lessonId], [lessonId]);
    const presentationId = useMemo(() => {
        return lesson.sequence[currentPresIndex]?.presentationId;
    }, [lesson, currentPresIndex]);
    const presentation = useMemo(() => {
        return presentations[presentationId];
    }, [presentationId]);
    const interaction = useMemo(() => presentation?.interactions[currentInteractionIndex], [presentation, currentInteractionIndex]);

    // Helper function to get feedback text from contentData
    const getFeedbackText = useCallback((feedbackInteractionId) => {
        // First check current presentation's feedbackRegistry
        if (presentation?.feedbackRegistry?.[feedbackInteractionId]) {
            return presentation.feedbackRegistry[feedbackInteractionId].tutorText;
        }

        return null;
    }, [presentation]);

    // Helper function to get full feedback interaction data including ContentComponent
    const getFeedbackInteraction = useCallback((feedbackInteractionId) => {
        // First check current presentation's feedbackRegistry
        if (presentation?.feedbackRegistry?.[feedbackInteractionId]) {
            return presentation.feedbackRegistry[feedbackInteractionId];
        }
        return null;
    }, [presentation]);

    const advanceToNext = useCallback(() => {
        setAnimationTrigger(false); // Reset trigger for the next interaction
        setDynamicTutorText(null); // Clear any lingering feedback text
        setActiveFeedbackInteraction(null); // Clear any feedback component
        setShowNextButton(false); // Reset button immediately to prevent flash
        setIsSpeaking(true);

        if (!presentation || !lesson) return;

        const nextInteractionIndex = currentInteractionIndex + 1;
        if (nextInteractionIndex < presentation.interactions.length) {
            setCurrentInteractionIndex(nextInteractionIndex);
        } else {
            const nextPresIndex = currentPresIndex + 1;
            if (nextPresIndex < lesson.sequence.length) {
                setCurrentPresIndex(nextPresIndex);
                setCurrentInteractionIndex(0);
            } else {
                navigate('/'); // Navigate home
            }
        }
    }, [currentInteractionIndex, currentPresIndex, presentation, lesson, navigate]);

    const navigateToInteraction = useCallback((interactionId) => {
        // Find the presentation containing this interaction
        for (const [presId, pres] of Object.entries(presentations)) {
            const interactionIndex = pres.interactions.findIndex(int => int.id === interactionId);
            if (interactionIndex !== -1) {

                // For normal presentations in the lesson sequence
                const lessonSeqIndex = lesson.sequence.findIndex(seq => seq.presentationId === presId);
                if (lessonSeqIndex !== -1) {
                    setCurrentPresIndex(lessonSeqIndex);
                    setCurrentInteractionIndex(interactionIndex);
                    setDynamicTutorText(null);
                    setShowNextButton(false); // Reset button immediately
                    setIsSpeaking(true);
                    return;
                }
            }
        }
        // Interaction not found - silently fail
    }, [lesson]);


    // Developer mode handlers
    const handleDevInteractionSelect = useCallback((interaction) => {

        // Stop any running TTS immediately
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        // Stop the current TTS manager instance
        if (ttsRef.current && ttsRef.current.stopTTS) {
            ttsRef.current.stopTTS();
        }

        // Clear all interaction state immediately
        setIsSpeaking(false);
        setIsWaving(false);
        setShowNextButton(false);
        setDynamicTutorText(null);
        setAnimationTrigger(false);
        setHasUserInteracted(false);
        setActiveFeedbackInteraction(null);

        // Reset input states using centralized hook manager (Phase 2B)
        hookResetMethods.resetAllStates();

        // Navigate to regular sequence presentation
        setCurrentPresIndex(interaction.presIndex);
        setCurrentInteractionIndex(interaction.interactionIndex);
    }, []);

    const handleDevResetLesson = useCallback(() => {
        setCurrentPresIndex(0);
        setCurrentInteractionIndex(0);
                setDynamicTutorText(null);
        setShowNextButton(false);
        setAnimationTrigger(false);
        setHasUserInteracted(false);
    }, []);

    // Handle user interaction for conditional transitions
    const handleUserInteraction = useCallback(() => {
        setHasUserInteracted(true);

        // If this is a conditional transition, handle the wait time and button appearance
        if (interaction?.transitionType === 'conditional' && interaction?.condition === 'hasInteracted') {
            const waitTime = interaction?.waitTime || 3000; // Default 3 seconds
            setTimeout(() => {
                setShowNextButton(true);
            }, waitTime);
        }
    }, [interaction]);

    const handleAnswer = (answerData) => {
        // Play appropriate sound based on answer correctness
        if (answerData.isCorrect) {
            playCorrectSound();
        } else {
            playIncorrectSound();
        }
        
        console.log('Answer selected:', answerData);
        console.log('Current interaction ID:', interaction?.id);
        console.log('Answer is correct:', answerData.isCorrect);

        // Enhanced Coordinator Pattern - delegate to coordinator (Phase 2B)
        const result = lessonCoordinator.handleAnswer(answerData, interaction, coordinatorContext);
        
        // Process coordinator response
        if (result?.action === 'advance') {
            advanceToNext();
        } else if (result?.action === 'wait-for-tts') {
            // Let TTS completion handle next steps
            return;
        } else if (result?.action === 'handled') {
            // Coordinator handled everything
            return;
        }
        
        // Fallback: if no specific action, maintain original behavior for unknown cases
        // This preserves backward compatibility during transition
    };

    const handleHighlightComplete = () => {
        setShowNextButton(true);
    };

    // ===================================================================
    // ENHANCED COORDINATOR ARCHITECTURE (Phase 2B)
    // ===================================================================

    // Create lesson coordinator using factory pattern - replaces hardcoded LessonCoordinator
    const lessonCoordinator = useMemo(() => createLessonCoordinator(lessonId), [lessonId]);

    // Create coordinator context (same data as before, just bundled) - MOVED HERE
    const coordinatorContext = useMemo(() => ({
        getFeedbackText,
        getFeedbackInteraction,
        setDynamicTutorText,
        setActiveFeedbackInteraction,
        setShowNextButton,
        handleAnswer,
        handleHighlightComplete,
        playClickSound
    }), [getFeedbackText, getFeedbackInteraction, setDynamicTutorText, 
         setActiveFeedbackInteraction, setShowNextButton, handleAnswer, 
         handleHighlightComplete, playClickSound]);

    // Now we can safely define callbacks that use lessonCoordinator
    const handlePerimeterCheck = useCallback(() => {
        // Validate answer immediately to determine which sound to play
        const userAnswer = parseInt(perimeterHook.perimeterInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const isCorrect = userAnswer === correctAnswer;
        
        // Play appropriate sound immediately
        if (isCorrect) {
            playCorrectSound();
        } else {
            playIncorrectSound();
        }
        
        lessonCoordinator.dispatch('onPerimeterCheck', {
            hook: perimeterHook,
            interaction,
            context: coordinatorContext
        });
    }, [lessonCoordinator, perimeterHook, interaction, coordinatorContext, playClickSound]);

    // Shape sorting game intervention callbacks
    const handleShapeHint = useCallback((shapeType) => {
        lessonCoordinator.dispatch('onShapeHint', {
            shapeType,
            context: coordinatorContext
        });
    }, [lessonCoordinator, coordinatorContext]);

    const handleShapeAutoHelp = useCallback((shapeType) => {
        lessonCoordinator.dispatch('onShapeAutoHelp', {
            shapeType,
            context: coordinatorContext
        });
    }, [lessonCoordinator, coordinatorContext]);

    const handleShapeCorrection = useCallback((shapeType) => {
        lessonCoordinator.dispatch('onShapeCorrection', {
            shapeType,
            context: coordinatorContext
        });
    }, [lessonCoordinator, coordinatorContext]);

    const handleShapeDesignCheck = useCallback(() => {
        playClickSound();
        lessonCoordinator.dispatch('onShapeDesignCheck', {
            hook: shapeDesignHook,
            interaction,
            context: coordinatorContext
        });
    }, [lessonCoordinator, shapeDesignHook, interaction, coordinatorContext, playClickSound]);

    const handleMeasurementCheck = useCallback(() => {
        // Validate answer immediately to determine which sound to play
        const userAnswer = parseFloat(measurementHook.measurementInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const isCorrect = userAnswer === correctAnswer;
        
        
        // Play appropriate sound immediately
        if (isCorrect) {
            playCorrectSound();
        } else {
            playIncorrectSound();
        }
        
        lessonCoordinator.dispatch('onMeasurementCheck', {
            hook: measurementHook,
            interaction,
            context: coordinatorContext
        });
    }, [lessonCoordinator, measurementHook, interaction, coordinatorContext, playClickSound]);

    const handleAnimationComplete = useCallback(() => {
        // Special handling for demo animation completion
        if (interaction?.id === 'shape-demo-modeling') {
            setShowNextButton(true); // Show button instead of auto-advance
            return;
        }

        if (interaction?.transitionType === 'manual' && interaction.showNextButton) {
            setShowNextButton(true);
        } else {
            advanceToNext();
        }
    }, [interaction, advanceToNext]);

    // Handle Done button to go home
    const handleDoneButton = () => {
        playClickSound();
        if (interaction?.nextButtonText === "Done") {
            navigate('/');
        } else if (interaction?.navigateToInteraction) {
            // Handle special navigation to specific interaction
            navigateToInteraction(interaction.navigateToInteraction);
        } else if (interaction?.navigateToPresentation) {
            // Handle special navigation (like from 5C to standard-units-intro)
            const targetPresIndex = lesson.sequence.findIndex(seq => seq.presentationId === interaction.navigateToPresentation);
            if (targetPresIndex !== -1) {
                setCurrentPresIndex(targetPresIndex);
                setCurrentInteractionIndex(0);
                setDynamicTutorText(null);
            } else {
                advanceToNext();
            }
        } else {
            advanceToNext();
        }
    };

    // Initialize lesson debugger - development only (Phase 1C)
    const lessonDebugger = useMemo(() => 
        new LessonDebugger(lessonId, lessonCoordinator)
    , [lessonId, lessonCoordinator]);

    // Track previous interaction for debug logging
    const previousInteractionRef = React.useRef(null);

    // Set context on coordinator
    useEffect(() => {
        lessonCoordinator.setContext(coordinatorContext);
    }, [lessonCoordinator, coordinatorContext]);

    // Effect to handle layout changes and initial setup
    useEffect(() => {
        // Debug logging for interaction changes
        lessonDebugger.logInteractionChange(interaction, previousInteractionRef.current);
        previousInteractionRef.current = interaction;

        // All interactions should start with button hidden and wait for TTS to finish
        setShowNextButton(false);

        // Reset animation trigger to prevent flicker
        setAnimationTrigger(false);

        // Reset dynamic tutor text when interaction changes
        setDynamicTutorText(null);

        // Reset input states when interaction changes (Phase 2B)
        hookResetMethods.resetAllStates();

        // Reset video loop state for new interactions
        if (videoRef.current && interaction?.tutorAnimation && shouldAnimationLoop(interaction.tutorAnimation)) {
            videoRef.current.loop = true;
        }
    }, [interaction, lessonDebugger]);

    // TTS Callbacks
    const handleTTSEnd = useCallback(() => {
        setIsSpeaking(false);
        setIsWaving(false);
        setIsTTSPaused(false);

        // Stop looping animations when TTS ends (but allow one-time animations to complete)
        if (videoRef.current && interaction?.tutorAnimation && shouldAnimationLoop(interaction.tutorAnimation)) {
            videoRef.current.loop = false;
        }

        // Check if this might be a post-animation TTS completion during interaction-based flow
        if (interaction?.transitionType === 'interaction-based' && window.notifyPostAnimationTTSComplete) {

            // Try to notify the component - it will check if it's actually waiting
            window.notifyPostAnimationTTSComplete();

            // Clear any feedback state
            if (activeFeedbackInteraction) {
                setActiveFeedbackInteraction(null);
                setDynamicTutorText(null);
            }

            return; // Don't advance - let the main interaction control flow
        }

        // Use feedback interaction properties when active, otherwise use main interaction
        const currentInteraction = activeFeedbackInteraction || interaction;

        // This should ONLY trigger for animations that start immediately after speech.
        const shouldAutoAnimate = lessonCoordinator.shouldAutoAnimate(interaction);

        // Special handling for demo animation - don't trigger here, let component handle internally
        if (interaction?.id === 'shape-demo-modeling') {
            return; // Don't trigger animation here - component will handle it internally
        }

        if (currentInteraction?.transitionType === 'auto') {
            // Check if there's a specific navigation target
            if (currentInteraction?.navigateToInteraction) {
                setTimeout(() => navigateToInteraction(currentInteraction.navigateToInteraction), 500);
            } else {
                setTimeout(advanceToNext, 500);
            }
        } else if (interaction?.transitionType === 'interaction-based') {
            // Wait for component to signal completion - don't auto-advance
            return;
        } else if (interaction?.type === 'welcome') {
            setTimeout(() => setShowNextButton(true), 500);
        } else if (shouldAutoAnimate) {
            // Specifically trigger footsteps, meter stick, or ruler animation after speech
            setAnimationTrigger(true);
        } else if (currentInteraction?.showNextButton) {
            // For all other manual transitions, just show the button.
            setShowNextButton(true);
        }
    }, [interaction, activeFeedbackInteraction, advanceToNext, navigateToInteraction]);

    const handleTTSStart = useCallback(() => {
        setIsSpeaking(true);
        if (interaction?.type === 'welcome') {
            setIsWaving(true);
        }
    }, [interaction]);

    // Listen for custom advancement events from components like ShapeSorterGame
    useEffect(() => {
        const handleAdvanceInteraction = () => {
            advanceToNext();
        };

        window.addEventListener('advanceInteraction', handleAdvanceInteraction);

        // Also expose advanceToNext globally for components to use
        window.advanceToNextInteraction = advanceToNext;

        return () => {
            window.removeEventListener('advanceInteraction', handleAdvanceInteraction);
            delete window.advanceToNextInteraction;
        };
    }, [advanceToNext]);

    const tutorText = dynamicTutorText || (interaction?.tutorText.replace('{userName}', userName) ?? '');

    // Effect to cancel speech on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount


    // Render Content Component
    function renderContent() {
        if (!interaction) return null;

        // Check if there's an active feedback interaction with a ContentComponent
        if (activeFeedbackInteraction?.ContentComponent) {
            const FeedbackComponent = activeFeedbackInteraction.ContentComponent;
            const feedbackProps = {
                key: `feedback-${activeFeedbackInteraction.id}`,
                ...activeFeedbackInteraction.contentProps,
                onAnimationComplete: handleAnimationComplete,
                startAnimation: animationTrigger,
                onAnswer: handleAnswer,
                showSideHighlighting: perimeterHook.showSideHighlighting,
                onHighlightComplete: handleHighlightComplete,
            };
            return <FeedbackComponent {...feedbackProps} />;
        }

        // Otherwise, render the normal interaction component
        // Prioritize the ContentComponent defined directly in the interaction data
        const Component = interaction.ContentComponent || componentMap[interaction.type];

        if (!Component) return null;

        // Generate stable key for same component to prevent unnecessary re-mounting
        const componentName = Component.name || Component.displayName || 'Component';

        // Special case: ShapeSorterGame needs unique keys per interaction for phase changes
        // All other components benefit from stable keys to prevent flickering
        const componentKey = componentName === 'ShapeSorterGame'
            ? (() => {
                // Special handling for recap sequences to prevent unnecessary remounting
                // All recap interactions use the same phase but different highlighting props
                if (presentationId === 'shape-sorting-factory' &&
                    interaction.id.startsWith('shape-recap')) {
                    return `${componentName}-${currentPresIndex}-recap`;
                }
                // Default behavior for all other ShapeSorterGame interactions
                return `${componentName}-${currentPresIndex}-${currentInteractionIndex}`;
            })()
            : `${componentName}-${currentPresIndex}`;

        // Build base props
        const baseProps = {
            key: componentKey,
            onAnimationComplete: handleAnimationComplete,
            startAnimation: animationTrigger,
            onInteraction: handleUserInteraction,
            // Pass the onAnswer handler to any component that might need it
            onAnswer: handleAnswer,
            onHighlightComplete: handleHighlightComplete,
        };

        // Let coordinator customize props with lesson-specific logic (Phase 2B)
        const props = lessonCoordinator.getComponentProps(interaction, baseProps, lessonHooks);

        return <Component {...props} />;
    }

    return (
        <div>
            <div className="lesson-content">
                <Box className="lesson-main-container">
            <TTSManager
                ref={ttsRef}
                text={tutorText}
                onStart={handleTTSStart}
                onEnd={handleTTSEnd}
                isDevMode={isDevMode}
                isMobile={isMobile}
                isMuted={isMuted}
            />

            {/* Top Menu Bar */}
            <LessonTopBar
                lessonTitle={lesson?.title || 'Perimeter'}
                lessonId={lessonId}
                isDevMode={isDevMode}
                currentPresIndex={currentPresIndex}
                currentInteractionIndex={currentInteractionIndex}
                onInteractionSelect={handleDevInteractionSelect}
                onResetLesson={handleDevResetLesson}
                onHomeClick={() => navigate('/')}
                onBackClick={() => navigate(-1)}
            />

            {/* Main Content Area - Wrapped in Error Boundary */}
            <LessonErrorBoundary onReturnHome={() => navigate('/')}>
                <Box className="lesson-content-area">
                {/* Left Panel - Tutor (26%) */}
                <Box className="lesson-left-panel">
                    {/* Audio Controls */}
                    <AudioControls
                        isMuted={isMuted}
                        isTTSPaused={isTTSPaused}
                        isSpeaking={isSpeaking}
                        onMuteToggle={handleMuteToggle}
                        onTTSPauseResume={handleTTSPauseResume}
                    />

                    {/* Tutor Avatar */}
                    <TutorAvatar
                        animation={interaction?.tutorAnimation}
                        isWaving={isWaving}
                        videoRef={videoRef}
                    />

                    {/* Tutor Speech */}
                    <Box className="lesson-mb-3">
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#fff',
                                lineHeight: 1.6,
                                fontSize: '1rem',
                                textAlign: 'left',
                                maxWidth: '100%',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-line',
                                fontFamily: "'Fustat', 'Inter', sans-serif",
                                fontWeight: 500
                            }}
                        >
                            {tutorText}
                        </Typography>
                    </Box>

                    {/* Interactive UI Components */}
                    <InteractiveUI
                        interaction={interaction}
                        activeFeedbackInteraction={activeFeedbackInteraction}
                        isSpeaking={isSpeaking}
                        showNextButton={showNextButton}
                        lessonHooks={lessonHooks}
                        handlers={{
                            onPerimeterCheck: handlePerimeterCheck,
                            onShapeDesignCheck: handleShapeDesignCheck,
                            onMeasurementCheck: handleMeasurementCheck,
                            onAnswer: handleAnswer,
                            onDoneButton: handleDoneButton
                        }}
                    />
                </Box>

                {/* Right Panel - Container (74%) */}
                <Box className="lesson-right-panel">
                    {/* Content Playground */}
                    <Paper
                        sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: '#1B1B1B',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                        elevation={0}
                    >
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    </Paper>
                </Box>
            </Box>
            </LessonErrorBoundary>
                </Box>
            </div>
            {isMobile && <MobileRestrictionOverlay />}
        </div>
    );
};

export default InteractiveLesson;
