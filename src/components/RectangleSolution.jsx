import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './RectangleSolution.css';

const RectangleSolution = ({ onAnswerSubmit }) => {
    const [highlightedSide, setHighlightedSide] = useState(null);
    const [showLabels, setShowLabels] = useState({});

    useEffect(() => {
        const sequence = [
            { side: 'top', delay: 4000, label: '30m' },
            { side: 'right', delay: 5000, label: '20m' }, 
            { side: 'bottom', delay: 6000, label: '30m' },
            { side: 'left', delay: 7000, label: '20m' }
        ];

        const timeouts = sequence.map(({ side, delay, label }) => 
            setTimeout(() => {
                setHighlightedSide(side);
                setShowLabels(prev => ({ ...prev, [side]: label }));
            }, delay)
        );

        return () => timeouts.forEach(clearTimeout);
    }, []);

    const getSideCoordinates = (side) => {
        const coords = {
            top: { x1: 95, y1: 65, x2: 'calc(100% - 90px)', y2: 65 },
            right: { x1: 'calc(100% - 90px)', y1: 65, x2: 'calc(100% - 90px)', y2: 'calc(100% - 80px)' },
            bottom: { x1: 'calc(100% - 90px)', y1: 'calc(100% - 80px)', x2: 95, y2: 'calc(100% - 80px)' },
            left: { x1: 95, y1: 'calc(100% - 80px)', x2: 95, y2: 65 }
        };
        return coords[side];
    };

    const getLabelPosition = (side) => {
        const positions = {
            top: { x: '50%', y: '45px', transform: 'translateX(-50%)' },
            right: { x: 'calc(100% - 60px)', y: '50%', transform: 'translateY(-50%)' },
            bottom: { x: '50%', y: 'calc(100% - 30px)', transform: 'translateX(-50%)' },
            left: { x: '60px', y: '50%', transform: 'translateY(-50%)' }
        };
        return positions[side];
    };

    return (
        <motion.div
            className="rectangle-solution-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="farm-image-container">
                <img
                    src="/math-tutor-mvp/assets/farmer-mission/farm-map.png"
                    alt="Farmer Giles' rectangular farm"
                    className="farm-map-solution"
                />
                
                <svg width="100%" height="100%" className="solution-svg">
                    {['top', 'right', 'bottom', 'left'].map((side) => {
                        const coords = getSideCoordinates(side);
                        return (
                            <motion.line
                                key={side}
                                x1={coords.x1}
                                y1={coords.y1}
                                x2={coords.x2}
                                y2={coords.y2}
                                fill="none"
                                strokeWidth="8"
                                strokeLinecap="round"
                                initial={{ 
                                    stroke: '#fbbf24', 
                                    opacity: 0.4,
                                    pathLength: 0 
                                }}
                                animate={{
                                    stroke: highlightedSide === side ? '#f59e0b' : '#fbbf24',
                                    opacity: highlightedSide === side ? 1 : 0.4,
                                    pathLength: highlightedSide === side ? 1 : 0.8,
                                    strokeWidth: highlightedSide === side ? 12 : 8
                                }}
                                transition={{ 
                                    duration: 0.8, 
                                    ease: "easeInOut",
                                    pathLength: { duration: 1.2 }
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Side labels */}
                {Object.entries(showLabels).map(([side, label]) => {
                    const position = getLabelPosition(side);
                    return (
                        <motion.div
                            key={side}
                            className={`side-label ${side}-label`}
                            style={position}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ 
                                opacity: highlightedSide === side ? 1 : 0.7,
                                scale: highlightedSide === side ? 1.1 : 1
                            }}
                            transition={{ duration: 0.5, ease: "backOut" }}
                        >
                            <div className="label-content">
                                <span className="measurement">{label}</span>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Addition equation that appears at the end */}
                {Object.keys(showLabels).length === 4 && (
                    <motion.div
                        className="equation-display"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <div className="equation">
                            30 + 20 + 30 + 20 = <strong>100 meters</strong>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default RectangleSolution;