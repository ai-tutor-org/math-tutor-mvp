import React from 'react';
import { ShapeDesigner } from '../../components/presentations/05-shape-designer';

export const shapeDesignerPresentations = {
    'shape-designer-intro': {
        title: "Shape Designer Tool",
        interactions: [
            {
                id: 'shape-designer-welcome',
                type: 'shape-designer',
                ContentComponent: ShapeDesigner,
                tutorText: "I love your curiosity! Let's move from solving problems to *designing* things. Welcome to the Shape Designer. Here, you get to be the creator!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'welcome',
                    initialWidth: 4,
                    initialHeight: 3,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false
                },
            },
            {
                id: 'shape-designer-practice',
                type: 'shape-designer',
                ContentComponent: ShapeDesigner,
                tutorText: "You can click and drag the corners of this rectangle to change its shape. Go ahead and play with it for a moment!",
                transitionType: 'conditional',
                condition: 'hasInteracted',
                nextButtonText: "I'm Ready",
                waitTime: 3000,
                contentProps: {
                    mode: 'practice',
                    initialWidth: 4,
                    initialHeight: 3,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    trackInteraction: true
                },
            }
        ]
    },
    'rectangle-design-challenge': {
        title: "Rectangle Challenge",
        interactions: [
            {
                id: 'rectangle-design-size-20',
                type: 'perimeter-design',
                ContentComponent: ShapeDesigner,
                tutorText: "Okay, designer, here's your first task. \n\nCan you create a rectangle that has a perimeter of exactly 20 units? When you think you have it, press the check button.",
                transitionType: 'manual',
                contentProps: {
                    mode: 'challenge',
                    targetPerimeter: 20,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    enableValidation: false,
                    correctAnswer: 20,
                    feedbackIds: {
                        correct: 'rectangle-design-correct',
                        hint1: 'rectangle-design-hint-1',
                        hint2: 'rectangle-design-hint-2',
                        solution: 'rectangle-design-solution'
                    }
                },
            },
        ],
        feedbackRegistry: {
            'rectangle-design-correct': {
                id: 'rectangle-design-correct',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Perfect! A perimeter of 20 units. Great job!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'success',
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSuccess: true,
                    showCheckmark: true
                },
            },
            'rectangle-design-hint-1': {
                id: 'rectangle-design-hint-1',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try changing the sides a bit more to get to exactly 20.",
                transitionType: 'auto',
                contentProps: {
                    mode: 'hint',
                    targetPerimeter: 20,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    showCurrentPerimeter: true
                },
            },
            'rectangle-design-hint-2': {
                id: 'rectangle-design-hint-2',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Almost there! Your perimeter is {currentPerimeter}. One more try - you can do this!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'hint',
                    targetPerimeter: 20,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    showCurrentPerimeter: true,
                    encouragementMode: true
                },
            },
            'rectangle-design-solution': {
                id: 'rectangle-design-solution',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Okay, I will show one correct solution. \n\nSee it has 2 sides of 6 units and 2 sides of 4 units. \n\n The total perimeter is 20 units.",
                transitionType: 'auto',
                contentProps: {
                    mode: 'solution',
                    targetPerimeter: 20,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSolution: true,
                    animateSolution: true,
                    solutionWidth: 6,
                    solutionHeight: 4
                },
            }
        }
    },
    'rectangle-design-challenge-2': {
        title: "Rectangle Challenge",
        interactions: [
            {
                id: 'rectangle-design-size-26',
                type: 'perimeter-design',
                ContentComponent: ShapeDesigner,
                tutorText: "Okay, let's design another rectangle. \n\nCan you create a rectangle that has a perimeter of exactly 26 units? When you think you have it, press the check button.",
                transitionType: 'manual',
                contentProps: {
                    mode: 'challenge',
                    targetPerimeter: 26,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    enableValidation: false,
                    correctAnswer: 26,
                    feedbackIds: {
                        correct: 'rectangle-design-correct-2',
                        hint1: 'rectangle-design-hint-1-2',
                        hint2: 'rectangle-design-hint-2-2',
                        solution: 'rectangle-design-solution-2'
                    }
                },
            },
        ],
        feedbackRegistry: {
            'rectangle-design-correct-2': {
                id: 'rectangle-design-correct-2',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Great job! You are a Pro at this!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'success',
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSuccess: true,
                    showCheckmark: true
                },
            },
            'rectangle-design-hint-1-2': {
                id: 'rectangle-design-hint-1-2',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try changing the sides a bit more to get to exactly 26.",
                transitionType: 'auto',
                contentProps: {
                    mode: 'hint',
                    targetPerimeter: 26,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    showCurrentPerimeter: true
                },
            },
            'rectangle-design-hint-2-2': {
                id: 'rectangle-design-hint-2-2',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Almost there! Your perimeter is {currentPerimeter}. One more try - you can do this!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'hint',
                    targetPerimeter: 26,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    showCurrentPerimeter: true,
                    encouragementMode: true
                },
            },
            'rectangle-design-solution-2': {
                id: 'rectangle-design-solution-2',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Okay, I will show one correct solution. \n\nSee it has 2 sides of 8 units and 2 sides of 5 units. \n\n The total perimeter is 26 units.",
                transitionType: 'auto',
                contentProps: {
                    mode: 'solution',
                    targetPerimeter: 26,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSolution: true,
                    animateSolution: true,
                    solutionWidth: 8,
                    solutionHeight: 5
                },
            }
        }
    },
    'rectangle-design-challenge-3': {
        title: "Rectangle Challenge",
        interactions: [
            {
                id: 'rectangle-design-size-8',
                type: 'perimeter-design',
                ContentComponent: ShapeDesigner,
                tutorText: "Just one more challenge. \n\nCreate a rectangle that has a perimeter of exactly 8 units. When you think you have it, press the check button.",
                transitionType: 'manual',
                contentProps: {
                    mode: 'challenge',
                    targetPerimeter: 8,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    enableValidation: false,
                    correctAnswer: 8,
                    feedbackIds: {
                        correct: 'rectangle-design-correct-3',
                        hint1: 'rectangle-design-hint-1-3',
                        hint2: 'rectangle-design-hint-2-3',
                        solution: 'rectangle-design-solution-3'
                    }
                },
            },
        ],
        feedbackRegistry: {
            'rectangle-design-correct-3': {
                id: 'rectangle-design-correct-3',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Awesome! That's perfect!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'success',
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSuccess: true,
                    showCheckmark: true
                },
            },
            'rectangle-design-hint-1-3': {
                id: 'rectangle-design-hint-1-3',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try changing the sides a bit more to get to exactly 8.",
                transitionType: 'auto',
                contentProps: {
                    mode: 'hint',
                    targetPerimeter: 8,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    showCurrentPerimeter: true
                },
            },
            'rectangle-design-hint-2-3': {
                id: 'rectangle-design-hint-2-3',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Almost there! Your perimeter is {currentPerimeter}. One more try - you can do this!",
                transitionType: 'auto',
                contentProps: {
                    mode: 'hint',
                    targetPerimeter: 8,
                    showTarget: true,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: true,
                    highlightDragIcon: true,
                    showCurrentPerimeter: true,
                    encouragementMode: true
                },
            },
            'rectangle-design-solution-3': {
                id: 'rectangle-design-solution-3',
                type: 'tutor-monologue',
                ContentComponent: ShapeDesigner,
                tutorText: "Okay, I will show one correct solution. \n\nSee it has 2 sides of 2 units and 2 sides of 2 units. \n\n The total perimeter is 8 units.",
                transitionType: 'auto',
                contentProps: {
                    mode: 'solution',
                    targetPerimeter: 8,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSolution: true,
                    animateSolution: true,
                    solutionWidth: 2,
                    solutionHeight: 2
                },
            }
        }
    }
};
