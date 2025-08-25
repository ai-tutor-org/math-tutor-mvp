export const lessons = {
    perimeter: {
        title: "Introduction to Perimeter",
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
        // These presentations are not in the main sequence - they are navigated to conditionally
        conditionalPresentations: []
    }
};

// Conditional/feedback presentations - triggered conditionally, not part of main sequence
export const conditionalPresentations = {

};