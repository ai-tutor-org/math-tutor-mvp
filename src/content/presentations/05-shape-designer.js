import React from 'react';
import { ShapeDesigner } from '../../components/presentations/05-shape-designer';

export const shapeDesignerPresentations = {
    'shape-designer-intro': {
        title: "Shape Designer Tool",
        interactions: [
            {
                id: 'shape-designer-welcome',
                type: 'shape-designer',
                tutorText: "I love your curiosity! Let's move from solving problems to *designing* things. Welcome to the Shape Designer. Here, you get to be the creator!",
                ContentComponent: ShapeDesigner,
                contentProps: {
                    mode: 'welcome',
                    initialWidth: 4,
                    initialHeight: 3,
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false
                },
                transitionType: 'auto'
            },
            {
                id: 'shape-designer-practice',
                type: 'shape-designer',
                tutorText: "You can click and drag the corners of this rectangle to change its shape. Go ahead and play with it for a moment!",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'conditional',
                condition: 'hasInteracted',
                buttonText: "I'm Ready",
                waitTime: 3000
            }
        ]
    },
    'rectangle-design-challenge': {
        title: "Rectangle Challenge",
        interactions: [
            {
                id: 'rectangle-design-size-20',
                type: 'perimeter-design',
                tutorText: "Okay, designer, here's your first task. \n\nCan you create a rectangle that has a perimeter of exactly 20 units? When you think you have it, press the check button.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'manual'
            },
        ],
        feedbackRegistry: {
            'rectangle-design-correct': {
                id: 'rectangle-design-correct',
                type: 'tutor-monologue',
                tutorText: "Perfect! A perimeter of 20 units. Great job!",
                ContentComponent: ShapeDesigner,
                contentProps: {
                    mode: 'success',
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSuccess: true,
                    showCheckmark: true
                },
                transitionType: 'auto'
            },
            'rectangle-design-hint-1': {
                id: 'rectangle-design-hint-1',
                type: 'tutor-monologue',
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try changing the sides a bit more to get to exactly 20.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            },
            'rectangle-design-hint-2': {
                id: 'rectangle-design-hint-2',
                type: 'tutor-monologue',
                tutorText: "Almost there! Your perimeter is {currentPerimeter}. One more try - you can do this!",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            },
            'rectangle-design-solution': {
                id: 'rectangle-design-solution',
                type: 'tutor-monologue',
                tutorText: "Okay, I will show one correct solution. \n\nSee it has 2 sides of 6 units and 2 sides of 4 units. \n\n The total perimeter is 20 units.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            }
        }
    },
    'rectangle-design-challenge-2': {
        title: "Rectangle Challenge",
        interactions: [
            {
                id: 'rectangle-design-size-26',
                type: 'perimeter-design',
                tutorText: "Okay, let's design another rectangle. \n\nCan you create a rectangle that has a perimeter of exactly 26 units? When you think you have it, press the check button.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'manual'
            },
        ],
        feedbackRegistry: {
            'rectangle-design-correct-2': {
                id: 'rectangle-design-correct-2',
                type: 'tutor-monologue',
                tutorText: "Great job! You are a Pro at this!",
                ContentComponent: ShapeDesigner,
                contentProps: {
                    mode: 'success',
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSuccess: true,
                    showCheckmark: true
                },
                transitionType: 'auto'
            },
            'rectangle-design-hint-1-2': {
                id: 'rectangle-design-hint-1-2',
                type: 'tutor-monologue',
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try changing the sides a bit more to get to exactly 26.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            },
            'rectangle-design-hint-2-2': {
                id: 'rectangle-design-hint-2-2',
                type: 'tutor-monologue',
                tutorText: "Almost there! Your perimeter is {currentPerimeter}. One more try - you can do this!",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            },
            'rectangle-design-solution-2': {
                id: 'rectangle-design-solution-2',
                type: 'tutor-monologue',
                tutorText: "Okay, I will show one correct solution. \n\nSee it has 2 sides of 8 units and 2 sides of 5 units. \n\n The total perimeter is 26 units.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            }
        }
    },
    'rectangle-design-challenge-3': {
        title: "Rectangle Challenge",
        interactions: [
            {
                id: 'rectangle-design-size-8',
                type: 'perimeter-design',
                tutorText: "Just one more challenge. \n\nCreate a rectangle that has a perimeter of exactly 8 units. When you think you have it, press the check button.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'manual'
            },
        ],
        feedbackRegistry: {
            'rectangle-design-correct-3': {
                id: 'rectangle-design-correct-3',
                type: 'tutor-monologue',
                tutorText: "Awesome! That's perfect!",
                ContentComponent: ShapeDesigner,
                contentProps: {
                    mode: 'success',
                    showGrid: true,
                    showSideLabels: true,
                    enableDragging: false,
                    showSuccess: true,
                    showCheckmark: true
                },
                transitionType: 'auto'
            },
            'rectangle-design-hint-1-3': {
                id: 'rectangle-design-hint-1-3',
                type: 'tutor-monologue',
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try changing the sides a bit more to get to exactly 8.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            },
            'rectangle-design-hint-2-3': {
                id: 'rectangle-design-hint-2-3',
                type: 'tutor-monologue',
                tutorText: "Almost there! Your perimeter is {currentPerimeter}. One more try - you can do this!",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            },
            'rectangle-design-solution-3': {
                id: 'rectangle-design-solution-3',
                type: 'tutor-monologue',
                tutorText: "Okay, I will show one correct solution. \n\nSee it has 2 sides of 2 units and 2 sides of 2 units. \n\n The total perimeter is 8 units.",
                ContentComponent: ShapeDesigner,
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
                transitionType: 'auto'
            }
        }
    }
};