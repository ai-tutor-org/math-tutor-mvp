import React from 'react';
import { FaQuestion } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './ConflictingMeasurements.css';

const ConflictingMeasurements = () => {

    return (
        <motion.div
            className="conflicting-measurements-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="measurement-display">
                <div className="measurement-box">
                    <span className="measurement-label">You</span>
                    <span className="measurement-value">10 steps</span>
                </div>
                <div className="question-mark-container">
                    <FaQuestion className="question-mark-icon" />
                </div>
                <div className="measurement-box">
                    <span className="measurement-label">Friend</span>
                    <span className="measurement-value">8 steps</span>
                </div>
            </div>

        </motion.div>
    );
};

export default ConflictingMeasurements; 