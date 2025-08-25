import React from 'react';
import { motion } from 'framer-motion';
import './FarmMap.css';

const PentagonFarmMap = () => {
    return (
        <motion.div
            className="farm-map-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <img
                src="/assets/farmer-mission/pentagon-farm-map.svg"
                alt="Pentagon farm field"
                className="farm-map-image"
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                }}
            />

            {/* Fallback pentagon farm map */}
            <div className="farm-map-fallback">
                <div className="farm-square" style={{ clipPath: 'polygon(50% 0%, 93% 35%, 76% 100%, 24% 100%, 7% 35%)' }}>
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

                    {/* Dimension labels for pentagon (all 8 meters) */}
                    <motion.div 
                        className="dimension-label top-label"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        8 meters
                    </motion.div>

                    <motion.div 
                        className="dimension-label right-label"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        style={{ transform: 'translateY(-50%) rotate(50deg)', right: '-10px', top: '35%' }}
                    >
                        8 meters
                    </motion.div>

                    <motion.div 
                        className="dimension-label left-label"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{ transform: 'translateY(-50%) rotate(-50deg)', left: '-10px', top: '35%' }}
                    >
                        8 meters
                    </motion.div>

                    <motion.div 
                        className="dimension-label bottom-label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{ bottom: '-20px' }}
                    >
                        8 meters
                    </motion.div>

                    <motion.div 
                        className="dimension-label bottom-label"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        style={{ bottom: '-20px', left: '25%' }}
                    >
                        8 meters
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default PentagonFarmMap;

