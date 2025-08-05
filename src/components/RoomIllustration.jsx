import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RoomIllustration.css';
import { FaShoePrints } from 'react-icons/fa';

const RoomIllustration = ({
    startAnimation = false,
    onAnimationComplete,
    totalSteps = 10,
    footIconSize = 24,
    footIconColor = '#333',
    previousResultText = null,
}) => {
    const [stepCounter, setStepCounter] = useState(0);
    const [isInteractive, setIsInteractive] = useState(false);
    const [showPreviousResult, setShowPreviousResult] = useState(false);

    useEffect(() => {
        if (startAnimation) {
            setStepCounter(0);
            setIsInteractive(true);
        }
    }, [startAnimation]);

    useEffect(() => {
        if (previousResultText) {
            setShowPreviousResult(true);
        }
    }, [previousResultText]);

    useEffect(() => {
        // When all steps are completed, automatically move to next interaction
        if (stepCounter === totalSteps && stepCounter > 0) {
            setTimeout(() => {
                setIsInteractive(false);
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }, 1000); // Brief pause to show completion
        }
    }, [stepCounter, totalSteps, onAnimationComplete]);

    const handleTakeStep = () => {
        if (stepCounter < totalSteps) {
            setStepCounter(prev => prev + 1);
        }
    };

    const xPos = (index) => {
        const roomWidth = 500;
        const wallThickness = 10;
        if (totalSteps <= 1) {
            return wallThickness + (roomWidth / 2) - (footIconSize / 2);
        }
        const totalIconWidth = totalSteps * footIconSize;
        const remainingSpace = roomWidth - totalIconWidth;
        const gap = remainingSpace / (totalSteps - 1);
        return wallThickness + index * (footIconSize + gap);
    };

    const currentResultText = stepCounter > 0 ? `${stepCounter} step${stepCounter > 1 ? 's' : ''}` : 'Ready to start!';

    return (
        <div className="room-illustration-container">
            <div className="counters-container">
                <div className="step-counter">
                    {currentResultText}
                </div>
            </div>

            <div className="room-rectangle">
                {!startAnimation && !previousResultText && (
                    <>
                        <div className="dimension-line"></div>
                        <div className="question-mark">?</div>
                    </>
                )}

                <div className="feet-container">
                    <AnimatePresence>
                        {Array.from({ length: stepCounter }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="foot"
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    left: `${xPos(i)}px`,
                                    fontSize: `${footIconSize}px`,
                                    color: footIconColor,
                                }}
                            >
                                <FaShoePrints />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {previousResultText && (
                    <div className="previous-step-counter">
                        {previousResultText}
                    </div>
                )}
            </div>

            {isInteractive && stepCounter < totalSteps && (
                <div className="interactive-controls">
                    <button
                        className="step-button"
                        onClick={handleTakeStep}
                    >
                        Take a Step
                    </button>
                </div>
            )}

            {stepCounter === totalSteps && stepCounter > 0 && (
                <div className="completion-message">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="completion-text"
                    >
                        Great! You walked {totalSteps} steps across the room!
                    </motion.p>
                </div>
            )}

            <p className="room-label">
                {isInteractive ? `Click the button to take each step!` : 'A top-down view of a room'}
            </p>
        </div>
    );
};

export default RoomIllustration; 