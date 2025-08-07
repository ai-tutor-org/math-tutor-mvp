import React, { useState } from 'react';
import { FaPaintBrush, FaCheck, FaTimes } from 'react-icons/fa'; // Added checkmark and X icons
import './CrayonMeasurementQuestion.css';

const CrayonMeasurementQuestion = ({ content, onAnswer }) => {
    const { question, useIcon, choices } = content;
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleChoiceClick = (choice) => {
        // Prevent multiple clicks
        if (selectedChoice) return;

        // Set the selected choice and show immediate visual feedback
        setSelectedChoice(choice);
        setShowFeedback(true);

        // Trigger the tutor response based on the choice
        const tutorResponse = choice.isCorrect
            ? "Exactly! Centimeters are perfect for that."
            : "Good try, but a meter is way too big for a crayon! Centimeters are the better choice here.";

        // Call the answer handler with both the choice and tutor response
        onAnswer({
            choice,
            tutorResponse,
            isCorrect: choice.isCorrect
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
