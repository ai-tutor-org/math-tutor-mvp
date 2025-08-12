import React from 'react';
import { motion } from 'framer-motion';
import './FarmerIntro.css';

const FarmerIntro = () => {
    return (
        <motion.div
            className="farmer-intro-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <video
                className="farmer-video"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/math-tutor-mvp/assets/farmer-mission/farmer-giles.mp4" type="video/mp4" />
                <div className="video-fallback">
                    <div className="farmer-fallback">
                        <span className="farmer-emoji">👨‍🌾</span>
                        <div className="sheep-group">
                            <span className="sheep">🐑</span>
                            <span className="sheep">🐑</span>
                            <span className="sheep">🐑</span>
                        </div>
                    </div>
                </div>
            </video>
        </motion.div>
    );
};

export default FarmerIntro;