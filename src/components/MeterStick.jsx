import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDoorOpen } from 'react-icons/fa';
import './MeterStick.css';

const MeterStick = ({ startAnimation, onAnimationComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (startAnimation) {
            const timers = [
                setTimeout(() => setStep(1), 500),      // Door appears first
                setTimeout(() => setStep(2), 1500),     // Meter stick animates after
                setTimeout(() => onAnimationComplete(), 4000) // End of animation
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [startAnimation, onAnimationComplete]);

    const stickVariants = {
        hidden: { height: 0 },
        visible: { height: '100%', transition: { duration: 2, ease: 'easeOut' } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    };

    const markings = Array.from({ length: 11 }, (_, i) => {
        const position = i * 10;
        return (
            <div key={i} className="meter-mark-container" style={{ bottom: `${position}%` }}>
                <div className="meter-mark-line"></div>
                {i > 0 && <span className="meter-mark-number">{position}</span>}
            </div>
        );
    });

    return (
        <div className="meter-stick-container">
            <AnimatePresence>
                {step >= 1 && (
                    <motion.div className="door-container" variants={itemVariants} initial="hidden" animate="visible">
                        <FaDoorOpen className="door-icon" />
                        <span className="measurement-label">1m = 100cm</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="meter-stick-visuals">
                <motion.div
                    className="meter-stick"
                    variants={stickVariants}
                    initial="hidden"
                    animate={step >= 2 ? 'visible' : 'hidden'}
                >
                    <AnimatePresence>
                        {step >= 2 && markings.map((mark, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.1, delay: (i + 1) * 0.18 }}
                            >
                                {mark}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default MeterStick; 