import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TutorAvatar from '../components/TutorAvatar';
import TTSManager from '../components/TTSManager';
import RoomIllustration from '../components/RoomIllustration';
import ConflictingMeasurements from '../components/ConflictingMeasurements';
import StandardUnits from '../components/StandardUnits';
import './InteractiveLesson.css'; // Import the new CSS file

const InteractiveLesson = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userName } = location.state || { userName: 'Explorer' };

    const [currentInteraction, setCurrentInteraction] = useState(0);
    const [currentTTSText, setCurrentTTSText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [showDualPanel, setShowDualPanel] = useState(false);
    const [showWelcomeButton, setShowWelcomeButton] = useState(false);
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const interactionRef = useRef(currentInteraction);

    const [interactionState, setInteractionState] = useState({
        nextButtonDisabled: true,
    });

    const interactions = useMemo(() => [
        {
            id: 0,
            type: 'welcome',
            tutorText: `Hey there, ${userName}! I'm Vyas, your personal tutor. 😊 I'm so excited to explore the world of shapes and sizes with you. Ready to start our first adventure?`,
            content: null,
            transitionType: 'manual',
        },
        {
            id: 1,
            type: 'tutor-monologue',
            tutorText: "Awesome! Now I'm going to move over here to the left side so we can see our learning space better!",
            content: null,
            transitionType: 'auto',
            layoutChange: 'dual-panel',
        },
        {
            id: 2,
            type: 'room-question',
            tutorText: "Perfect! Let's start with a simple question. Imagine this is your room. How would you figure out how long it is from one wall to the other?",
            content: <RoomIllustration />,
            transitionType: 'auto',
        },
        {
            id: 3,
            type: 'footsteps-animation',
            tutorText: "A common way is to use footsteps! Let's try it. I'll walk from one side to the other and count my steps.",
            content: <RoomIllustration />,
            transitionType: 'auto',
        },
        {
            id: 4,
            type: 'footsteps-animation-friend',
            tutorText: "Okay, so the room is 10 steps long. Simple enough! But wait... here comes my friend, who has much bigger feet. Let's see what happens when he measures the room.",
            content: (
                <RoomIllustration
                    totalSteps={8}
                    footIconSize={40}
                    footIconColor="#A1887F"
                    previousResultText="You: 10 steps"
                />
            ),
            transitionType: 'manual',
            showNextButton: true,
            nextButtonText: 'Next',
            nextButtonDisabled: true,
        },
        {
            id: 5,
            type: 'conflicting-measurements',
            tutorText: "Hold on. One person says the room is 10 steps long, and another says it's 8 steps long. But the room didn't change! Who is right? This is confusing, isn't it?",
            content: <ConflictingMeasurements />,
            transitionType: 'auto',
        },
        {
            id: 6,
            type: 'standard-units-explanation',
            tutorText: "To solve this problem, people all over the world agreed to use standard units. This means everyone's 'footstep' is the exact same size, so we always get the same answer!",
            content: <StandardUnits />,
            transitionType: 'manual', // Will pause here for the next step
            showNextButton: true,
            nextButtonText: 'Continue',
            nextButtonDisabled: true,
        },
    ], [userName]);

    const safeCurrentInteraction = Math.min(currentInteraction, interactions.length - 1);
    const currentInteractionData = interactions[safeCurrentInteraction];

    useEffect(() => {
        // This effect runs only once on mount and cleans up on unmount.
        // It's a failsafe to ensure speech is cancelled when navigating away.
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []); // Empty dependency array is crucial here.

    useEffect(() => {
        const interactionData = interactions[currentInteraction];
        if (!interactionData) return;

        setInteractionState({
            nextButtonDisabled: interactionData.nextButtonDisabled !== false,
        });

        if (interactionData.layoutChange === 'dual-panel' && !showDualPanel) {
            setShowDualPanel(true);
        }

        if (interactionData.tutorText) {
            setCurrentTTSText(interactionData.tutorText);
        } else {
            setCurrentTTSText('');
        }
    }, [currentInteraction, interactions]);

    const handleTTSEnd = useCallback(() => {
        if (interactionRef.current !== currentInteraction) {
            console.log("TTSManager end event for a stale interaction. Ignoring.", { current: interactionRef.current, active: currentInteraction });
            return;
        }

        setIsSpeaking(false);
        setIsWaving(false);

        const currentData = interactions[currentInteraction];
        const isAnimationInteraction = currentData?.type === 'footsteps-animation' || currentData?.type === 'footsteps-animation-friend';

        if (isAnimationInteraction) {
            setAnimationTrigger(true);
        }

        // Handle auto-transitions after a brief pause, but NOT for animations (they have their own trigger)
        if (currentData?.transitionType === 'auto' && !isAnimationInteraction) {
            setTimeout(() => {
                const nextInteraction = currentInteraction + 1;
                if (nextInteraction < interactions.length) {
                    setCurrentInteraction(nextInteraction);
                }
            }, 500);
        } else if (currentData?.type === 'welcome') {
            // For the welcome message, show the button after speech
            setTimeout(() => setShowWelcomeButton(true), 500);
        }
    }, [currentInteraction, interactions]);

    const handleTTSStart = useCallback(() => {
        interactionRef.current = currentInteraction;
        setIsSpeaking(true);
        if (interactions[currentInteraction]?.type === 'welcome') {
            setIsWaving(true);
        }
    }, [currentInteraction, interactions]);

    const handleTTSError = useCallback((error) => {
        console.error("TTS Error:", error);
        if (error.toString().toLowerCase() !== 'interrupted') {
            setTtsEnabled(false);
        }
        handleTTSEnd();
    }, [handleTTSEnd]);

    const handleButtonClick = useCallback(() => {
        if (currentInteractionData?.type === 'welcome') {
            setShowWelcomeButton(false);
            setCurrentInteraction(1);
        } else {
            const nextInteraction = currentInteraction + 1;
            if (nextInteraction < interactions.length) {
                setCurrentInteraction(nextInteraction);
                setAnimationTrigger(false);
            } else {
                console.log("End of lesson.");
                navigate('/');
            }
        }
    }, [currentInteraction, interactions.length, navigate, currentInteractionData]);

    const handleAnimationComplete = useCallback(() => {
        console.log("Animation complete for interaction:", currentInteractionData?.type);
        setAnimationTrigger(false); // Reset trigger

        // This logic correctly handles both auto and manual transitions.
        // For 'manual', it enables the button. For 'auto', it proceeds.
        if (currentInteractionData?.transitionType === 'auto') {
            const nextInteraction = currentInteraction + 1;
            if (nextInteraction < interactions.length) {
                setCurrentInteraction(nextInteraction);
            }
        } else if (currentInteractionData?.transitionType === 'manual') {
            // Only enable the button, don't transition
            setInteractionState(prev => ({ ...prev, nextButtonDisabled: false }));
        }
    }, [currentInteraction, interactions.length, currentInteractionData]);


    const TutorPanelContent = () => (
        <>
            <TutorAvatar isWaving={isWaving} isSpeaking={isSpeaking} />
            <div className="tutor-speech-bubble">
                <p>{currentTTSText}</p>
            </div>
            <div className="controls-panel">
                {currentInteractionData?.type === 'welcome' && showWelcomeButton && (
                    <button onClick={handleButtonClick} className="lesson-button welcome-button">
                        Let's Go!
                    </button>
                )}
                {currentInteractionData?.showNextButton && (
                    <button
                        onClick={handleButtonClick}
                        className="lesson-button"
                        disabled={interactionState.nextButtonDisabled}
                    >
                        {currentInteractionData.nextButtonText}
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className={`interactive-lesson-container ${!showDualPanel ? 'fullscreen-view' : ''}`}>
            <TTSManager text={ttsEnabled ? currentTTSText : ''} onStart={handleTTSStart} onEnd={handleTTSEnd} onError={handleTTSError} />

            {showDualPanel ? (
                <>
                    <div className="left-panel">
                        <TutorPanelContent />
                    </div>
                    <div className="right-panel">
                        <div className="content-panel">
                            <AnimatePresence mode="wait">
                                {currentInteractionData.content && React.cloneElement(currentInteractionData.content, {
                                    key: currentInteraction, // Ensures component re-mounts on interaction change
                                    startAnimation: animationTrigger,
                                    onAnimationComplete: handleAnimationComplete
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </>
            ) : (
                <div className="fullscreen-welcome-panel">
                    <TutorPanelContent />
                </div>
            )}
        </div>
    );
};

export default InteractiveLesson; 