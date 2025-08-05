import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperclip } from 'react-icons/fa';
import './RulerMeasurement.css';

const RulerMeasurement = ({ startAnimation, onAnimationComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (startAnimation) {
            const timers = [
                setTimeout(() => setStep(1), 500),      // Ruler appears
                setTimeout(() => setStep(2), 2000),     // Zoom in
                setTimeout(() => setStep(3), 4000),     // Paperclip appears
                setTimeout(() => setStep(4), 5000),     // Text appears
                setTimeout(() => onAnimationComplete(), 6500) // End of animation
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [startAnimation, onAnimationComplete]);

    const rulerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const zoomVariants = {
        initial: { scale: 1, x: 0, y: 0 },
        // S=2.5, Rw=502. Shift = (S-1)*Rw/2 = 1.5*502/2 = 376.5px
        zoomed: { scale: 2.5, x: '376.5px', y: '-60px', transition: { duration: 1.5, ease: 'easeInOut' } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const markings = Array.from({ length: 11 }, (_, i) => {
        const isFiveMark = i % 5 === 0;
        const isWholeMark = i % 1 === 0;

        let height = '10px';
        if (isFiveMark) height = '30px';
        else if (isWholeMark) height = '20px';

        return (
            <div key={i} className="ruler-mark-element" style={{ left: `${i * 50}px` }}>
                <div className="ruler-mark-line" style={{ height }}></div>
                {isWholeMark && i < 10 && <span className="ruler-number">{i}</span>}
            </div>
        );
    });

    return (
        <div className="ruler-measurement-container">
            <AnimatePresence>
                {step >= 1 && (
                    <motion.div
                        className="ruler-zoom-container"
                        variants={zoomVariants}
                        animate={step >= 2 ? 'zoomed' : 'initial'}
                    >
                        <motion.div className="ruler" variants={rulerVariants} initial="hidden" animate="visible">
                            {/* The markings are now direct children */}
                            {markings}
                            {step >= 3 && (
                                <motion.div className="paperclip-container" variants={itemVariants} initial="hidden" animate="visible">
                                    <FaPaperclip className="paperclip-icon" />
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {step >= 4 && (
                    <motion.p className="measurement-text" variants={itemVariants} initial="hidden" animate="visible">
                        This paperclip is 3 cm long.
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RulerMeasurement; 