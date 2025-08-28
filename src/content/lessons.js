export const lessons = {
    perimeter: {
        id: 'perimeter',
        order: 1,
        title: "Introduction to Perimeter",
        description: "Learn how to calculate the Perimeter of different shapes in a fun way!",
        grade: "5th Grade",
        status: "available",
        theme: {
            backgroundColor: "#17A94E",
            tutorImage: "perimeter_tutor.png"
        },
        sequence: [
            {
                presentationId: 'standard-units-pre-intro',
                transition: { type: 'manual', buttonText: "Let's Learn!" }
            },
            {
                presentationId: 'intro-to-standard-units',
                transition: { type: 'manual', buttonText: "Let's Learn!" }
            },
            {
                presentationId: 'measurement-practice-activities',
                transition: { type: 'automatic' }
            },
            {
                presentationId: 'shape-sorting-factory',
                transition: { type: 'manual', buttonText: "Complete Lesson" }
            },
            {
                presentationId: 'farmer-mission-intro',
                transition: { type: 'manual', buttonText: "Start Mission!" }
            },
            {
                presentationId: 'farmer-rectangle-challenge',
                transition: { type: 'manual', buttonText: "Next Farm!" }
            },
            {
                presentationId: 'square-field-practice',
                transition: { type: 'manual', buttonText: "Another Challenge!" }
            },
            {
                presentationId: 'triangle-field-practice',
                transition: { type: 'manual', buttonText: "Final Shape!" }
            },
            {
                presentationId: 'pentagon-final-challenge',
                transition: { type: 'manual', buttonText: "Let's Create!" }
            },
            {
                presentationId: 'shape-designer-intro',
                transition: { type: 'manual', buttonText: "First Challenge!" }
            },
            {
                presentationId: 'rectangle-design-challenge',
                transition: { type: 'manual', buttonText: "Done" }
            },
            {
                presentationId: 'rectangle-design-challenge-2',
                transition: { type: 'manual', buttonText: "Done" }
            },
            {
                presentationId: 'rectangle-design-challenge-3',
                transition: { type: 'manual', buttonText: "Done" }
            },
            {
                presentationId: 'lesson-summary',
                transition: { type: 'manual', buttonText: "Complete Lesson" }
            }
        ],
    },
    area: {
        id: 'area',
        order: 2,
        title: "Introduction to Area",
        description: "In this lesson you'll be taught to find an area of a given shape.",
        grade: "5th Grade",
        status: "coming-soon",
        theme: {
            backgroundColor: "#FFB039",
            tutorImage: "area_tutor.png"
        },
        sequence: []
    }
};

// Helper functions for lesson management
export const getLessonsList = () => {
    return Object.values(lessons).sort((a, b) => a.order - b.order);
};

export const getLesson = (lessonId) => {
    return lessons[lessonId];
};

export const getAvailableLessons = () => {
    return Object.values(lessons).filter(lesson => lesson.status === 'available');
};
