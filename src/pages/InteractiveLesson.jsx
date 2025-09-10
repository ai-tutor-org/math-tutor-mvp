import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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

// Import lesson data access utilities
import {
    getLessonData,
    getPresentationId,
    getPresentationData,
    getInteractionData,
    getFeedbackInteraction as getFeedbackInteractionUtil
} from '../utils/lessonDataAccess';

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
import MeasurementHandler from '../components/presentations/02-measurement/MeasurementHandler';

// Import common components
import PrimaryButton from '../components/common/PrimaryButton';
import HighlightedText from '../components/common/HighlightedText';

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
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [dynamicTutorText, setDynamicTutorText] = useState(null); // For answer feedback
    const [activeFeedbackInteraction, setActiveFeedbackInteraction] = useState(null); // For feedback components
    const [isTTSPaused, setIsTTSPaused] = useState(false);
    const [leftInput, setLeftInput] = useState('');

    // Highlighting State
    const [currentAudioTime, setCurrentAudioTime] = useState(0);
    const [currentTimingData, setCurrentTimingData] = useState(null);

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
    const { playAnswerSound } = useAnswerSound();

    // Custom hooks for input management
    const measurementHandler = MeasurementHandler();
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

    // Timing update handler for highlighting
    const handleTimeUpdate = useCallback((time) => {
        setCurrentAudioTime(time);
    }, []);

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

    // Data from content data using utility functions
    const lesson = useMemo(() => getLessonData(lessonId), [lessonId]);
    const presentationId = useMemo(() => getPresentationId(lessonId, currentPresIndex), [lessonId, currentPresIndex]);
    const presentation = useMemo(() => getPresentationData(presentationId), [presentationId]);
    const interaction = useMemo(() => getInteractionData(presentationId, currentInteractionIndex), [presentationId, currentInteractionIndex]);

    // Helper function to get full feedback interaction data including ContentComponent
    const getFeedbackInteraction = useCallback((feedbackInteractionId) => {
        return getFeedbackInteractionUtil(presentationId, feedbackInteractionId);
    }, [presentationId]);

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

    const handleFeedbackTextTrigger = useCallback((feedbackId) => {
        const feedbackText = getFeedbackInteraction(feedbackId)?.tutorText;
        if (feedbackText) {
            setDynamicTutorText(feedbackText);
        }
    }, [getFeedbackInteraction]);

    const handleFeedbackInteractionTrigger = useCallback((feedbackId) => {
        const feedbackInteraction = getFeedbackInteraction(feedbackId);
        if (feedbackInteraction) {
            setActiveFeedbackInteraction(feedbackInteraction);
            setDynamicTutorText(feedbackInteraction.tutorText);
        }
    }, [getFeedbackInteraction]);

    const handlePerimeterCheck = useCallback(() => {
        // Validate answer immediately to determine which sound to play
        const userAnswer = parseInt(perimeterHook.perimeterInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const isCorrect = userAnswer === correctAnswer;

        playAnswerSound(isCorrect);

        // Continue with existing perimeter check logic
        perimeterHook.handlePerimeterCheck(
            correctAnswer,
            interaction?.contentProps?.feedbackIds,
            getFeedbackInteraction,
            setDynamicTutorText,
            setActiveFeedbackInteraction,
            setShowNextButton
        );
    }, [perimeterHook, interaction, getFeedbackInteraction]);

    const handleShapeDesignCheck = useCallback(() => {
        shapeDesignHook.handleShapeDesignCheck(
            interaction?.interactionProps?.targetPerimeter,
            interaction?.contentProps?.feedbackIds,
            getFeedbackInteraction,
            setDynamicTutorText,
            setActiveFeedbackInteraction,
            setShowNextButton
        );
    }, [shapeDesignHook, interaction, getFeedbackInteraction]);

    const handleMeasurementCheck = useCallback(() => {
        measurementHandler.handleMeasurementCheck(
            lessonId,
            currentPresIndex,
            currentInteractionIndex,
            leftInput,
            setLeftInput,
            setShowNextButton,
            handleFeedbackTextTrigger
        );
    }, [measurementHandler, lessonId, currentPresIndex, currentInteractionIndex, leftInput, handleFeedbackTextTrigger]);

    const handleAnimationComplete = useCallback(() => {
        if (interaction.showNextButton) {
            setShowNextButton(true);
        } else {
            advanceToNext();
        }
    }, [interaction, advanceToNext]);

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
        setLeftInput('');

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

    // Update timing data when tutor text changes
    useEffect(() => {

        const loadTimingData = async () => {
            if (ttsRef.current && tutorText) {
                const timingData = await ttsRef.current.getTimingData(tutorText);
                setCurrentTimingData(timingData);
            } else {
                setCurrentTimingData(null);
            }
        };

        loadTimingData();
        // Reset current time when text changes
        setCurrentAudioTime(0);
    }, [tutorText]);

    // Effect to cancel speech on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    // Build props for interaction components based on type
    const buildInteractionProps = useCallback((currentInteraction) => {
        const baseProps = {
            ...currentInteraction.interactionProps,
            disabled: false
        };

        switch (currentInteraction.type) {
            case 'perimeter-input':
                return {
                    ...baseProps,
                    value: perimeterHook.perimeterInput,
                    onInputChange: perimeterHook.setPerimeterInput,
                    onCheck: handlePerimeterCheck
                };

            case 'shape-measurement':
                return {
                    ...baseProps,
                    value: leftInput,
                    onInputChange: setLeftInput,
                    onCheck: handleMeasurementCheck
                };

            case 'multiple-choice-question':
                return {
                    ...baseProps,
                    onAnswer: (choice) => {
                        playAnswerSound(choice?.isCorrect);
                        handleFeedbackInteractionTrigger(choice?.feedbackId);
                    },
                };

            case 'perimeter-design':
                return {
                    ...baseProps,
                    onCheck: handleShapeDesignCheck
                };

            default:
                return baseProps;
        }
    }, [perimeterHook.perimeterInput, perimeterHook.setPerimeterInput, handlePerimeterCheck, leftInput, setLeftInput, handleMeasurementCheck, handleFeedbackInteractionTrigger, handleShapeDesignCheck]);

    // Render Left Panel Interaction Component
    const renderInteraction = useCallback(() => {
        if (!interaction || isSpeaking || showNextButton) {
            return null;
        }

        // Use feedback interaction if active, otherwise use main interaction
        const currentInteraction = activeFeedbackInteraction || interaction;
        const InteractionComp = currentInteraction?.InteractionComponent;

        if (!InteractionComp) return null;

        // Build props based on interaction type
        const props = buildInteractionProps(currentInteraction);

        return <InteractionComp {...props} />;
    }, [interaction, isSpeaking, showNextButton, activeFeedbackInteraction, buildInteractionProps]);

    // Render Content Component
    const renderContent = useCallback(() => {
        if (!interaction) return null;

        // Check if there's an active feedback interaction with a ContentComponent
        if (activeFeedbackInteraction?.ContentComponent) {
            const FeedbackComponent = activeFeedbackInteraction.ContentComponent;
            const feedbackProps = {
                key: `feedback-${activeFeedbackInteraction.id}`,
                ...activeFeedbackInteraction.contentProps,
                onAnimationComplete: handleAnimationComplete,
                startAnimation: animationTrigger,
            };
            return <FeedbackComponent {...feedbackProps} />;
        }

        const Component = interaction.ContentComponent || null;
        if (!Component) return null;

        // Generate stable key for same component to prevent unnecessary re-mounting
        const componentName = Component.name || Component.displayName || 'Component';
        const componentKey = `${componentName}-${currentPresIndex}`;

        let props = {
            onAnimationComplete: handleAnimationComplete,
            startAnimation: animationTrigger,
            onFeedbackTrigger: handleFeedbackTextTrigger,
            // Pass perimeter callback for shape design components
            onPerimeterCalculated: shapeDesignHook.setCurrentPerimeter,
        };

        props = { ...props, ...interaction.contentProps };

        return <Component key={componentKey} {...props} />;
    }, [interaction, activeFeedbackInteraction, handleAnimationComplete, animationTrigger, shapeDesignHook.setCurrentPerimeter, currentPresIndex, handleFeedbackTextTrigger]);

    // Render Top Menu Bar
    const renderTopMenuBar = useCallback(() => {
        return (
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
                    <Box>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', lineHeight: 1, fontFamily: "'Fustat', 'Inter', sans-serif", fontWeight: 500 }}>
                            LESSON
                            {isDevMode && (
                                <span style={{ color: '#4CAF50', marginLeft: '8px', fontWeight: 600 }}>
                                    • DEV MODE
                                </span>
                            )}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1.2, textTransform: 'capitalize', fontFamily: "'Fustat', 'Inter', sans-serif", fontWeight: 500 }}>
                            {lesson?.title || 'Interactive Lesson'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isDevMode && (
                            <DeveloperMenu
                                lessonId={lessonId}
                                currentPresIndex={currentPresIndex}
                                currentInteractionIndex={currentInteractionIndex}
                                // System control refs
                                ttsRef={ttsRef}
                                // State setters for navigation
                                setCurrentPresIndex={setCurrentPresIndex}
                                setCurrentInteractionIndex={setCurrentInteractionIndex}
                                setIsSpeaking={setIsSpeaking}
                                setShowNextButton={setShowNextButton}
                                setDynamicTutorText={setDynamicTutorText}
                                setAnimationTrigger={setAnimationTrigger}
                                setActiveFeedbackInteraction={setActiveFeedbackInteraction}
                                // Input hooks for state reset
                                setLeftInput={setLeftInput}
                                perimeterHook={perimeterHook}
                                shapeDesignHook={shapeDesignHook}
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
        );
    }, [lesson?.title, isDevMode, lessonId, currentPresIndex, currentInteractionIndex, ttsRef, setCurrentPresIndex, setCurrentInteractionIndex, setIsSpeaking, setShowNextButton, setDynamicTutorText, setAnimationTrigger, setActiveFeedbackInteraction, perimeterHook, shapeDesignHook, navigate]);

    return (
        <div>
            <div className="lesson-content">
                <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
                    <TTSManager
                        ref={ttsRef}
                        text={tutorText}
                        onStart={handleTTSStart}
                        onEnd={handleTTSEnd}
                        onTimeUpdate={handleTimeUpdate}
                        isDevMode={isDevMode}
                        isMobile={isMobile}
                        isMuted={isMuted}
                    />
                    {/* Top Menu Bar */}
                    {renderTopMenuBar()}
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
                                {
                                    interaction?.tutorAnimation ? (
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
                                    )
                                }
                            </Box>
                            {/* Tutor Speech */}
                            <Box sx={{ mb: 3 }}>
                                <HighlightedText
                                    text={tutorText}
                                    currentTime={currentAudioTime}
                                    timingData={currentTimingData}
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
                                />
                            </Box>
                            {/* Left Panel Interactive Elements */}
                            {renderInteraction()}
                            {/* Action Button */}
                            {showNextButton && (
                                <PrimaryButton onClick={() => {
                                    playClickSound();
                                    advanceToNext();
                                }}>
                                    {(activeFeedbackInteraction || interaction)?.nextButtonText || "Continue"}
                                </PrimaryButton>
                            )}
                        </Box>
                        {/* Right Panel - Container (74%) */}
                        <Box
                            sx={{
                                width: '74%',
                                bgcolor: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 3
                            }}
                        >
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
