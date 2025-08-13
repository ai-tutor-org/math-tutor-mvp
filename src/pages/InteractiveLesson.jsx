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
import MissionReadiness from '../components/MissionReadiness';
import FarmerIntro from '../components/FarmerIntro';
import FoxThreat from '../components/FoxThreat';
import FarmMap from '../components/FarmMap';
import PerimeterDefinition from '../components/PerimeterDefinition';
import RectangleSolution from '../components/RectangleSolution';

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
    'multiple-choice-question': RoomIllustration,
    'mission-readiness': MissionReadiness,
    'farmer-intro': FarmerIntro,
    'fox-threat': FoxThreat,
    'farm-map': FarmMap,
    'perimeter-definition': PerimeterDefinition,
    'perimeter-input': FarmMap,
    'rectangle-solution': RectangleSolution
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
    const [activeFeedbackInteraction, setActiveFeedbackInteraction] = useState(null); // For feedback components

    // Perimeter Input State
    const [perimeterInput, setPerimeterInput] = useState('');
    const [perimeterAttempts, setPerimeterAttempts] = useState(0);
    const [showPerimeterSolution, setShowPerimeterSolution] = useState(false);
    const [showSideHighlighting, setShowSideHighlighting] = useState(false);
    const [currentEquationStep, setCurrentEquationStep] = useState(0);

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

    // Helper function to get full feedback interaction data including ContentComponent
    const getFeedbackInteraction = useCallback((feedbackInteractionId) => {
        for (const [presId, pres] of Object.entries(presentations)) {
            const feedbackInteraction = pres.interactions.find(int => int.id === feedbackInteractionId);
            if (feedbackInteraction) {
                return feedbackInteraction;
            }
        }
        return null;
    }, []);

    const advanceToNext = useCallback(() => {
        setAnimationTrigger(false); // Reset trigger for the next interaction
        setDynamicTutorText(null); // Clear any lingering feedback text
        setActiveFeedbackInteraction(null); // Clear any feedback component

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
                    }
                    setShowNextButton(true);
                }
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

    const handlePerimeterCheck = () => {
        const userAnswer = parseInt(perimeterInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;
        const feedbackIds = interaction?.contentProps?.feedbackIds;

        if (userAnswer === correctAnswer) {
            // Correct answer
            console.log(userAnswer, correctAnswer);
            const feedbackText = getFeedbackText(feedbackIds?.correct);
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setPerimeterAttempts(0); // Reset for next interaction
        } else {
            // Incorrect answer
            const newAttempts = perimeterAttempts + 1;
            setPerimeterAttempts(newAttempts);

            if (newAttempts === 1) {
                // First incorrect attempt - show hint
                const feedbackText = getFeedbackText(feedbackIds?.hint1);
                if (feedbackText) {
                    setDynamicTutorText(feedbackText);
                }
                setPerimeterInput(''); // Clear input for retry
            } else if (newAttempts === 2) {
                // Second incorrect attempt - show solution
                const feedbackInteraction = getFeedbackInteraction(feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setShowPerimeterSolution(true);
                setShowSideHighlighting(true);
                setCurrentEquationStep(0);
                setPerimeterInput(correctAnswer.toString());
                setPerimeterAttempts(0); // Reset for next interaction
            }
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
        // All interactions should start with button hidden and wait for TTS to finish
        setShowNextButton(false);

        // Reset dynamic tutor text when interaction changes
        setDynamicTutorText(null);
        
        // Reset perimeter input state when interaction changes
        setPerimeterInput('');
        setPerimeterAttempts(0);
        setShowPerimeterSolution(false);
        setShowSideHighlighting(false);
        setCurrentEquationStep(0);
    }, [interaction]);

    // TTS Callbacks
    const handleTTSEnd = useCallback(() => {
        setIsSpeaking(false);
        setIsWaving(false);

        // Use feedback interaction properties when active, otherwise use main interaction
        const currentInteraction = activeFeedbackInteraction || interaction;

        // This should ONLY trigger for animations that start immediately after speech.
        const shouldAutoAnimate = currentInteraction?.type.startsWith('footsteps-') ||
            currentInteraction?.type === 'meter-measurement' ||
            currentInteraction?.type === 'ruler-measurement';

        if (currentInteraction?.transitionType === 'auto') {
            setTimeout(advanceToNext, 500);
        } else if (currentInteraction?.type === 'welcome') {
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

        // Check if there's an active feedback interaction with a ContentComponent
        if (activeFeedbackInteraction?.ContentComponent) {
            const FeedbackComponent = activeFeedbackInteraction.ContentComponent;
            const feedbackProps = {
                key: `feedback-${activeFeedbackInteraction.id}`,
                ...activeFeedbackInteraction.contentProps,
                onAnimationComplete: handleAnimationComplete,
                startAnimation: animationTrigger,
                onAnswer: handleAnswer,
                showSideHighlighting: showSideHighlighting,
                onHighlightComplete: handleHighlightComplete,
            };
            return <FeedbackComponent {...feedbackProps} />;
        }

        // Otherwise, render the normal interaction component
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
            // Pass highlighting props for perimeter input interactions
            showSideHighlighting: showSideHighlighting,
            onHighlightComplete: handleHighlightComplete,
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
                isDevMode={isDevMode}
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
                            src="/math-tutor-mvp/images/tutor_avatar.png"
                            alt="AI Tutor"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                        />
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
                                whiteSpace: 'pre-line'
                            }}
                        >
                            {tutorText}
                        </Typography>
                    </Box>

                    {/* Perimeter Input Interface */}
                    {interaction?.type === 'perimeter-input' && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            {/* Show solution equation if needed */}
                            {showPerimeterSolution && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
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
                            
                            {/* Input field */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Typography variant="body2" sx={{ color: '#fff', whiteSpace: 'nowrap' }}>
                                    Perimeter =
                                </Typography>
                                <TextField
                                    value={perimeterInput}
                                    onChange={(e) => setPerimeterInput(e.target.value)}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    disabled={showPerimeterSolution}
                                    sx={{
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                            backgroundColor: '#2C2C2C',
                                            '& fieldset': {
                                                borderColor: '#555',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#777',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#4CAF50',
                                            },
                                            '&.Mui-disabled': {
                                                color: '#4CAF50',
                                                backgroundColor: '#1E1E1E',
                                                '& fieldset': {
                                                    borderColor: '#4CAF50',
                                                }
                                            }
                                        },
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: '#4CAF50',
                                            opacity: 1
                                        }
                                    }}
                                />
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                    {interaction?.contentProps?.shape?.unit || 'units'}
                                </Typography>
                            </Box>
                            
                            {/* Check button */}
                            {!showNextButton && !showPerimeterSolution && (
                                <Button
                                    variant="contained"
                                    onClick={handlePerimeterCheck}
                                    disabled={!perimeterInput.trim()}
                                    sx={{
                                        padding: '8px',
                                        borderRadius: '12px',
                                        background: '#4CAF50',
                                        color: '#fff',
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        minWidth: '120px',
                                        '&:hover': {
                                            background: '#45a049'
                                        },
                                        '&:disabled': {
                                            background: '#2C2C2C',
                                            color: '#666'
                                        }
                                    }}
                                >
                                    Check
                                </Button>
                            )}
                        </Box>
                    )}

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
                            {(activeFeedbackInteraction || interaction)?.type === 'welcome' ? "Let's Go!" : ((activeFeedbackInteraction || interaction)?.nextButtonText || "Continue")}
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