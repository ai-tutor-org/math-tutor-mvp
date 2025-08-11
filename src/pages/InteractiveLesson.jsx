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
    Paper
} from '@mui/material';
import {
    Home as HomeIcon,
    Settings as SettingsIcon,
    ArrowBack as ArrowBackIcon,
    VolumeOff as VolumeOffIcon,
    Pause as PauseIcon
} from '@mui/icons-material';

import { lessons, presentations } from '../contentData'; // Import centralized data

import TTSManager from '../components/TTSManager';
import DeveloperMenu from '../components/DeveloperMenu';
import { useIsDevMode, useDevModeNavigate } from '../utils/devMode';

// Import all possible content components
import RoomIllustration from '../components/RoomIllustration';
import ConflictingMeasurements from '../components/ConflictingMeasurements';
import StandardUnits from '../components/StandardUnits';
import RulerMeasurement from '../components/RulerMeasurement';
import MeterStick from '../components/MeterStick';
import CrayonMeasurementQuestion from '../components/CrayonMeasurementQuestion';

import './InteractiveLesson.css';

const componentMap = {
    'room-question': RoomIllustration,
    'footsteps-animation': RoomIllustration,
    'footsteps-animation-friend': RoomIllustration,
    'conflicting-measurements': ConflictingMeasurements,
    'standard-units-explanation': StandardUnits,
    'ruler-measurement': RulerMeasurement,
    'meter-measurement': MeterStick,
    'interactive-question': CrayonMeasurementQuestion,
    'multiple-choice-question': RoomIllustration
};

const InteractiveLesson = () => {
    const navigate = useDevModeNavigate();
    const location = useLocation();
    const { userName = 'Explorer', lessonId = 'perimeter' } = location.state || {};
    
    // Developer mode detection
    const isDevMode = useIsDevMode();

    // Lesson State
    const [currentPresIndex, setCurrentPresIndex] = useState(0);
    const [currentInteractionIndex, setCurrentInteractionIndex] = useState(0);
    const [currentConditionalPresentation, setCurrentConditionalPresentation] = useState(null); // For 5B, 5C

    // UI State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [dynamicTutorText, setDynamicTutorText] = useState(null); // For answer feedback

    // TTS Ref for direct control
    const ttsRef = React.useRef();

    // Data from contentData.js
    const lesson = useMemo(() => lessons[lessonId], [lessonId]);
    const presentationId = useMemo(() => {
        // Use conditional presentation if set, otherwise use normal sequence
        return currentConditionalPresentation || lesson.sequence[currentPresIndex]?.presentationId;
    }, [lesson, currentPresIndex, currentConditionalPresentation]);
    const presentation = useMemo(() => presentations[presentationId], [presentationId]);
    const interaction = useMemo(() => presentation?.interactions[currentInteractionIndex], [presentation, currentInteractionIndex]);

    // Helper function to get feedback text from contentData
    const getFeedbackText = useCallback((feedbackInteractionId) => {
        for (const [presId, pres] of Object.entries(presentations)) {
            const feedbackInteraction = pres.interactions.find(int => int.id === feedbackInteractionId);
            if (feedbackInteraction) {
                return feedbackInteraction.tutorText;
            }
        }
        return null;
    }, []);

    const advanceToNext = useCallback(() => {
        setAnimationTrigger(false); // Reset trigger for the next interaction
        setDynamicTutorText(null); // Clear any lingering feedback text

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

    const navigateToInteraction = useCallback((interactionId) => {
        console.log(`Looking for interaction: ${interactionId}`);
        // Find the presentation containing this interaction
        for (const [presId, pres] of Object.entries(presentations)) {
            console.log(`Checking presentation: ${presId}`);
            const interactionIndex = pres.interactions.findIndex(int => int.id === interactionId);
            console.log(`Found interaction at index: ${interactionIndex}`);
            if (interactionIndex !== -1) {
                // For conditional presentations (5B, 5C), set them using conditional presentation state
                if (presId === 'measurement-reason-incorrect' || presId === 'measurement-reason-correct') {
                    console.log(`Navigating to conditional presentation: ${presId}`);
                    setCurrentConditionalPresentation(presId);
                    setCurrentInteractionIndex(interactionIndex);
                    setDynamicTutorText(null);
                    return;
                }

                // For normal presentations in the lesson sequence
                const lessonSeqIndex = lesson.sequence.findIndex(seq => seq.presentationId === presId);
                if (lessonSeqIndex !== -1) {
                    console.log(`Found in lesson sequence at: ${lessonSeqIndex}`);
                    setCurrentConditionalPresentation(null); // Clear conditional presentation
                    setCurrentPresIndex(lessonSeqIndex);
                    setCurrentInteractionIndex(interactionIndex);
                    setDynamicTutorText(null);
                    return;
                }
            }
        }
        console.warn(`Interaction ${interactionId} not found`);
    }, [lesson]);

    // Developer mode handlers
    const handleDevInteractionSelect = useCallback((interaction) => {
        console.log('Dev navigation to:', interaction);
        
        if (interaction.isConditional) {
            // Navigate to conditional presentation
            setCurrentConditionalPresentation(interaction.presentationId);
            setCurrentInteractionIndex(interaction.interactionIndex);
        } else {
            // Navigate to regular sequence presentation
            setCurrentConditionalPresentation(null);
            setCurrentPresIndex(interaction.presIndex);
            setCurrentInteractionIndex(interaction.interactionIndex);
        }
        
        // Reset UI state
        setDynamicTutorText(null);
        setShowNextButton(interaction.showNextButton ?? false);
        setAnimationTrigger(false);
    }, []);

    const handleDevResetLesson = useCallback(() => {
        setCurrentPresIndex(0);
        setCurrentInteractionIndex(0);
        setCurrentConditionalPresentation(null);
        setDynamicTutorText(null);
        setShowNextButton(false);
        setAnimationTrigger(false);
    }, []);

    const handleAnswer = (answerData) => {
        console.log('Answer selected:', answerData);
        console.log('Current interaction ID:', interaction?.id);
        console.log('Answer is correct:', answerData.isCorrect);

        // Handle measurement reason question - branch based on answer
        if (interaction?.id === 'measurement-reason-question') {
            if (answerData.isCorrect) {
                // Correct answer: go directly to correct explanation
                console.log('Navigating to measurement-reason-correct');
                setCurrentConditionalPresentation('measurement-reason-correct');
                setCurrentInteractionIndex(0);
            } else {
                // Incorrect answer: go to incorrect feedback and retry
                console.log('Navigating to measurement-reason-incorrect');
                setCurrentConditionalPresentation('measurement-reason-incorrect');
                setCurrentInteractionIndex(0);
            }
            return;
        }

        // Handle retry question - only one correct option now
        if (interaction?.id === 'measurement-reason-retry') {
            // Only correct answer available, go to correct explanation
            setCurrentConditionalPresentation('measurement-reason-correct');
            setCurrentInteractionIndex(0);
            return;
        }

        const shapeIds = new Set(['measure-notebook', 'measure-sticky-note', 'measure-coaster', 'measure-house-sign']);
        if (shapeIds.has(answerData.interactionId)) {
            if (answerData.isCorrect) {
                // For the last measurement, go to conclusion; for others, show Continue feedback
                if (answerData.interactionId === 'measure-house-sign') {
                    navigateToInteraction('measurement-conclusion');
                } else {
                    const feedbackText = getFeedbackText('shape-correct');
                    if (feedbackText) {
                        setDynamicTutorText(feedbackText);
                        ttsRef.current?.triggerTTS(feedbackText);
                    }
                    setShowNextButton(true);
                }
            } else {
                const incorrectFeedback = getFeedbackText('shape-incorrect');
                if (incorrectFeedback) {
                    setDynamicTutorText(incorrectFeedback);
                    ttsRef.current?.triggerTTS(incorrectFeedback);
                }
            }
            return;
        } else if (answerData.feedbackInteractionId) {
            // For crayon activity: determine correct feedback based on answer result
            const feedbackId = answerData.isCorrect ? 'crayon-correct' : 'crayon-incorrect';
            const feedbackText = getFeedbackText(feedbackId);
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
                ttsRef.current?.triggerTTS(feedbackText);
                setShowNextButton(true); // Show continue button after feedback
            }
        } else {
            // For other question types, advance as before
            advanceToNext();
        }
    };

    const handleAnimationComplete = useCallback(() => {
        if (interaction?.transitionType === 'manual' && interaction.showNextButton) {
            setShowNextButton(true);
        } else {
            advanceToNext();
        }
    }, [interaction, advanceToNext]);

    // Handle Done button to go home
    const handleDoneButton = () => {
        if (interaction?.nextButtonText === "Done") {
            navigate('/');
        } else if (interaction?.navigateToInteraction) {
            // Handle special navigation to specific interaction
            navigateToInteraction(interaction.navigateToInteraction);
        } else if (interaction?.navigateToPresentation) {
            // Handle special navigation (like from 5C to standard-units-intro)
            const targetPresIndex = lesson.sequence.findIndex(seq => seq.presentationId === interaction.navigateToPresentation);
            if (targetPresIndex !== -1) {
                setCurrentConditionalPresentation(null); // Clear conditional presentation
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
        // For welcome, button starts hidden and shows after TTS
        // For others, respect the showNextButton property
        if (interaction?.type === 'welcome') {
            setShowNextButton(false);
        } else {
            setShowNextButton(interaction?.showNextButton ?? false);
        }

        // Reset dynamic tutor text when interaction changes
        setDynamicTutorText(null);
    }, [interaction]);

    // TTS Callbacks
    const handleTTSEnd = useCallback(() => {
        setIsSpeaking(false);
        setIsWaving(false);

        // This should ONLY trigger for animations that start immediately after speech.
        const shouldAutoAnimate = interaction?.type.startsWith('footsteps-') ||
            interaction?.type === 'meter-measurement' ||
            interaction?.type === 'ruler-measurement';

        if (interaction?.transitionType === 'auto') {
            setTimeout(advanceToNext, 500);
        } else if (interaction?.type === 'welcome') {
            setTimeout(() => setShowNextButton(true), 500);
        } else if (shouldAutoAnimate) {
            // Specifically trigger footsteps, meter stick, or ruler animation after speech
            setAnimationTrigger(true);
        } else if (interaction?.showNextButton) {
            // For all other manual transitions, just show the button.
            setShowNextButton(true);
        }
    }, [interaction, advanceToNext]);

    const handleTTSStart = useCallback(() => {
        setIsSpeaking(true);
        if (interaction?.type === 'welcome') {
            setIsWaving(true);
        }
    }, [interaction]);

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

        // Prioritize the ContentComponent defined directly in the interaction data
        const Component = interaction.ContentComponent || componentMap[interaction.type];

        if (!Component) return null;

        let props = {
            key: `${currentPresIndex}-${currentInteractionIndex}`,
            ...interaction.contentProps,
            onAnimationComplete: handleAnimationComplete,
            startAnimation: animationTrigger,
            // Pass the onAnswer handler to any component that might need it
            onAnswer: handleAnswer,
        };

        return <Component {...props} />;
    }

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
            <TTSManager
                ref={ttsRef}
                text={tutorText}
                onStart={handleTTSStart}
                onEnd={handleTTSEnd}
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
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem', lineHeight: 1 }}>
                            LESSON {lessonId === 'perimeter' ? '1' : '1'}
                            {isDevMode && (
                                <span style={{ color: '#4CAF50', marginLeft: '8px', fontWeight: 600 }}>
                                    • DEV MODE
                                </span>
                            )}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.1rem', lineHeight: 1.2, textTransform: 'capitalize' }}>
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
                                currentConditionalPresentation={currentConditionalPresentation}
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
                        <IconButton
                            sx={{
                                color: '#999',
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '8px',
                                cursor: 'not-allowed',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#999'
                                }
                            }}
                            onClick={(e) => e.preventDefault()}
                        >
                            <SettingsIcon />
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
                    alignItems: 'center',
                    textAlign: 'center'
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
                            color: '#999',
                            cursor: 'not-allowed',
                            '&:hover': { color: '#999' }
                        }} onClick={(e) => e.preventDefault()}>
                            <VolumeOffIcon />
                        </IconButton>
                        <IconButton sx={{
                            color: '#999',
                            cursor: 'not-allowed',
                            '&:hover': { color: '#999' }
                        }} onClick={(e) => e.preventDefault()}>
                            <PauseIcon />
                        </IconButton>
                    </Box>

                    {/* Tutor Avatar */}
                    <Box sx={{ mb: 3 }}>
                        <img
                            src="/images/tutor_avatar.png"
                            alt="AI Tutor"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                        />
                    </Box>

                    {/* Tutor Speech */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ color: '#fff', lineHeight: 1.5, fontSize: '1rem' }}>
                            {tutorText}
                        </Typography>
                    </Box>

                    {/* Action Button */}
                    {showNextButton && (
                        <Button
                            variant="contained"
                            onClick={handleDoneButton}
                            sx={{
                                padding: '8px',
                                borderRadius: '12px',
                                background: '#2C2C2C',
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '1rem',
                                minWidth: '140px',
                                textAlign: 'center',
                                '&:hover': {
                                    background: '#3C3C3C'
                                }
                            }}
                        >
                            {interaction?.type === 'welcome' ? "Let's Go!" : (interaction?.nextButtonText || "Continue")}
                        </Button>
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
    );
};

export default InteractiveLesson; 