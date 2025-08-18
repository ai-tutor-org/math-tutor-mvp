import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './RectangleSolution.css';

const PentagonSolution = () => {
    const [highlightedSide, setHighlightedSide] = useState(null);

    useEffect(() => {
        const sequence = [
            { side: 'top', delay: 2000 },
            { side: 'upperRight', delay: 3000 }, 
            { side: 'lowerRight', delay: 4000 },
            { side: 'lowerLeft', delay: 5000 },
            { side: 'upperLeft', delay: 6000 }
        ];

        const timeouts = sequence.map(({ side, delay }) => 
            setTimeout(() => {
                setHighlightedSide(side);
            }, delay)
        );

        return () => timeouts.forEach(clearTimeout);
    }, []);

    const getSideCoordinates = (side) => {
        // Align exactly with outer pentagon polygon points in the SVG:
        // v1=(200,80), v2=(315,170), v3=(272,310), v4=(128,310), v5=(85,170)
        const coords = {
            top: { x1: 200, y1: 80, x2: 315, y2: 170 },          // v1 -> v2
            upperRight: { x1: 315, y1: 170, x2: 272, y2: 310 },   // v2 -> v3
            lowerRight: { x1: 272, y1: 310, x2: 128, y2: 310 },   // v3 -> v4
            lowerLeft: { x1: 128, y1: 310, x2: 85, y2: 170 },     // v4 -> v5
            upperLeft: { x1: 85, y1: 170, x2: 200, y2: 80 }       // v5 -> v1
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
                    src="/assets/farmer-mission/pentagon-farm-map.svg"
                    alt="Pentagon farm field"
                    className="farm-map-solution"
                />
                
                <svg
                    width="100%"
                    height="100%"
                    className="solution-svg"
                    viewBox="0 0 400 400"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {['top', 'upperRight', 'lowerRight', 'lowerLeft', 'upperLeft'].map((side) => {
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
                                vectorEffect="non-scaling-stroke"
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
                                    ease: 'easeInOut'
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
                    transition={{ delay: 7, duration: 0.8 }}
                >
                    <div className="equation">
                        8 + 8 + 8 + 8 + 8 = <strong>40 meters</strong>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PentagonSolution;

