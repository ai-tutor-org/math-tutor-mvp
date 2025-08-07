import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { lessons, presentations } from '../contentData'; // Import centralized data

import TutorAvatar from '../components/TutorAvatar';
import TTSManager from '../components/TTSManager';

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
    'interactive-question': CrayonMeasurementQuestion
};

const InteractiveLesson = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userName = 'Explorer', lessonId = 'perimeter' } = location.state || {};

    // Lesson State
    const [currentPresIndex, setCurrentPresIndex] = useState(0);
    const [currentInteractionIndex, setCurrentInteractionIndex] = useState(0);

    // UI State
    const [layout, setLayout] = useState('full-screen'); // 'full-screen' or 'dual-panel'
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [dynamicTutorText, setDynamicTutorText] = useState(null); // For answer feedback

    // Data from contentData.js
    const lesson = useMemo(() => lessons[lessonId], [lessonId]);
    const presentationId = useMemo(() => lesson.sequence[currentPresIndex]?.presentationId, [lesson, currentPresIndex]);
    const presentation = useMemo(() => presentations[presentationId], [presentationId]);
    const interaction = useMemo(() => presentation?.interactions[currentInteractionIndex], [presentation, currentInteractionIndex]);

    const advanceToNext = useCallback(() => {
        setAnimationTrigger(false); // Reset trigger for the next interaction

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

    const handleAnimationComplete = useCallback(() => {
        if (interaction?.transitionType === 'manual' && interaction.showNextButton) {
            setShowNextButton(true);
        } else {
            advanceToNext();
        }
    }, [interaction, advanceToNext]);

    const handleAnswer = (answerData) => {
        console.log('Answer selected:', answerData);

        // If this is a crayon measurement question with tutor response
        if (answerData.tutorResponse) {
            // Update the tutor text to the feedback response
            setDynamicTutorText(answerData.tutorResponse);
            // Show the next button to proceed to the next interaction
            setShowNextButton(true);
        } else {
            // For other question types, advance as before
            advanceToNext();
        }
    };

    // Render Content Component
    const renderContent = () => {
        if (!interaction) return null;

        const Component = componentMap[interaction.type];
        if (!Component) return null;

        let props = {
            key: `${currentPresIndex}-${currentInteractionIndex}`,
            ...interaction.contentProps,
            onAnimationComplete: handleAnimationComplete,
            startAnimation: animationTrigger,
        };

        if (interaction.type === 'interactive-question') {
            props.content = interaction.contentProps;
            props.onAnswer = handleAnswer;
        }

        return <Component {...props} />;
    };


    // Effect to handle layout changes and initial setup
    useEffect(() => {
        if (interaction?.layoutChange === 'dual-panel') {
            setLayout('dual-panel');
        }
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

    return (
        <div className={`interactive-lesson-container ${layout === 'full-screen' ? 'fullscreen-view' : ''}`}>
            <TTSManager
                text={tutorText}
                onStart={handleTTSStart}
                onEnd={handleTTSEnd}
            />

            <div className={layout === 'dual-panel' ? 'left-panel' : 'fullscreen-welcome-panel'}>
                <TutorAvatar isWaving={isWaving} isSpeaking={isSpeaking} />
                <div className="tutor-speech-bubble">
                    <p>{tutorText}</p>
                </div>
                <div className="controls-panel">
                    {showNextButton && (
                        <button
                            onClick={advanceToNext}
                            className={`lesson-button ${interaction?.type === 'welcome' ? 'welcome-button' : ''}`}
                        >
                            {interaction?.type === 'welcome' ? "Let's Go!" : (interaction.nextButtonText || "Continue")}
                        </button>
                    )}
                </div>
            </div>

            {layout === 'dual-panel' && (
                <div className="right-panel">
                    <div className="content-panel">
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractiveLesson; 