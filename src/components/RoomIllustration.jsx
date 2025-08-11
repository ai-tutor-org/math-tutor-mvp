import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoePrints, FaQuestion } from 'react-icons/fa';
import './RoomIllustration.css';

const RoomIllustration = ({
    totalSteps = 0,
    footIconColor = '#000',
    previousResultText = '',
    buttonText = 'Take a Step',
    startAnimation = false,
    onAnimationComplete,
    showBothFootsteps = false,
    yourSteps = 10,
    friendSteps = 8,
    yourFootColor = '#4A90E2',
    friendFootColor = '#e24a4a',
    showQuestion = false,
    question = '',
    choices = [],
    onAnswer = () => { }
}) => {
    const [stepCounter, setStepCounter] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);

    // --- Final Corrected Sizing and Positioning Logic ---

    const { dynamicFootSize, stepPositions } = useMemo(() => {
        const roomWidth = 500;
        const wallThickness = 10;
        const availableWidth = roomWidth - (wallThickness * 2); // 480px

        if (totalSteps <= 0) {
            return { dynamicFootSize: 0, stepPositions: [] };
        }

        // 1. Calculate the width of each step's "slot".
        const slotWidth = availableWidth / totalSteps;

        // 2. The foot icon size is 90% of the slot to create small, consistent gaps.
        const footSize = slotWidth * 0.9;

        // 3. Position each foot in the center of its slot.
        const positions = [];
        for (let i = 0; i < totalSteps; i++) {
            const slotStart = i * slotWidth;
            const footOffsetInSlot = (slotWidth - footSize) / 2;
            positions.push(slotStart + footOffsetInSlot);
        }

        return { dynamicFootSize: footSize, stepPositions: positions };

    }, [totalSteps]);

    const xPos = (index) => {
        return stepPositions[index] || 0;
    };

    // --- End of Corrected Logic ---


    useEffect(() => {
        if (startAnimation) {
            setStepCounter(0); // Reset for new animation
            setIsAnimating(true);
        }
    }, [startAnimation]);

    useEffect(() => {
        // When all steps are completed, automatically move to the next interaction
        if (isAnimating && stepCounter === totalSteps && totalSteps > 0) {
            setIsAnimating(false);
            setTimeout(() => {
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }, 1000); // Brief pause to show completion
        }
    }, [stepCounter, totalSteps, onAnimationComplete, isAnimating]);


    const handleStepClick = () => {
        if (stepCounter < totalSteps) {
            setStepCounter(prev => prev + 1);
        }
    };

    const handleChoiceClick = (choice, index) => {
        console.log('Choice clicked:', choice);
        console.log('Choice index:', index);
        setSelectedChoice(index);
        onAnswer(choice);
    };

    // Calculate footstep positions for both sets when showBothFootsteps is true
    const { yourFootSize, yourPositions, friendFootSize, friendPositions } = useMemo(() => {
        if (!showBothFootsteps) return { yourFootSize: 0, yourPositions: [], friendFootSize: 0, friendPositions: [] };

        const roomWidth = 500;
        const wallThickness = 10;
        const availableWidth = roomWidth - (wallThickness * 2); // 480px
        const roomHeight = 200;
        const yourRowY = roomHeight * 0.3; // Top row for your steps
        const friendRowY = roomHeight * 0.7; // Bottom row for friend's steps

        // Your steps calculation
        const yourSlotWidth = availableWidth / yourSteps;
        const yourFootSizeCalc = yourSlotWidth * 0.8; // Slightly smaller for better visibility
        const yourPositionsCalc = [];
        for (let i = 0; i < yourSteps; i++) {
            const slotStart = i * yourSlotWidth;
            const footOffsetInSlot = (yourSlotWidth - yourFootSizeCalc) / 2;
            yourPositionsCalc.push(slotStart + footOffsetInSlot);
        }

        // Friend's steps calculation
        const friendSlotWidth = availableWidth / friendSteps;
        const friendFootSizeCalc = friendSlotWidth * 0.8;
        const friendPositionsCalc = [];
        for (let i = 0; i < friendSteps; i++) {
            const slotStart = i * friendSlotWidth;
            const footOffsetInSlot = (friendSlotWidth - friendFootSizeCalc) / 2;
            friendPositionsCalc.push(slotStart + footOffsetInSlot);
        }

        return {
            yourFootSize: yourFootSizeCalc,
            yourPositions: yourPositionsCalc,
            friendFootSize: friendFootSizeCalc,
            friendPositions: friendPositionsCalc
        };
    }, [showBothFootsteps, yourSteps, friendSteps]);


    return (
        <div className="room-illustration-container">
            <div className="room-rectangle">
                {previousResultText && <div className="previous-result-text">{previousResultText}</div>}

                {totalSteps === 0 && !isAnimating && !showBothFootsteps && (
                    <motion.div className="flashing-question-mark"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <FaQuestion />
                    </motion.div>
                )}

                {/* Show both footsteps when showBothFootsteps is true */}
                {showBothFootsteps && (
                    <>
                        {/* Your footsteps */}
                        <div className="footstep-label your-label">You: {yourSteps} steps</div>
                        {yourPositions.map((xPos, i) => (
                            <motion.div
                                key={`your-${i}`}
                                className="foot your-foot"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    left: `${xPos}px`,
                                    top: '50px',
                                    fontSize: `${yourFootSize}px`,
                                    color: yourFootColor,
                                    width: `${yourFootSize}px`,
                                    height: `${yourFootSize}px`
                                }}
                            >
                                <FaShoePrints style={{ width: '100%', height: '100%' }} />
                            </motion.div>
                        ))}

                        {/* Friend's footsteps */}
                        <div className="footstep-label friend-label">Friend: {friendSteps} steps</div>
                        {friendPositions.map((xPos, i) => (
                            <motion.div
                                key={`friend-${i}`}
                                className="foot friend-foot"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (yourSteps * 0.1) + (i * 0.1) }}
                                style={{
                                    left: `${xPos}px`,
                                    top: '120px',
                                    fontSize: `${friendFootSize}px`,
                                    color: friendFootColor,
                                    width: `${friendFootSize}px`,
                                    height: `${friendFootSize}px`
                                }}
                            >
                                <FaShoePrints style={{ width: '100%', height: '100%' }} />
                            </motion.div>
                        ))}
                    </>
                )}

                {/* Regular animation footsteps */}
                {!showBothFootsteps && (
                    <AnimatePresence>
                        {Array.from({ length: stepCounter }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="foot"
                                initial={{ opacity: 0, x: xPos(i) }}
                                animate={{ opacity: 1, x: xPos(i) }}
                                exit={{ opacity: 0 }}
                                style={{
                                    fontSize: `${dynamicFootSize}px`,
                                    color: footIconColor,
                                    width: `${dynamicFootSize}px`,
                                    height: `${dynamicFootSize}px`
                                }}
                            >
                                <FaShoePrints style={{ width: '100%', height: '100%' }} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <div className="footstep-counter">{stepCounter > 0 && `${stepCounter} step${stepCounter > 1 ? 's' : ''} taken`}</div>

            {/* Question section */}
            {showQuestion && (
                <div className="question-section">
                    <h3 className="question-text">{question}</h3>
                    <div className="choices-container">
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                className={`choice-button ${selectedChoice === index ? 'selected' : ''}`}
                                onClick={() => handleChoiceClick(choice, index)}
                            >
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isAnimating && !showBothFootsteps && (
                <div className="interaction-controls">
                    <button
                        onClick={handleStepClick}
                        className="lesson-button"
                        disabled={stepCounter >= totalSteps}
                    >
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RoomIllustration; 