import React from 'react';
import { motion } from 'framer-motion';
import './FarmerCelebration.css';

const FarmerCelebration = () => {
    return (
        <motion.div
            className="farmer-celebration-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <video
                className="celebration-video"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/assets/farmer-mission/celebration-scene.mp4" type="video/mp4" />
                <div className="video-fallback">
                    <div className="celebration-fallback">
                        <span className="celebration-emoji">🎉</span>
                        <span className="farmer-emoji">👨‍🌾</span>
                        <span className="celebration-emoji">🎉</span>
                    </div>
                </div>
            </video>
        </motion.div>
    );
};

export default FarmerCelebration;