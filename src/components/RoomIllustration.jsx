import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoePrints, FaPlus } from 'react-icons/fa';
import './RoomIllustration.css';

const RoomIllustration = ({
    totalSteps = 0,
    footIconColor = '#000',
    previousResultText = '',
    buttonText = 'Take a Step',
    startAnimation = false,
    onAnimationComplete,
    showBothFootsteps = false,
    showPersistentSteps = false,
    persistentStepsData = null,
    yourSteps = 10,
    friendSteps = 8,
    yourFootColor = '#4A90E2',
    friendFootColor = '#e24a4a'
}) => {
    const [stepCounter, setStepCounter] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [firstPersonSteps, setFirstPersonSteps] = useState([]);

    // --- Final Corrected Sizing and Positioning Logic ---

    const { dynamicFootSize, stepPositions } = useMemo(() => {
        // SVG inner room dimensions (from the SVG viewBox and inner rectangle)
        const svgWidth = 500;
        const svgHeight = 314;
        const innerRoomLeft = (47.8 / 578) * svgWidth; // ~41px
        const innerRoomWidth = (482.4 / 578) * svgWidth; // ~417px
        const availableWidth = innerRoomWidth - 20; // Some padding

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
            const slotStart = innerRoomLeft + 10 + (i * slotWidth); // Start from inner room + padding
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
            // Capture the first person's steps for persistence
            const steps = Array.from({ length: totalSteps }, (_, i) => ({
                id: `first-${i}`,
                position: stepPositions[i],
                color: footIconColor,
                size: dynamicFootSize
            }));
            setFirstPersonSteps(steps);
            setIsAnimating(false);
            setTimeout(() => {
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }, 1000); // Brief pause to show completion
        }
    }, [stepCounter, totalSteps, onAnimationComplete, isAnimating, stepPositions, footIconColor, dynamicFootSize]);


    const handleStepClick = () => {
        if (stepCounter < totalSteps) {
            setStepCounter(prev => prev + 1);
        }
    };


    // Calculate footstep positions for both sets when showBothFootsteps is true
    const { yourFootSize, yourPositions, friendFootSize, friendPositions } = useMemo(() => {
        if (!showBothFootsteps) return { yourFootSize: 0, yourPositions: [], friendFootSize: 0, friendPositions: [] };

        // SVG inner room dimensions
        const svgWidth = 500;
        const innerRoomLeft = (47.8 / 578) * svgWidth; // ~41px
        const innerRoomWidth = (482.4 / 578) * svgWidth; // ~417px
        const availableWidth = innerRoomWidth - 20; // Some padding

        // Your steps calculation
        const yourSlotWidth = availableWidth / yourSteps;
        const yourFootSizeCalc = yourSlotWidth * 0.8; // Slightly smaller for better visibility
        const yourPositionsCalc = [];
        for (let i = 0; i < yourSteps; i++) {
            const slotStart = innerRoomLeft + 10 + (i * yourSlotWidth);
            const footOffsetInSlot = (yourSlotWidth - yourFootSizeCalc) / 2;
            yourPositionsCalc.push(slotStart + footOffsetInSlot);
        }

        // Friend's steps calculation
        const friendSlotWidth = availableWidth / friendSteps;
        const friendFootSizeCalc = friendSlotWidth * 0.8;
        const friendPositionsCalc = [];
        for (let i = 0; i < friendSteps; i++) {
            const slotStart = innerRoomLeft + 10 + (i * friendSlotWidth);
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
            <div className="room-svg-container">
                <svg width="500" height="314" viewBox="0 0 578 362" fill="none" xmlns="http://www.w3.org/2000/svg" className="room-svg">
                    <rect x="1" y="1" width="576" height="360" fill="#F39A65"/>
                    <rect x="47.8001" y="47.8001" width="482.4" height="266.4" fill="#F6EFE2" stroke="#AA6C47" strokeWidth="1.44"/>
                    <path d="M47.08 47.08L1 1" stroke="#AA6C47" strokeWidth="1.44"/>
                    <path d="M577 361L530.92 314.92" stroke="#AA6C47" strokeWidth="1.44"/>
                    <path d="M530.92 47.08L577 1" stroke="#AA6C47" strokeWidth="1.44"/>
                    <path d="M47.08 314.92L1 361" stroke="#AA6C47" strokeWidth="1.44"/>
                    <path d="M215.56 12.5195H366.76L352.36 35.5595H228.52L215.56 12.5195Z" fill="white"/>
                    <path d="M265 356H313L309.757 315H267.595L265 356Z" fill="white"/>
                    <path d="M48.52 182.44L62.92 190.754V174.127L48.52 182.44ZM530.92 182.44L516.52 174.127V190.754L530.92 182.44ZM61.48 182.44V183.88H517.96V182.44V181H61.48V182.44Z" fill="#EB5757"/>
                    <rect width="18.72" height="31.68" transform="translate(280.36 165.16)" fill="#F6EFE2"/>
                    <path d="M287.099 185.041C287.099 183.843 287.249 182.864 287.549 182.103C287.871 181.32 288.286 180.675 288.793 180.168C289.3 179.661 289.83 179.223 290.383 178.855C290.935 178.463 291.454 178.083 291.938 177.714C292.445 177.322 292.859 176.862 293.182 176.332C293.504 175.802 293.666 175.134 293.666 174.327C293.666 173.429 293.297 172.691 292.56 172.115C291.823 171.539 290.935 171.251 289.899 171.251C289.161 171.251 288.47 171.401 287.825 171.701C287.203 172 286.673 172.438 286.235 173.014C285.798 173.567 285.51 174.235 285.371 175.018L284.991 175.088L281.466 174.362C281.696 172.956 282.203 171.735 282.987 170.698C283.793 169.662 284.784 168.867 285.959 168.314C287.157 167.738 288.459 167.45 289.864 167.45C291.408 167.45 292.79 167.749 294.011 168.348C295.232 168.924 296.2 169.731 296.914 170.768C297.629 171.804 297.986 173.002 297.986 174.362C297.986 175.445 297.813 176.355 297.467 177.092C297.145 177.806 296.719 178.417 296.189 178.924C295.659 179.408 295.094 179.845 294.495 180.237C293.919 180.629 293.355 181.032 292.802 181.447C292.272 181.861 291.834 182.357 291.488 182.933C291.166 183.509 291.005 184.211 291.005 185.041H287.099ZM289.069 192.471C288.332 192.471 287.698 192.218 287.168 191.711C286.662 191.204 286.408 190.582 286.408 189.845C286.408 189.13 286.662 188.52 287.168 188.013C287.698 187.506 288.332 187.253 289.069 187.253C289.783 187.253 290.394 187.506 290.901 188.013C291.408 188.52 291.661 189.13 291.661 189.845C291.661 190.582 291.408 191.204 290.901 191.711C290.394 192.218 289.783 192.471 289.069 192.471Z" fill="#EB5757"/>
                </svg>

                {previousResultText && <div className="previous-result-text">{previousResultText}</div>}

                {/* Show persistent first person steps (always visible once completed or when persistentStepsData is provided) */}
                {(persistentStepsData || firstPersonSteps.length > 0) && (() => {
                    const stepsToShow = persistentStepsData || firstPersonSteps;
                    return stepsToShow.map((step, i) => (
                        <motion.div
                            key={step.id || `persistent-${i}`}
                            className="foot persistent-foot"
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                left: `${step.position}px`,
                                top: '90px',
                                fontSize: `${step.size}px`,
                                color: step.color,
                                width: `${step.size}px`,
                                height: `${step.size}px`
                            }}
                        >
                            <FaShoePrints style={{ width: '100%', height: '100%' }} />
                        </motion.div>
                    ));
                })()}

                {/* Show both footsteps when showBothFootsteps is true */}
                {showBothFootsteps && (
                    <>
                        {/* Your footsteps (first person) - only render if not already shown as persistent */}
                        {!persistentStepsData && firstPersonSteps.length === 0 && yourPositions.map((xPos, i) => (
                            <motion.div
                                key={`your-${i}`}
                                className="foot your-foot"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    left: `${xPos}px`,
                                    top: '90px',
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
                        {friendPositions.map((xPos, i) => (
                            <motion.div
                                key={`friend-${i}`}
                                className="foot friend-foot"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: (yourSteps * 0.1) + (i * 0.1) }}
                                style={{
                                    left: `${xPos}px`,
                                    top: '220px',
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

                {/* Regular animation footsteps - only show during active animation, not when persistent */}
                {!showBothFootsteps && firstPersonSteps.length === 0 && (
                    <AnimatePresence>
                        {Array.from({ length: stepCounter }).map((_, i) => (
                            <motion.div
                                key={i}
                                className={`foot ${footIconColor === '#e24a4a' ? 'friend-foot-regular' : ''}`}
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


            {/* Step counters for showBothFootsteps mode */}
            {showBothFootsteps && (
                <div className="step-counters-container">
                    <div className="step-counter-wrapper">
                        <div className="step-counter-display you">
                            {yourSteps} step{yourSteps !== 1 ? 's' : ''}
                        </div>
                        <div className="step-counter-label">You</div>
                    </div>
                    <div className="step-counter-wrapper">
                        <div className="step-counter-display friend">
                            {friendSteps} step{friendSteps !== 1 ? 's' : ''}
                        </div>
                        <div className="step-counter-label">Friend</div>
                    </div>
                </div>
            )}

            {isAnimating && !showBothFootsteps && (
                <div className="interaction-controls">
                    <button
                        onClick={handleStepClick}
                        className="step-button"
                        disabled={stepCounter >= totalSteps}
                    >
                        <span>{stepCounter} step{stepCounter !== 1 ? 's' : ''}</span>
                        <div className="step-button-icon">
                            <FaPlus />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default RoomIllustration; 