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

import { lessons, presentations, conditionalPresentations } from '../contentData'; // Import centralized data

import TTSManager from '../components/TTSManager';
import DeveloperMenu from '../components/DeveloperMenu';
import { useIsDevMode, useDevModeNavigate } from '../utils/devMode';
import { useMobileDetection } from '../hooks/useMobileDetection';
import MobileRestrictionOverlay from '../components/MobileRestrictionOverlay';

// Import all possible content components
import RoomIllustration from '../components/RoomIllustration';
import ConflictingMeasurements from '../components/ConflictingMeasurements';
import StandardUnits from '../components/StandardUnits';
import RulerMeasurement from '../components/RulerMeasurement';
import MeterStick from '../components/MeterStick';
import ShapeSorterGame from '../components/ShapeSorterGame';
import MissionReadiness from '../components/MissionReadiness';
import FarmerIntro from '../components/FarmerIntro';
import FoxThreat from '../components/FoxThreat';
import FarmMap from '../components/FarmMap';
import PerimeterDefinition from '../components/PerimeterDefinition';
import RectangleSolution from '../components/RectangleSolution';
import ShapeDesigner from '../components/ShapeDesigner';

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
    const [currentConditionalPresentation, setCurrentConditionalPresentation] = useState(null); // For conditional presentations

    // UI State
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [dynamicTutorText, setDynamicTutorText] = useState(null); // For answer feedback
    const [activeFeedbackInteraction, setActiveFeedbackInteraction] = useState(null); // For feedback components
    const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction for conditional transitions

    // Measurement Input State
    const [measurementInput, setMeasurementInput] = useState('');

    // Perimeter Input State
    const [perimeterInput, setPerimeterInput] = useState('');
    const [perimeterAttempts, setPerimeterAttempts] = useState(0);
    const [showPerimeterSolution, setShowPerimeterSolution] = useState(false);
    const [showSideHighlighting, setShowSideHighlighting] = useState(false);
    const [currentEquationStep, setCurrentEquationStep] = useState(0);

    // Shape Design State
    const [currentPerimeter, setCurrentPerimeter] = useState(0);
    const [shapeDesignAttempts, setShapeDesignAttempts] = useState(0);

    // TTS Ref for direct control
    const ttsRef = React.useRef();
    
    // Video Ref for animation control
    const videoRef = React.useRef();

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
        // Use conditional presentation if set, otherwise use normal sequence
        return currentConditionalPresentation || lesson.sequence[currentPresIndex]?.presentationId;
    }, [lesson, currentPresIndex, currentConditionalPresentation]);
    const presentation = useMemo(() => {
        // Check main presentations first, then conditional presentations
        return presentations[presentationId] || conditionalPresentations[presentationId];
    }, [presentationId]);
    const interaction = useMemo(() => presentation?.interactions[currentInteractionIndex], [presentation, currentInteractionIndex]);

    // Helper function to get feedback text from contentData
    const getFeedbackText = useCallback((feedbackInteractionId) => {
        // Check main presentations first
        for (const [presId, pres] of Object.entries(presentations)) {
            const feedbackInteraction = pres.interactions.find(int => int.id === feedbackInteractionId);
            if (feedbackInteraction) {
                return feedbackInteraction.tutorText;
            }
        }
        // Then check conditional presentations
        for (const [presId, pres] of Object.entries(conditionalPresentations)) {
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

        for (const [presId, pres] of Object.entries(conditionalPresentations)) {
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

    const navigateToInteraction = useCallback((interactionId) => {
        console.log(`Looking for interaction: ${interactionId}`);
        // Find the presentation containing this interaction
        for (const [presId, pres] of Object.entries(presentations)) {
            console.log(`Checking presentation: ${presId}`);
            const interactionIndex = pres.interactions.findIndex(int => int.id === interactionId);
            console.log(`Found interaction at index: ${interactionIndex}`);
            if (interactionIndex !== -1) {

                // For normal presentations in the lesson sequence
                const lessonSeqIndex = lesson.sequence.findIndex(seq => seq.presentationId === presId);
                if (lessonSeqIndex !== -1) {
                    console.log(`Found in lesson sequence at: ${lessonSeqIndex}`);
                    setCurrentConditionalPresentation(null); // Clear conditional presentation
                    setCurrentPresIndex(lessonSeqIndex);
                    setCurrentInteractionIndex(interactionIndex);
                    setDynamicTutorText(null);
                    setShowNextButton(false); // Reset button immediately
                    setIsSpeaking(true);
                    return;
                }
            }
        }
        console.warn(`Interaction ${interactionId} not found`);
    }, [lesson]);

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
        setIsWaving(false);
        setShowNextButton(false);
        setDynamicTutorText(null);
        setAnimationTrigger(false);
        setHasUserInteracted(false);
        setActiveFeedbackInteraction(null);
        
        // Reset measurement and perimeter input states
        setMeasurementInput('');
        setPerimeterInput('');
        setPerimeterAttempts(0);
        setShowPerimeterSolution(false);
        setShowSideHighlighting(false);
        setCurrentEquationStep(0);
        
        // Reset shape design state
        setCurrentPerimeter(0);
        setShapeDesignAttempts(0);

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
    }, []);

    const handleDevResetLesson = useCallback(() => {
        setCurrentPresIndex(0);
        setCurrentInteractionIndex(0);
        setCurrentConditionalPresentation(null);
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

    // Shape sorting game intervention callbacks
    const handleShapeHint = useCallback((shapeType) => {
        const hintText = getFeedbackText(`${shapeType}-hint`);
        if (hintText) {
            setDynamicTutorText(hintText);
        }
    }, []);

    const handleShapeAutoHelp = useCallback((shapeType) => {
        const autoHelpText = getFeedbackText(`${shapeType}-auto-help`);
        if (autoHelpText) {
            setDynamicTutorText(autoHelpText);
        }
    }, []);

    const handleShapeCorrection = useCallback((shapeType) => {
        const correctionText = getFeedbackText(`${shapeType}-correction`);
        if (correctionText) {
            setDynamicTutorText(correctionText);
        }
    }, []);

    const handleShapeDesignCheck = () => {
        const targetPerimeter = interaction?.contentProps?.targetPerimeter;
        const feedbackIds = interaction?.contentProps?.feedbackIds;

        if (currentPerimeter === targetPerimeter) {
            // Correct answer
            const feedbackText = getFeedbackText(feedbackIds?.correct);
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setShapeDesignAttempts(0); // Reset for next interaction
        } else {
            // Incorrect answer
            const newAttempts = shapeDesignAttempts + 1;
            setShapeDesignAttempts(newAttempts);

            if (newAttempts === 1) {
                // First incorrect attempt - show hint
                const feedbackText = getFeedbackText(feedbackIds?.hint1);
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 2) {
                // Second incorrect attempt - show second hint
                const feedbackText = getFeedbackText(feedbackIds?.hint2);
                if (feedbackText) {
                    setDynamicTutorText(feedbackText.replace('{currentPerimeter}', currentPerimeter));
                }
            } else if (newAttempts === 3) {
                // Third incorrect attempt - show solution
                const feedbackInteraction = getFeedbackInteraction(feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setShapeDesignAttempts(0); // Reset for next interaction
            }
        }
    };

    const handleMeasurementCheck = () => {
        const userAnswer = parseFloat(measurementInput);
        const correctAnswer = interaction?.contentProps?.correctAnswer;

        handleAnswer({
            interactionId: interaction?.contentProps?.interactionId,
            isCorrect: userAnswer === correctAnswer,
            answer: userAnswer,
        });

        setMeasurementInput(''); // Clear input after check
    };

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
        
        // Reset animation trigger to prevent flicker
        setAnimationTrigger(false);

        // Reset dynamic tutor text when interaction changes
        setDynamicTutorText(null);

        // Reset perimeter input state when interaction changes
        setPerimeterInput('');
        setPerimeterAttempts(0);
        setShowPerimeterSolution(false);
        setShowSideHighlighting(false);
        setCurrentEquationStep(0);

        // Reset shape design state when interaction changes
        setCurrentPerimeter(0);
        setShapeDesignAttempts(0);

        // Reset measurement input state when interaction changes
        setMeasurementInput('');

        // Reset video loop state for new interactions
        if (videoRef.current && interaction?.tutorAnimation && shouldAnimationLoop(interaction.tutorAnimation)) {
            videoRef.current.loop = true;
        }
    }, [interaction]);

    // TTS Callbacks
    const handleTTSEnd = useCallback(() => {
        setIsSpeaking(false);
        setIsWaving(false);

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
            // Check if there's a specific navigation target
            if (currentInteraction?.navigateToInteraction) {
                setTimeout(() => navigateToInteraction(currentInteraction.navigateToInteraction), 500);
            } else {
                setTimeout(advanceToNext, 500);
            }
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
        if (interaction?.type === 'welcome') {
            setIsWaving(true);
        }
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
            // Pass the onAnswer handler to any component that might need it
            onAnswer: handleAnswer,
            // Pass highlighting props for perimeter input interactions
            showSideHighlighting: showSideHighlighting,
            onHighlightComplete: handleHighlightComplete,
            // Pass perimeter callback for shape design components
            onPerimeterCalculated: setCurrentPerimeter,
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
                                            background: '#545E7D'
                                        },
                                        '&:disabled': {
                                            background: '#2C2C2C',
                                            color: '#666',
                                            border: '1px solid #2C2C2C'
                                        }
                                    }}
                                >
                                    Check
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* Shape Design Validation Interface */}
                    {interaction?.type === 'perimeter-design' && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            {/* Show current vs target perimeter */}
                            <Box sx={{ mb: 2, textAlign: 'left' }}>
                                <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.9rem', mb: 1 }}>
                                    Target: {interaction?.contentProps?.targetPerimeter} units
                                </Typography>
                            </Box>
                            
                            {/* Check button */}
                            <Button
                                variant="contained"
                                onClick={handleShapeDesignCheck}
                                sx={{
                                    padding: '8px',
                                    borderRadius: '12px',
                                    background: '#4CAF50',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    minWidth: '140px',
                                    '&:hover': {
                                        background: '#545E7D'
                                    }
                                }}
                            >
                                Check My Shape
                            </Button>
                        </Box>
                    )}

                    {/* Measurement Input Interface */}
                    {interaction?.type === 'shape-measurement' && !isSpeaking && !showNextButton && (
                        <Box sx={{ mb: 3, width: '100%' }}>
                            {/* Input field */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Typography variant="body2" sx={{ color: '#fff', whiteSpace: 'nowrap' }}>
                                    Length =
                                </Typography>
                                <TextField
                                    value={measurementInput}
                                    onChange={(e) => setMeasurementInput(e.target.value)}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    placeholder="e.g., 8"
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
                                            }
                                        }
                                    }}
                                />
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                    cm
                                </Typography>
                            </Box>

                            {/* Check button */}
                            <Button
                                variant="contained"
                                onClick={handleMeasurementCheck}
                                disabled={!measurementInput.trim()}
                                sx={{
                                    padding: '8px',
                                    borderRadius: '12px',
                                    background: '#4CAF50',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    minWidth: '120px',
                                    '&:hover': {
                                        background: '#545E7D'
                                    },
                                    '&:disabled': {
                                        background: '#2C2C2C',
                                        color: '#666',
                                        border: '1px solid #2C2C2C'
                                    }
                                }}
                            >
                                Check
                            </Button>
                        </Box>
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
                                                fontWeight: 'bold',
                                                color: '#fff',
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                textAlign: 'left',
                                                justifyContent: 'flex-start',
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
                                                fontWeight: 'bold',
                                                color: '#fff',
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                textAlign: 'left',
                                                justifyContent: 'flex-start',
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
                        <Button
                            variant="contained"
                            onClick={handleDoneButton}
                            sx={{
                                padding: '8px',
                                borderRadius: '12px',
                                background: '#484D5C',
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '1rem',
                                minWidth: '140px',
                                textAlign: 'center',
                                '&:hover': {
                                    background: '#545E7D'
                                }
                            }}
                        >
                            {(activeFeedbackInteraction || interaction)?.type === 'welcome' ? "Let's Go!" : 
                             (interaction?.transitionType === 'conditional' && interaction?.buttonText ? interaction.buttonText : 
                             ((activeFeedbackInteraction || interaction)?.nextButtonText || "Continue"))}
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
            </div>
            {isMobile && <MobileRestrictionOverlay />}
        </div>
    );
};

export default InteractiveLesson; 
