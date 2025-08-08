import React, { useState } from 'react';
import { FaPaintBrush, FaCheck, FaTimes } from 'react-icons/fa'; // Added checkmark and X icons
import './CrayonMeasurementQuestion.css';

const CrayonMeasurementQuestion = ({ onAnswer, question, useIcon, choices }) => {
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleChoiceClick = (choice) => {
        // Prevent multiple clicks
        if (selectedChoice) return;

        // Set the selected choice and show immediate visual feedback
        setSelectedChoice(choice);
        setShowFeedback(true);

        // Return the interaction ID for the appropriate feedback
        const feedbackInteractionId = choice.isCorrect ? 'crayon-correct' : 'crayon-incorrect';

        // Call the answer handler with the choice and feedback interaction ID
        onAnswer({
            choice,
            isCorrect: choice.isCorrect,
            feedbackInteractionId
        });
    };

    const getButtonClass = (choice) => {
        if (!showFeedback) return '';

        if (selectedChoice === choice) {
            return choice.isCorrect ? 'correct' : 'incorrect';
        }

        // If user selected wrong answer, also highlight the correct one
        if (!selectedChoice?.isCorrect && choice.isCorrect) {
            return 'correct';
        }

        return '';
    };

    const getFeedbackIcon = (choice) => {
        if (!showFeedback) return null;

        if (selectedChoice === choice) {
            return choice.isCorrect ? <FaCheck className="feedback-icon" /> : <FaTimes className="feedback-icon" />;
        }

        // Show checkmark on correct answer if user selected wrong
        if (!selectedChoice?.isCorrect && choice.isCorrect) {
            return <FaCheck className="feedback-icon" />;
        }

        return null;
    };

    return (
        <div className="crayon-measurement-question">
            <p>{question}</p>
            {useIcon && <FaPaintBrush className="crayon-icon" />}
            <div className="choices">
                {choices.map((choice) => (
                    <button
                        key={choice.text}
                        onClick={() => handleChoiceClick(choice)}
                        className={getButtonClass(choice)}
                        disabled={selectedChoice !== null}
                    >
                        {choice.text}
                        {getFeedbackIcon(choice)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CrayonMeasurementQuestion;
