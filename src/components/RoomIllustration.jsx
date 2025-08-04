import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
    const [animationComplete, setAnimationComplete] = useState(false);
    const [showPreviousResult, setShowPreviousResult] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        if (startAnimation) {
            setStepCounter(0);
            setAnimationComplete(false);
            controls.start("visible");

            // This is a visual trick, the counter updates based on the expected
            // animation delay of each footstep.
            for (let i = 1; i <= totalSteps; i++) {
                setTimeout(() => setStepCounter(i), i * 300);
            }

        } else {
            controls.set("hidden");
        }
    }, [startAnimation, controls, totalSteps]);

    useEffect(() => {
        if (previousResultText) {
            setShowPreviousResult(true);
            setAnimationComplete(true);
        }
    }, [previousResultText]);

    const currentResultText = stepCounter > 0 ? `${stepCounter} step${stepCounter > 1 ? 's' : ''}` : 'Counting...';

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const footVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="room-illustration-container">
            <div className="counters-container">
                {stepCounter > 0 && !animationComplete && (
                    <motion.div
                        key={stepCounter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="step-counter"
                    >
                        {stepCounter}
                    </motion.div>
                )}
                {animationComplete && (
                    <div className="step-counter final">
                        {currentResultText}
                    </div>
                )}
            </div>
            <div className="room-rectangle">
                {!startAnimation && !previousResultText && (
                    <>
                        <div className="dimension-line"></div>
                        <div className="question-mark">?</div>
                    </>
                )}
                <motion.div
                    className="feet-container"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    onAnimationComplete={() => {
                        if (startAnimation) {
                            setAnimationComplete(true);
                            if (onAnimationComplete) {
                                setTimeout(onAnimationComplete, 500);
                            }
                        }
                    }}
                >
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="foot"
                            variants={footVariants}
                            style={{
                                left: `${xPos(i)}px`,
                                fontSize: `${footIconSize}px`,
                                color: footIconColor,
                            }}
                        >
                            <FaShoePrints />
                        </motion.div>
                    ))}
                </motion.div>

                {previousResultText && (
                    <div className="previous-step-counter">
                        {previousResultText}
                    </div>
                )}
            </div>

            <p className="room-label">
                {startAnimation ? `Walking across the room...` : 'A top-down view of a room'}
            </p>
        </div>
    );
};

export default RoomIllustration; 