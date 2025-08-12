import React from 'react';
import { motion } from 'framer-motion';
import { FaRuler } from 'react-icons/fa';
import './MissionReadiness.css';

const MissionReadiness = ({ onAnswerSubmit }) => {
    const icons = [
        { icon: <FaRuler />, label: "Ruler", emoji: "📏" },
        { icon: "🔲", label: "Rectangle", emoji: "🔲" },
        { icon: "🟦", label: "Square", emoji: "🟦" },
        { icon: "🔺", label: "Triangle", emoji: "🔺" }
    ];

    return (
        <motion.div
            className="mission-readiness-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <div className="tools-grid">
                {icons.map((item, index) => (
                    <motion.div
                        key={index}
                        className="tool-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.3 }}
                    >
                        <div className="tool-icon">
                            {typeof item.icon === 'string' ? (
                                <span className="emoji-icon">{item.icon}</span>
                            ) : (
                                item.icon
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MissionReadiness;