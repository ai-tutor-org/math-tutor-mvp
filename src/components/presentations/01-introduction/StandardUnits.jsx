import React from 'react';
import { motion } from 'framer-motion';
import './StandardUnits.css';

const StandardUnits = () => {
    return (
        <motion.div
            className="standard-units-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <h1 className="standard-units-text">Standard Units</h1>
        </motion.div>
    );
};

export default StandardUnits; 