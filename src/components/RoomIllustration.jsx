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
}) => {
    const [stepCounter, setStepCounter] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

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
            positions.push(wallThickness + slotStart + footOffsetInSlot);
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


    return (
        <div className="room-illustration-container">
            <div className="room-rectangle">
                {previousResultText && <div className="previous-result-text">{previousResultText}</div>}

                {totalSteps === 0 && !isAnimating && (
                    <motion.div className="flashing-question-mark"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <FaQuestion />
                    </motion.div>
                )}

                <AnimatePresence>
                    {Array.from({ length: stepCounter }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="foot" // Corrected class name
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
            </div>
            <div className="footstep-counter">{stepCounter > 0 && `${stepCounter} step${stepCounter > 1 ? 's' : ''} taken`}</div>

            {isAnimating && (
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