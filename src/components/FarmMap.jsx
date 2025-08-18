import React from 'react';
import { motion } from 'framer-motion';
import './FarmMap.css';

const FarmMap = () => {
    return (
        <motion.div
            className="farm-map-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <img
                src="/assets/farmer-mission/farm-map.png"
                alt="Farmer Giles' rectangular farm"
                className="farm-map-image"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                }}
            />
            
            {/* Fallback farm map */}
            <div className="farm-map-fallback">
                <div className="farm-rectangle">
                    <div className="farm-interior">
                        <div className="farm-elements">
                            <span className="farmer">👨‍🌾</span>
                            <div className="sheep-cluster">
                                <span className="sheep">🐑</span>
                                <span className="sheep">🐑</span>
                                <span className="sheep">🐑</span>
                            </div>
                            <span className="barn">🏠</span>
                        </div>
                    </div>
                    
                    {/* Dimension labels */}
                    <motion.div 
                        className="dimension-label top-label"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        30 meters
                    </motion.div>
                    
                    <motion.div 
                        className="dimension-label bottom-label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        30 meters
                    </motion.div>
                    
                    <motion.div 
                        className="dimension-label left-label"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        20 meters
                    </motion.div>
                    
                    <motion.div 
                        className="dimension-label right-label"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        20 meters
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default FarmMap;