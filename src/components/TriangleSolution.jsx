import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './RectangleSolution.css';

const TriangleSolution = ({ onAnswerSubmit }) => {
    const [highlightedSide, setHighlightedSide] = useState(null);
    const [showLabels, setShowLabels] = useState({});

    useEffect(() => {
        const sequence = [
            { side: 'bottom', delay: 4000, label: '10m' },
            { side: 'right', delay: 5000, label: '12m' }, 
            { side: 'left', delay: 6000, label: '18m' }
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
        // Triangle coordinates matching the SVG (triangle points: 200,80 320,280 80,280)
        const coords = {
            bottom: { x1: 100, y1: 350, x2: 400, y2: 350 },
            right: { x1: 250, y1: 100, x2: 400, y2: 350 },
            left: { x1: 250, y1: 100, x2: 100, y2: 350 }
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
                    src="/math-tutor-mvp/assets/farmer-mission/triangle-farm-map.svg"
                    alt="Triangle farm field"
                    className="farm-map-solution"
                />
                
                <svg width="100%" height="100%" className="solution-svg">
                    {['bottom', 'right', 'left'].map((side) => {
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

            </div>
        </motion.div>
    );
};

export default TriangleSolution;