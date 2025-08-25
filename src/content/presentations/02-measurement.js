import React from 'react';
import { Crayon, ShapeMeasurement } from '../../components';

export const measurementPresentations = {
    'measurement-practice-activities': {
        interactions: [
            {
                id: 'crayon-question',
                type: 'multiple-choice-question',
                tutorText: "Time for a quick check! If you wanted to measure a crayon, which unit would you use? Click on the best choice.",
                tutorAnimation: 'thinking-curious-question',
                ContentComponent: Crayon,
                contentProps: {
                    question: "If you wanted to measure a crayon, which unit would you use?",
                    choices: [
                        {
                            text: 'cm',
                            isCorrect: true,
                            feedbackId: 'crayon-correct'
                        },
                        {
                            text: 'm',
                            isCorrect: false,
                            feedbackId: 'crayon-incorrect'
                        }
                    ]
                },
                transitionType: 'manual',
            },
            {
                id: 'activity-intro',
                type: 'tutor-monologue',
                tutorText: "Great job! Now for a real challenge. You'll see a shape with colored sides. Your mission is to figure out the length of each colored side using a special on-screen ruler that you can drag around. \n\nOnce you measure a side, enter its length in the input box. Let's see what you've got!",
                tutorAnimation: 'explaining',
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Let's Go!",
            },
            {
                id: 'measure-notebook',
                type: 'shape-measurement',
                tutorText: "Here's our first object: a notebook. \n\nUse the ruler to measure the length of the highlighted blue edge. \n\nThen, type your answer in the box and click 'Check'.",
                tutorAnimation: 'explaining',
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-notebook',
                    shape: {
                        type: 'rectangle',
                        width: 242,
                        height: 310,
                        imageSrc: '/assets/measurement-activities/book.svg',
                    },
                    correctAnswer: 8,
                    rulerOrientation: 'horizontal',
                },
                transitionType: 'manual'
            },
            {
                id: 'measure-sticky-note',
                type: 'shape-measurement',
                tutorText: "Next, measure this sticky note. It's a perfect square. Measure the highlighted side.",
                tutorAnimation: 'normal-talking',
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-sticky-note',
                    shape: {
                        type: 'square',
                        width: 150,
                        height: 150,
                        imageSrc: '/assets/measurement-activities/sticky-note.svg',
                    },
                    correctAnswer: 5,
                    rulerOrientation: 'horizontal',
                },
                transitionType: 'manual'
            },
            {
                id: 'measure-coaster',
                type: 'shape-measurement',
                tutorText: "Try this box. Measure the highlighted bottom edge.",
                tutorAnimation: 'normal-talking',
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-coaster',
                    shape: {
                        type: 'rectangle',
                        width: 182,
                        height: 154,
                        imageSrc: '/assets/measurement-activities/cube.svg',
                    },
                    correctAnswer: 6,
                    rulerOrientation: 'horizontal',
                },
                transitionType: 'manual'
            },
            {
                id: 'measure-house-sign',
                type: 'shape-measurement',
                tutorText: "Finally, measure the side of this photo frame.",
                tutorAnimation: 'normal-talking',
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-house-sign',
                    shape: {
                        type: 'rectangle',
                        width: 274,
                        height: 214,
                        imageSrc: '/assets/measurement-activities/photo-frame.svg',
                    },
                    correctAnswer: 7,   
                    rulerOrientation: 'vertical',
                },
                transitionType: 'manual'
            },
            {
                id: 'measurement-conclusion',
                type: 'tutor-monologue',
                tutorText: "And that's a wrap! You did a fantastic job measuring those shapes. \n\nUsing tools like rulers is a very important skill in math and science. You should be proud! \n\nNow let's move on to something fun...",
                tutorAnimation: 'happy-applauding',
                ContentComponent: () => null,
                transitionType: 'auto'
            }
        ],
        feedbackRegistry: {
            'crayon-correct': {
                id: 'crayon-correct',
                type: 'tutor-monologue',
                tutorText: "Exactly! Centimeters are perfect for that.",
                tutorAnimation: 'happy-applauding',
                transitionType: 'auto'
            },
            'crayon-incorrect': {
                id: 'crayon-incorrect',
                type: 'tutor-monologue',
                tutorText: "Good try, but a meter is way too big for a crayon! Centimeters are the better choice here.",
                tutorAnimation: 'explaining',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Got it!"
            },
            'shape-correct': {
                id: 'shape-correct',
                type: 'tutor-monologue',
                tutorText: "Correct! Great job measuring.",
                tutorAnimation: 'happy-applauding',
                transitionType: 'auto'
            },
            'shape-incorrect': {
                id: 'shape-incorrect',
                type: 'tutor-monologue',
                tutorText: "Not quite. Try adjusting the ruler and measuring again.",
                tutorAnimation: 'normal-talking',
                transitionType: 'auto'
            }
        }
    }
};