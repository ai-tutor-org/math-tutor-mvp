import React from 'react';
import { motion } from 'framer-motion';
import './FoxThreat.css';

const FoxThreat = ({ onAnswerSubmit }) => {
    return (
        <motion.div
            className="fox-threat-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <video
                className="fox-video"
                autoPlay
                muted
                playsInline
            >
                <source src="/assets/farmer-mission/fox-animation.mp4" type="video/mp4" />
                <div className="video-fallback">
                    <div className="threat-fallback">
                        <div className="fox-section">
                            <motion.span 
                                className="fox-emoji"
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                🦊
                            </motion.span>
                            <div className="tree">🌳</div>
                        </div>
                        <div className="sheep-section">
                            <motion.div 
                                className="worried-sheep-group"
                                animate={{ scale: [1, 0.95, 1] }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <span className="worried-sheep">😰🐑</span>
                                <span className="worried-sheep">😰🐑</span>
                                <span className="worried-sheep">😰🐑</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </video>
        </motion.div>
    );
};

export default FoxThreat;