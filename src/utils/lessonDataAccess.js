import { lessons, presentations } from '../content';

// Get lesson data by ID
export const getLessonData = (lessonId) => {
    return lessons[lessonId];
};

// Get presentation data by ID
export const getPresentationData = (presentationId) => {
    return presentations[presentationId];
};

// Get presentation ID from lesson sequence
export const getPresentationId = (lessonId, currentPresIndex) => {
    const lesson = getLessonData(lessonId);
    return lesson?.sequence[currentPresIndex]?.presentationId;
};

// Get interaction from presentation
export const getInteractionData = (presentationId, currentInteractionIndex) => {
    const presentation = getPresentationData(presentationId);
    return presentation?.interactions[currentInteractionIndex];
};

// Get full feedback interaction data including ContentComponent
export const getFeedbackInteraction = (presentationId, feedbackInteractionId) => {
    const presentation = getPresentationData(presentationId);
    if (presentation?.feedbackRegistry?.[feedbackInteractionId]) {
        return presentation.feedbackRegistry[feedbackInteractionId];
    }
    return null;
};