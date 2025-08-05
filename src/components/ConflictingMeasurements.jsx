import React from 'react';
import { FaQuestion } from 'react-icons/fa';
import './ConflictingMeasurements.css';

const ConflictingMeasurements = () => {
    return (
        <div className="conflicting-measurements-container">
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
    );
};

export default ConflictingMeasurements; 