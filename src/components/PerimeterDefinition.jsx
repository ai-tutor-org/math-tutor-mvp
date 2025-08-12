import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './PerimeterDefinition.css';

const PerimeterDefinition = ({ onAnswerSubmit }) => {
    const [showPerimeter, setShowPerimeter] = useState(false);
    const [showTitle, setShowTitle] = useState(false);

    useEffect(() => {
        // Start perimeter animation after initial render
        const timer1 = setTimeout(() => setShowPerimeter(true), 1000);
        // Show title after perimeter animation
        const timer2 = setTimeout(() => setShowTitle(true), 3000);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <motion.div
            className="perimeter-definition-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="farm-image-container">
                <img
                    src="/math-tutor-mvp/assets/farmer-mission/farm-map.png"
                    alt="Farmer Giles' rectangular farm"
                    className="farm-map-perimeter"
                />
                
                {/* Animated perimeter line overlay */}
                <motion.div
                    className="perimeter-line"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: showPerimeter ? 1 : 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                >
                    <svg width="100%" height="100%" className="perimeter-svg">
                        <rect
                            x="10"
                            y="10"
                            width="calc(100% - 20px)"
                            height="calc(100% - 20px)"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="6"
                            strokeDasharray="15,10"
                            className="animated-border"
                        />
                    </svg>
                </motion.div>
            </div>
            
            {/* Perimeter title animation */}
            <motion.div
                className="perimeter-title"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                    opacity: showTitle ? 1 : 0, 
                    scale: showTitle ? 1 : 0.5
                }}
                transition={{ 
                    duration: 0.8, 
                    ease: "backOut",
                    scale: { type: "spring", damping: 10 }
                }}
            >
                <h1 className="perimeter-word">PERIMETER</h1>
            </motion.div>

        </motion.div>
    );
};

export default PerimeterDefinition;