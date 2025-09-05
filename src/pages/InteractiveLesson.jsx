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

    // Data from content data
    const lesson = useMemo(() => lessons[lessonId], [lessonId]);
    const presentationId = useMemo(() => {
        return lesson.sequence[currentPresIndex]?.presentationId;
    }, [lesson, currentPresIndex]);
    const presentation = useMemo(() => {
        return presentations[presentationId];
    }, [presentationId]);
    const interaction = useMemo(() => presentation?.interactions[currentInteractionIndex], [presentation, currentInteractionIndex]);

    // Helper function to get feedback text from content data
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

    const handleShapeFeedback = useCallback((feedbackId) => {
        const feedbackText = getFeedbackText(feedbackId);
        if (feedbackText) {
            setDynamicTutorText(feedbackText);
        }
    }, [getFeedbackText]);

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


    // Update timing data when tutor text changes
    useEffect(() => {

        const loadTimingData = async () => {
            if (ttsRef.current && tutorText) {
                const timingData = await ttsRef.current.getTimingData(tutorText);
                console.log('InteractiveLesson: Got timing data:', { hasTimingData: !!timingData, wordCount: timingData?.words?.length });
                setCurrentTimingData(timingData);
            } else {
                console.log('InteractiveLesson: No TTS ref or tutor text');
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
    function buildInteractionProps(currentInteraction) {
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
                    value: measurementHook.measurementInput,
                    onInputChange: measurementHook.setMeasurementInput,
                    onCheck: handleMeasurementCheck
                };

            case 'multiple-choice-question':
                return {
                    ...baseProps,
                    onAnswer: handleAnswer
                };

            // perimeter-design stays inline for now - will refactor in later iteration

            default:
                return baseProps;
        }
    }

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
            onInteraction: handleUserInteraction,
            // Pass perimeter callback for shape design components
            onPerimeterCalculated: shapeDesignHook.setCurrentPerimeter,
        };

        // Special handling for shape-sorting-game component
        if (interaction.type === 'shape-sorting-game') {
            props.contentProps = interaction.contentProps;
            props.onFeedbackTrigger = handleShapeFeedback;
        }

        props = { ...props, ...interaction.contentProps };

        return <Component key={componentKey} {...props} />;
    }

    // Render Top Menu Bar
    function renderTopMenuBar() {
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
        );
    }

    // Render Left Panel Interaction Component
    function renderInteraction() {
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
                            {/* Keep shape design validation inline for now */}
                            {interaction?.type === 'perimeter-design' && !isSpeaking && !showNextButton && (
                                <Box sx={{ mb: 3, width: '100%' }}>
                                    <Box sx={{ mb: 2, textAlign: 'left' }}>
                                        <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.9rem', mb: 1, fontFamily: "'Fustat', 'Inter', sans-serif", fontWeight: 500 }}>
                                            Target: {interaction?.contentProps?.targetPerimeter} units
                                        </Typography>
                                    </Box>
                                    <PrimaryButton onClick={handleShapeDesignCheck}>
                                        Check My Shape
                                    </PrimaryButton>
                                </Box>
                            )}
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
