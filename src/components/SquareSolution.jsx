import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './RectangleSolution.css';

const SquareSolution = ({ onAnswerSubmit }) => {
    const [highlightedSide, setHighlightedSide] = useState(null);
    const [showLabels, setShowLabels] = useState({});

    useEffect(() => {
        const sequence = [
            { side: 'top', delay: 7000, label: '15m' },
            { side: 'right', delay: 8000, label: '15m' }, 
            { side: 'bottom', delay: 9000, label: '15m' },
            { side: 'left', delay: 10000, label: '15m' }
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
        // Square coordinates matching the SVG (field is at 80,80 with 240x240 size)
        const coords = {
            top: { x1: 100, y1: 100, x2: 400, y2: 100 },
            right: { x1: 400, y1: 100, x2: 400, y2: 400 },
            bottom: { x1: 100, y1: 400, x2: 400, y2: 400 },
            left: { x1: 100, y1: 100, x2: 100, y2: 400 }
        };
        return coords[side];
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
                    src="/assets/farmer-mission/square-farm-map.svg"
                    alt="Square farm field"
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
                                    opacity: 0.4
                                }}
                                animate={{
                                    stroke: highlightedSide === side ? '#f59e0b' : '#fbbf24',
                                    opacity: highlightedSide === side ? 1 : 0.4,
                                    strokeWidth: highlightedSide === side ? 12 : 8
                                }}
                                transition={{ 
                                    duration: 0.8, 
                                    ease: "easeInOut"
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Addition equation that appears at the end */}
                <motion.div
                    className="equation-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 11, duration: 0.8 }}
                >
                    <div className="equation">
                        15 + 15 + 15 + 15 = <strong>60 meters</strong>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SquareSolution;