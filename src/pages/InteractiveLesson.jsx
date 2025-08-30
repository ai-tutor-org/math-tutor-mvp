import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Material-UI imports
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Button,
    Paper,
    TextField
} from '@mui/material';
import {
    Home as HomeIcon,
    Settings as SettingsIcon,
    ArrowBack as ArrowBackIcon,
    VolumeOff as VolumeOffIcon,
    VolumeUp as VolumeUpIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon
} from '@mui/icons-material';

import { lessons, presentations } from '../content'; // Import centralized data

import TTSManager from '../components/layout/TTSManager';
import DeveloperMenu from '../components/dev/DeveloperMenu';
import { useIsDevMode, useDevModeNavigate } from '../utils/devMode';
import { useMobileDetection } from '../hooks/useMobileDetection';
import MobileRestrictionOverlay from '../components/layout/MobileRestrictionOverlay';
import { useClickSound } from '../hooks/useClickSound';
import useAnswerSound from '../hooks/useAnswerSound';

// Custom hooks
import usePerimeterInput from '../hooks/usePerimeterInput';
import useShapeDesignInput from '../hooks/useShapeDesignInput';
import useMeasurementInput from '../hooks/useMeasurementInput';

// Import all possible content components
import RoomIllustration from '../components/presentations/01-introduction/RoomIllustration';
import ConflictingMeasurements from '../components/presentations/01-introduction/ConflictingMeasurements';
import StandardUnits from '../components/presentations/01-introduction/StandardUnits';
import RulerMeasurement from '../components/presentations/01-introduction/RulerMeasurement';
import MeterStick from '../components/presentations/01-introduction/MeterStick';
import ShapeSorterGame from '../components/presentations/03-shape-sorting/ShapeSorterGame';
import MissionReadiness from '../components/presentations/04-farmer-missions/MissionReadiness';
import FarmerIntro from '../components/presentations/04-farmer-missions/FarmerIntro';
import FoxThreat from '../components/presentations/04-farmer-missions/FoxThreat';
import FarmMap from '../components/presentations/04-farmer-missions/FarmMap';
import PerimeterDefinition from '../components/presentations/04-farmer-missions/PerimeterDefinition';
import RectangleSolution from '../components/presentations/04-farmer-missions/RectangleSolution';
import ShapeDesigner from '../components/presentations/05-shape-designer/ShapeDesigner';
import MeasurementInput from '../components/common/MeasurementInput';
import PrimaryButton from '../components/common/PrimaryButton';

import './InteractiveLesson.css';

const componentMap = {
    'room-question': RoomIllustration,
    'footsteps-animation': RoomIllustration,
    'footsteps-animation-friend': RoomIllustration,
    'conflicting-measurements': RoomIllustration,
    'standard-units-explanation': StandardUnits,
    'ruler-measurement': RulerMeasurement,
    'meter-measurement': MeterStick,
    'multiple-choice-question': RoomIllustration,
    'tutor-monologue': RoomIllustration,
    'shape-sorting-game': ShapeSorterGame,
    'mission-readiness': MissionReadiness,
    'farmer-intro': FarmerIntro,
    'fox-threat': FoxThreat,
    'farm-map': FarmMap,
    'perimeter-definition': PerimeterDefinition,
    'perimeter-input': FarmMap,
    'rectangle-solution': RectangleSolution,
    'shape-designer': ShapeDesigner
};

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
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [dynamicTutorText, setDynamicTutorText] = useState(null); // For answer feedback
    const [activeFeedbackInteraction, setActiveFeedbackInteraction] = useState(null); // For feedback components
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

    // Custom hooks for input management
    const measurementHook = useMeasurementInput();
    const perimeterHook = usePerimeterInput();
    const shapeDesignHook = useShapeDesignInput();

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

    // Define which animations should loop vs play once
    const shouldAnimationLoop = (animationName) => {
        const oneTimeAnimations = [
            'waving',
            'happy-applauding', 
            'on-completion-confetti-happy'
        ];
        return !oneTimeAnimations.includes(animationName);
    };

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
                console.log("End of lesson.");
                navigate('/'); // Navigate home
            }
        }
    }, [currentInteractionIndex, currentPresIndex, presentation, lesson, navigate]);



    // Developer mode handlers
    const handleDevInteractionSelect = useCallback((interaction) => {
        console.log('Dev navigation to:', interaction);

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
        setShowNextButton(false);
        setDynamicTutorText(null);
        setAnimationTrigger(false);
        setActiveFeedbackInteraction(null);
        
        // Reset input states using hooks
        measurementHook.resetMeasurementState();
        perimeterHook.resetPerimeterState();
        shapeDesignHook.resetShapeDesignState();

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
    }, []);

    // Handle user interaction for conditional transitions
    const handleUserInteraction = useCallback(() => {
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


        // Handle multiple choice questions with feedbackId
        if (interaction?.type === 'multiple-choice-question' && answerData.feedbackId) {
            const feedbackInteraction = getFeedbackInteraction(answerData.feedbackId);
            if (feedbackInteraction) {
                setDynamicTutorText(feedbackInteraction.tutorText);
                setActiveFeedbackInteraction(feedbackInteraction);
                
                if (feedbackInteraction.type === 'multiple-choice-question') {
                    // For retry questions, don't show next button - let user answer again
                    return;
                }
                // Let TTS completion handle showing the next button
            }
            return;
        }


        // Handle shape measurement interactions
        if (interaction?.type === 'shape-measurement') {
            if (answerData.isCorrect) {
                // Show success feedback for all measurements (including the last one)
                const feedbackText = getFeedbackText('shape-correct');
                if (feedbackText) {
                    setDynamicTutorText(feedbackText);
                }
                setShowNextButton(true);
            } else {
                const incorrectFeedback = getFeedbackText('shape-incorrect');
                if (incorrectFeedback) {
                    setDynamicTutorText(incorrectFeedback);
                }
            }
            return;
        } else if (answerData.feedbackInteractionId) {
            // For crayon activity: determine correct feedback based on answer result
            const feedbackId = answerData.isCorrect ? 'crayon-correct' : 'crayon-incorrect';
            const feedbackText = getFeedbackText(feedbackId);
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
                setShowNextButton(true); // Show continue button after feedback
            }
        } else {
            // For other question types, advance as before
            advanceToNext();
        }
    };

    const handleHighlightComplete = () => {
        setShowNextButton(true);
    };

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
        
        // Continue with existing perimeter check logic
        perimeterHook.handlePerimeterCheck(
            correctAnswer,
            interaction?.contentProps?.feedbackIds,
            getFeedbackText,
            getFeedbackInteraction,
            setDynamicTutorText,
            setActiveFeedbackInteraction,
            setShowNextButton
        );
    }, [perimeterHook, interaction, getFeedbackText, getFeedbackInteraction, playCorrectSound, playIncorrectSound]);

    // Shape sorting game intervention callbacks
    const handleShapeHint = useCallback((shapeType) => {
        const hintText = getFeedbackText(`${shapeType}-hint`);
        if (hintText) {
            setDynamicTutorText(hintText);
        }
    }, [getFeedbackText]);

    const handleShapeAutoHelp = useCallback((shapeType) => {
        const autoHelpText = getFeedbackText(`${shapeType}-auto-help`);
        if (autoHelpText) {
            setDynamicTutorText(autoHelpText);
        }
    }, [getFeedbackText]);

    const handleShapeCorrection = useCallback((shapeType) => {
        const correctionText = getFeedbackText(`${shapeType}-correction`);
        if (correctionText) {
            setDynamicTutorText(correctionText);
        }
    }, [getFeedbackText]);

    const handleShapeDesignCheck = useCallback(() => {
        playClickSound();
        shapeDesignHook.handleShapeDesignCheck(
            interaction?.contentProps?.targetPerimeter,
            interaction?.contentProps?.feedbackIds,
            getFeedbackText,
            getFeedbackInteraction,
            setDynamicTutorText,
            setActiveFeedbackInteraction,
            setShowNextButton
        );
    }, [shapeDesignHook, interaction, getFeedbackText, getFeedbackInteraction, playClickSound]);

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
        
        // Continue with existing measurement check logic
        measurementHook.handleMeasurementCheck(
            correctAnswer,
            interaction,
            handleAnswer
        );
    }, [measurementHook, interaction, handleAnswer, playCorrectSound, playIncorrectSound]);

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
        } else if (interaction?.navigateToPresentation) {
            // Handle special navigation (like from 5C to standard-units-intro)
            const targetPresIndex = lesson.sequence.findIndex(seq => seq.presentationId === interaction.navigateToPresentation);
            if (targetPresIndex !== -1) {
                setCurrentPresIndex(targetPresIndex);
                setCurrentInteractionIndex(0);
                setDynamicTutorText(null);
            } else {
                console.warn(`Presentation ${interaction.navigateToPresentation} not found in lesson sequence`);
                advanceToNext();
            }
        } else {
            advanceToNext();
        }
    };

    // Effect to handle layout changes and initial setup
    useEffect(() => {
        // All interactions should start with button hidden and wait for TTS to finish
        setShowNextButton(false);
        
        // Reset animation trigger to prevent flicker
        setAnimationTrigger(false);

        // Reset dynamic tutor text when interaction changes
        setDynamicTutorText(null);

        // Reset input states when interaction changes
        perimeterHook.resetPerimeterState();
        shapeDesignHook.resetShapeDesignState();
        measurementHook.resetMeasurementState();

        // Reset video loop state for new interactions
        if (videoRef.current && interaction?.tutorAnimation && shouldAnimationLoop(interaction.tutorAnimation)) {
            videoRef.current.loop = true;
        }
    }, [interaction]);

    // TTS Callbacks
    const handleTTSEnd = useCallback(() => {
        setIsSpeaking(false);
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
        const shouldAutoAnimate = interaction?.type.startsWith('footsteps-') ||
            interaction?.type === 'meter-measurement' ||
            (interaction?.type === 'shape-sorting-game' && interaction?.id === 'shape-demo-modeling');

        // Special handling for demo animation - don't trigger here, let component handle internally
        if (interaction?.id === 'shape-demo-modeling') {
            console.log('🎯 Demo interaction - TTS ended, waiting for component internal animation trigger');
            return; // Don't trigger animation here - component will handle it internally
        }

        if (currentInteraction?.transitionType === 'auto') {
            setTimeout(advanceToNext, 500);
        } else if (interaction?.transitionType === 'interaction-based') {
            // Wait for component to signal completion - don't auto-advance
            console.log('🎯 Waiting for interaction-based completion');
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
    }, [interaction, activeFeedbackInteraction, advanceToNext]);

    const handleTTSStart = useCallback(() => {
        setIsSpeaking(true);
    }, [interaction]);

    // Listen for custom advancement events from components like ShapeSorterGame
    useEffect(() => {
        const handleAdvanceInteraction = () => {
            console.log('🎯 Custom interaction advancement triggered');
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

        let props = {
            key: componentKey,
            onAnimationComplete: handleAnimationComplete,
            startAnimation: animationTrigger,
            onInteraction: handleUserInteraction,
            // Pass highlighting props for perimeter input interactions
            showSideHighlighting: perimeterHook.showSideHighlighting,
            onHighlightComplete: handleHighlightComplete,
            // Pass perimeter callback for shape design components
            onPerimeterCalculated: shapeDesignHook.setCurrentPerimeter,
        };

        // Special handling for shape-sorting-game component
        if (interaction.type === 'shape-sorting-game') {
            props.contentProps = {
                ...interaction.contentProps,
                phaseConfig: interaction.phaseConfig
            };
            // Pass animation completion callback for demo interaction
            if (interaction.id === 'shape-demo-modeling') {
                props.onAnimationComplete = handleAnimationComplete;
            }
            // Pass intervention callbacks for practice phases
            props.onShapeHint = handleShapeHint;
            props.onShapeAutoHelp = handleShapeAutoHelp;
            props.onShapeCorrection = handleShapeCorrection;
        } else {
            // For other components, spread contentProps directly
            props = { ...props, ...interaction.contentProps };
        }

        return <Component {...props} />;
    }

    return (
        <div>
            <div className="lesson-content">
                <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
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
            <AppBar position="static" sx={{
                bgcolor: '#000',
                boxShadow: 'none',
                borderBottom: '1px solid #2B2B2B'
            }}>
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    minHeight: '60px !important',
                    px: '32px',
                    py: '16px'
                }}>
                    {/* Left Side - Lesson Info */}
                    <Box>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', lineHeight: 1, fontFamily: "'Fustat', 'Inter', sans-serif", fontWeight: 500 }}>
                            LESSON {lessonId === 'perimeter' ? '1' : '1'}
                            {isDevMode && (
                                <span style={{ color: '#4CAF50', marginLeft: '8px', fontWeight: 600 }}>
                                    • DEV MODE
                                </span>
                            )}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1.2, textTransform: 'capitalize', fontFamily: "'Fustat', 'Inter', sans-serif", fontWeight: 500 }}>
                            {lesson?.title || 'Perimeter'}
                        </Typography>
                    </Box>

                    {/* Right Side - Navigation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Developer Menu */}
                        {isDevMode && (
                            <DeveloperMenu
                                lessonId={lessonId}
                                currentPresIndex={currentPresIndex}
                                currentInteractionIndex={currentInteractionIndex}
                                onInteractionSelect={handleDevInteractionSelect}
                                onResetLesson={handleDevResetLesson}
                            />
                        )}
                        <IconButton
                            sx={{
                                color: '#fff',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '8px',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                            }}
                            onClick={() => navigate('/')}
                        >
                            <HomeIcon />
                        </IconButton>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: '#fff',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                            }}
                            onClick={() => navigate(-1)}
                        >
                            Go Back
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, display: 'flex', bgcolor: '#000' }}>
                {/* Left Panel - Tutor (26%) */}
                <Box sx={{
                    width: '26%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    alignItems: 'flex-start',
                    textAlign: 'left'
                }}>
                    {/* Audio Controls */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                        gap: 1,
                        mb: 2
                    }}>
                        <IconButton sx={{
                            color: isMuted ? '#999' : '#fff',
                            '&:hover': { 
                                color: isMuted ? '#bbb' : '#fff',
                                bgcolor: 'rgba(255, 255, 255, 0.1)'
                            }
                        }} onClick={handleMuteToggle}>
                            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </IconButton>
                        <IconButton sx={{
                            color: (isSpeaking || isTTSPaused) ? '#fff' : '#999',
                            cursor: (isSpeaking || isTTSPaused) ? 'pointer' : 'not-allowed',
                            '&:hover': { color: (isSpeaking || isTTSPaused) ? '#fff' : '#999' }
                        }} onClick={(isSpeaking || isTTSPaused) ? handleTTSPauseResume : (e) => e.preventDefault()}>
                            {isTTSPaused ? <PlayArrowIcon /> : <PauseIcon />}
                        </IconButton>
                    </Box>

                    {/* Tutor Avatar */}
                    <Box sx={{ mb: 3 }}>
                        {interaction?.tutorAnimation ? (
                            <video
                                ref={videoRef}
                                src={`/animations/${interaction.tutorAnimation}.webm`}
                                autoPlay
                                loop={shouldAnimationLoop(interaction.tutorAnimation)}
                                muted
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <img
                                src="/images/tutor.svg"
                                alt="AI Tutor"
                                style={{
                                    width: '100px',
                                    height: '100px'
                                }}
                            />
                        )}
                    </Box>

                    {/* Tutor Speech */}
                    <Box sx={{ mb: 3 }}>
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

                    {/* Perimeter Input Interface */}
                    {interaction?.type === 'perimeter-input' && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            {/* Show solution equation if needed */}
                            {perimeterHook.showPerimeterSolution && (
                                <Box sx={{ mb: 2, textAlign: 'left' }}>
                                    <Typography variant="body2" sx={{ color: '#4CAF50', fontSize: '0.9rem' }}>
                                        {interaction?.contentProps?.shape?.type === 'rectangle' &&
                                            `${interaction.contentProps.shape.width} + ${interaction.contentProps.shape.height} + ${interaction.contentProps.shape.width} + ${interaction.contentProps.shape.height} = ${interaction.contentProps.correctAnswer}`
                                        }
                                        {interaction?.contentProps?.shape?.type === 'square' &&
                                            `${interaction.contentProps.shape.side} + ${interaction.contentProps.shape.side} + ${interaction.contentProps.shape.side} + ${interaction.contentProps.shape.side} = ${interaction.contentProps.correctAnswer}`
                                        }
                                        {interaction?.contentProps?.shape?.type === 'triangle' && interaction?.contentProps?.shape?.sides &&
                                            `${interaction.contentProps.shape.sides.join(' + ')} = ${interaction.contentProps.correctAnswer}`
                                        }
                                        {interaction?.contentProps?.shape?.type === 'pentagon' && interaction?.contentProps?.shape?.sides &&
                                            `${interaction.contentProps.shape.sides.join(' + ')} = ${interaction.contentProps.correctAnswer}`
                                        }
                                    </Typography>
                                </Box>
                            )}

                            <MeasurementInput
                                value={perimeterHook.perimeterInput}
                                onInputChange={perimeterHook.setPerimeterInput}
                                onCheck={handlePerimeterCheck}
                                disabled={perimeterHook.showPerimeterSolution}
                                placeholder="Enter perimeter"
                                unit={interaction?.contentProps?.shape?.unit || 'units'}
                            />
                        </Box>
                    )}

                    {/* Shape Design Validation Interface */}
                    {interaction?.type === 'perimeter-design' && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            {/* Show current vs target perimeter */}
                            <Box sx={{ mb: 2, textAlign: 'left' }}>
                                <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.9rem', mb: 1, fontFamily: "'Fustat', 'Inter', sans-serif", fontWeight: 500 }}>
                                    Target: {interaction?.contentProps?.targetPerimeter} units
                                </Typography>
                            </Box>
                            
                            {/* Check button */}
                            <PrimaryButton onClick={handleShapeDesignCheck}>
                                Check My Shape
                            </PrimaryButton>
                        </Box>
                    )}

                    {/* Measurement Input Interface */}
                    {interaction?.type === 'shape-measurement' && !isSpeaking && !showNextButton && (
                        <MeasurementInput
                            value={measurementHook.measurementInput}
                            onInputChange={measurementHook.setMeasurementInput}
                            onCheck={handleMeasurementCheck}
                            placeholder="Enter length"
                            unit="cm"
                        />
                    )}



                    {/* Multiple Choice Question Interface - Feedback interactions */}
                    {activeFeedbackInteraction?.type === 'multiple-choice-question' && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {activeFeedbackInteraction?.contentProps?.choices?.map((choice, index) => (
                                        <Button
                                            key={index}
                                            variant="outlined"
                                            onClick={() => handleAnswer({ 
                                                text: choice.text, 
                                                isCorrect: choice.isCorrect,
                                                feedbackId: choice.feedbackId
                                            })}
                                            sx={{
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                border: '1px solid #545E7D',
                                                background: '#484D5C',
                                                fontWeight: 500,
                                                color: '#fff',
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                textAlign: 'left',
                                                justifyContent: 'flex-start',
                                                fontFamily: "'Fustat', 'Inter', sans-serif",
                                                '&:hover': {
                                                    background: '#545E7D',
                                                    borderColor: '#545E7D'
                                                }
                                            }}
                                        >
                                            {choice.text}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Multiple Choice Question Interface - General case */}
                    {interaction?.type === 'multiple-choice-question' && !activeFeedbackInteraction && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {interaction?.contentProps?.choices?.map((choice, index) => (
                                        <Button
                                            key={index}
                                            variant="outlined"
                                            onClick={() => handleAnswer({ 
                                                text: choice.text, 
                                                isCorrect: choice.isCorrect,
                                                feedbackId: choice.feedbackId
                                            })}
                                            sx={{
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                border: '1px solid #545E7D',
                                                background: '#484D5C',
                                                fontWeight: 500,
                                                color: '#fff',
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                textAlign: 'left',
                                                justifyContent: 'flex-start',
                                                fontFamily: "'Fustat', 'Inter', sans-serif",
                                                '&:hover': {
                                                    background: '#545E7D',
                                                    borderColor: '#545E7D'
                                                }
                                            }}
                                        >
                                            {choice.text}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Action Button */}
                    {showNextButton && (
                        <PrimaryButton onClick={handleDoneButton}>
                            {(activeFeedbackInteraction || interaction)?.type === 'welcome' ? "Let's Go!" : 
                             (interaction?.transitionType === 'conditional' && interaction?.buttonText ? interaction.buttonText : 
                             ((activeFeedbackInteraction || interaction)?.nextButtonText || "Continue"))}
                        </PrimaryButton>
                    )}
                </Box>

                {/* Right Panel - Container (74%) */}
                <Box sx={{
                    width: '74%',
                    bgcolor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3
                }}>
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
                </Box>
            </div>
            {isMobile && <MobileRestrictionOverlay />}
        </div>
    );
};

export default InteractiveLesson; 
