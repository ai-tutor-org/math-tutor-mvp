import { useState, useCallback } from 'react';

const usePerimeterInput = () => {
    const [perimeterInput, setPerimeterInput] = useState('');
    const [perimeterAttempts, setPerimeterAttempts] = useState(0);
    const [showPerimeterSolution, setShowPerimeterSolution] = useState(false);
    const [currentEquationStep, setCurrentEquationStep] = useState(0);

    const resetPerimeterState = useCallback(() => {
        setPerimeterInput('');
        setPerimeterAttempts(0);
        setShowPerimeterSolution(false);
        setCurrentEquationStep(0);
    }, []);

    const handlePerimeterCheck = useCallback((
        correctAnswer,
        feedbackIds,
        getFeedbackText,
        getFeedbackInteraction,
        setDynamicTutorText,
        setActiveFeedbackInteraction,
        setShowNextButton
    ) => {
        const userAnswer = parseInt(perimeterInput);

        if (userAnswer === correctAnswer) {
            // Correct answer
            const feedbackText = getFeedbackText(feedbackIds?.correct);
            if (feedbackText) {
                setDynamicTutorText(feedbackText);
            }
            setShowNextButton(true);
            setPerimeterAttempts(0); // Reset for next interaction
        } else {
            // Incorrect answer
            const newAttempts = perimeterAttempts + 1;
            setPerimeterAttempts(newAttempts);

            if (newAttempts === 1) {
                // First incorrect attempt - show hint
                const feedbackText = getFeedbackText(feedbackIds?.hint1);
                if (feedbackText) {
                    setDynamicTutorText(feedbackText);
                }
                setPerimeterInput(''); // Clear input for retry
            } else if (newAttempts === 2) {
                // Second incorrect attempt - show solution
                const feedbackInteraction = getFeedbackInteraction(feedbackIds?.solution);
                if (feedbackInteraction) {
                    setDynamicTutorText(feedbackInteraction.tutorText);
                    setActiveFeedbackInteraction(feedbackInteraction);
                }
                setShowPerimeterSolution(true);
                setCurrentEquationStep(0);
                setPerimeterInput(correctAnswer.toString());
                setPerimeterAttempts(0); // Reset for next interaction
            }
        }
    }, [perimeterInput, perimeterAttempts]);

    return {
        perimeterInput,
        setPerimeterInput,
        perimeterAttempts,
        showPerimeterSolution,
        currentEquationStep,
        resetPerimeterState,
        handlePerimeterCheck
    };
};

export default usePerimeterInput;