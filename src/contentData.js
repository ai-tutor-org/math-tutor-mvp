import {
    FaShoePrints,
    FaRuler,
    FaPaperclip,
    FaDoorOpen,
    FaPaintBrush
} from 'react-icons/fa';
import {
    RoomIllustration,
    RulerMeasurement,
    MeterStick,
    CrayonMeasurementQuestion,
    ConflictingMeasurements,
    StandardUnits,
    ShapeMeasurement
} from './components';

export const lessons = {
    perimeter: {
        title: "Introduction to Perimeter",
        sequence: [
            {
                presentationId: 'welcome',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'room-measurement-intro',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'footsteps-measurement',
                transition: { type: 'auto' },
            },
            {
                presentationId: 'footsteps-measurement-friend',
                transition: { type: 'auto' },
            },
            {
                presentationId: 'conflicting-measurements-problem',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'measurement-reason-question',
                transition: { type: 'conditional' } // Will be handled programmatically
            },
            {
                presentationId: 'standard-units-intro',
                transition: { type: 'manual', buttonText: "What is a standard unit?" }
            },
            {
                presentationId: 'centimeter-ruler-example',
                transition: { type: 'manual', buttonText: "Next" }
            },
            {
                presentationId: 'meter-stick-example',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'crayon-measurement-question',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'perimeter-activity-intro',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'shape-measurement-1',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'shape-measurement-2',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'shape-measurement-3',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'shape-measurement-4',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'measurement-activity-conclusion',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'shape-correct-feedback',
                transition: { type: 'auto' }
            },
            {
                presentationId: 'shape-incorrect-feedback',
                transition: { type: 'auto' }
            },
        ],
        // These presentations are not in the main sequence - they are navigated to conditionally
        conditionalPresentations: [
            'measurement-reason-incorrect',
            'measurement-reason-correct'
        ]
    }
};

export const presentations = {
    'welcome': {
        interactions: [
            {
                id: 0,
                type: 'welcome',
                tutorText: "Hey there, learner! I'm Vyas, your personal AI tutor. I'm so excited to explore the world of shapes and sizes with you. Ready to start our first adventure?",
                layout: 'full-screen',
                transitionType: 'manual',
                showWelcomeButton: true,
            }
        ]
    },
    'room-measurement-intro': {
        interactions: [
            {
                id: 1,
                type: 'tutor-monologue',
                tutorText: "Awesome! Now I'm going to move over here to the left side so we can see our learning space better! ✨",
                layoutChange: 'dual-panel',
                transitionType: 'auto',
            },
            {
                id: 2,
                type: 'room-question',
                tutorText: "Perfect! Let's start with a simple question. Imagine this is your room. How would you figure out how long it is from one wall to the other?",
                ContentComponent: RoomIllustration,
                transitionType: 'auto',
            }
        ]
    },
    'footsteps-measurement': {
        interactions: [
            {
                id: 3,
                type: 'footsteps-animation',
                tutorText: "A common way is to use footsteps! Let's try it. Help me walk from one side to the other by clicking the button for each step.",
                ContentComponent: RoomIllustration,
                contentProps: {
                    totalSteps: 10,
                    footIconColor: '#4A90E2',
                    buttonText: "Take a Step"
                },
                transitionType: 'manual',
            }
        ]
    },
    'footsteps-measurement-friend': {
        interactions: [
            {
                id: 4,
                type: 'footsteps-animation-friend',
                ContentComponent: RoomIllustration,
                tutorText: "Okay, so the room is 10 steps long. Simple enough! But wait... here comes your friend, who has bigger feet. He doesn't believe that the room is 10 steps long. He will use his own steps to measure the room. Help him measure the room too - click the button for each of his steps.",
                contentProps: {
                    totalSteps: 8,
                    footIconColor: '#e24a4a',
                    previousResultText: "You: 10 Steps",
                    buttonText: "Friend's Turn"
                },
                transitionType: 'manual',
            }
        ]
    },
    'conflicting-measurements-problem': {
        interactions: [
            {
                id: 5,
                type: 'conflicting-measurements',
                tutorText: "Hold on. One person says the room is 10 steps long, and another says it's 8 steps long. But the room didn't change! Who is right? This is confusing, isn't it?",
                ContentComponent: ConflictingMeasurements,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next',
            }
        ]
    },
    'measurement-reason-question': {
        interactions: [
            {
                id: '5A',
                type: 'multiple-choice-question',
                tutorText: "What do you think is the reason?",
                ContentComponent: RoomIllustration,
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a',
                    showQuestion: true,
                    question: "What do you think is the reason?",
                    choices: [
                        { text: 'The size of the room changed', isCorrect: false },
                        { text: "The size of my feet and my friend's feet are different", isCorrect: true }
                    ]
                },
                transitionType: 'manual',
            }
        ]
    },
    'measurement-reason-incorrect': {
        interactions: [
            {
                id: '5B',
                type: 'multiple-choice-question',
                tutorText: "No, the size of the room is the same. Choose again.",
                ContentComponent: RoomIllustration,
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a',
                    showQuestion: true,
                    question: "What do you think is the reason?",
                    choices: [
                        { text: "The size of my feet and my friend's feet are different", isCorrect: true }
                    ]
                },
                transitionType: 'manual',
            }
        ]
    },
    'measurement-reason-correct': {
        interactions: [
            {
                id: '5C',
                type: 'tutor-monologue',
                tutorText: "Exactly, the size of your feet and your friend's feet are different. Because of this, we cannot use our feet to measure the room, because everyone will get a different number.",
                ContentComponent: RoomIllustration,
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a'
                },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue',
                navigateToPresentation: 'standard-units-intro' // Continue to next part after this
            }
        ]
    },
    'standard-units-intro': {
        interactions: [
            {
                id: 6,
                type: 'standard-units-explanation',
                tutorText: "What if we had a tool that was the same for everyone in this room? And the same for kids in the classroom next door? And the same for kids all over the world? To solve this problem, people all over the world agreed to use **standard units**.",
                ContentComponent: StandardUnits,
                transitionType: 'auto',
            }
        ]
    },
    'centimeter-ruler-example': {
        interactions: [
            {
                id: 7,
                type: 'ruler-measurement',
                tutorText: "A standard unit is something which measures the same for everyone. One of the standard units is the **centimeter (cm)**. It's very small, perfect for measuring little things.",
                ContentComponent: RulerMeasurement,
                contentProps: { length: 3, unit: 'cm', showAnimation: true },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next',
            }
        ]
    },
    'meter-stick-example': {
        interactions: [
            {
                id: 8,
                type: 'meter-measurement',
                tutorText: "Nice! For bigger things, we use a bigger unit called a meter. A meter is the same as 100 centimeters. See how this meter stick compares to the height of a door?",
                ContentComponent: MeterStick,
                contentProps: {},
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue',
            },
        ]
    },
    'crayon-measurement-question': {
        interactions: [
            {
                id: 9,
                type: 'interactive-question',
                tutorText: "Time for a quick check! If you wanted to measure a crayon, which unit would you use? Click on the best choice.",
                ContentComponent: CrayonMeasurementQuestion,
                contentProps: {
                    question: "If you wanted to measure a crayon, which unit would you use?",
                    useIcon: true,
                    choices: [
                        { text: 'cm', isCorrect: true },
                        { text: 'm', isCorrect: false }
                    ]
                },
                transitionType: 'manual',
            }
        ]
    },
    'crayon-correct-feedback': {
        interactions: [
            {
                id: 'crayon-correct',
                type: 'tutor-monologue',
                tutorText: "Exactly! Centimeters are perfect for that.",
                transitionType: 'auto'
            }
        ]
    },
    'crayon-incorrect-feedback': {
        interactions: [
            {
                id: 'crayon-incorrect',
                type: 'tutor-monologue',
                tutorText: "Good try, but a meter is way too big for a crayon! Centimeters are the better choice here.",
                transitionType: 'auto'
            }
        ]
    },
    'perimeter-activity-intro': {
        interactions: [
            {
                id: 10,
                type: 'tutor-monologue',
                tutorText: "Great job! Now for a real challenge. You'll see a shape with colored sides. Your mission is to figure out the length of each colored side using a special on-screen ruler that you can drag around. Once you measure a side, enter its length in the input box. Let's see what you've got!",
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Let's Go!",
            }
        ]
    },
    'shape-measurement-1': {
        interactions: [
            {
                id: 'shape-measurement-1',
                type: 'tutor-monologue',
                tutorText: "Here's our first object: a notebook. Use the ruler to measure the length of the highlighted blue edge. Then, type your answer in the box and click 'Check'.",
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-notebook',
                    shape: {
                        type: 'rectangle',
                        width: 240, // 8cm * 30px/cm
                        height: 120,
                        imageSrc: '/assets/notebook.svg',
                        highlight: 'top',
                    },
                    correctAnswer: 8
                },
                transitionType: 'manual'
            }
        ]
    },
    'shape-measurement-2': {
        interactions: [
            {
                id: 'shape-measurement-2',
                type: 'tutor-monologue',
                tutorText: "Next, measure this sticky note. It's a perfect square. Measure the highlighted side.",
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-sticky-note',
                    shape: {
                        type: 'square',
                        width: 150, // 5cm
                        height: 150,
                        highlight: 'right',
                    },
                    correctAnswer: 5
                },
                transitionType: 'manual'
            }
        ]
    },
    'shape-measurement-3': {
        interactions: [
            {
                id: 'shape-measurement-3',
                type: 'tutor-monologue',
                tutorText: "Try this coaster, also square but a bit larger. Measure the highlighted bottom edge.",
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-coaster',
                    shape: {
                        type: 'square',
                        width: 180, // 6cm
                        height: 180,
                        highlight: 'bottom',
                    },
                    correctAnswer: 6
                },
                transitionType: 'manual'
            }
        ]
    },
    'shape-measurement-4': {
        interactions: [
            {
                id: 'shape-measurement-4',
                type: 'tutor-monologue',
                tutorText: "Finally, measure the base of this little house sign (a pentagon).",
                ContentComponent: ShapeMeasurement,
                contentProps: {
                    interactionId: 'measure-house-sign',
                    shape: {
                        type: 'pentagon',
                        width: 210, // 7cm base width
                        height: 180,
                        highlight: 'bottom',
                    },
                    correctAnswer: 7
                },
                transitionType: 'manual'
            }
        ]
    },
    'measurement-activity-conclusion': {
        interactions: [
            {
                id: 'measurement-conclusion',
                type: 'tutor-monologue',
                tutorText: "And that's a wrap! You did a fantastic job measuring those shapes. Using tools like rulers is a very important skill in math and science. You should be proud!",
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Done"
            }
        ]
    },
    'shape-correct-feedback': {
        interactions: [
            {
                id: 'shape-correct',
                type: 'tutor-monologue',
                tutorText: "Correct! Great job measuring.",
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Continue"
            }
        ]
    },
    'shape-incorrect-feedback': {
        interactions: [
            {
                id: 'shape-incorrect',
                type: 'tutor-monologue',
                tutorText: "Not quite. Try adjusting the ruler and measuring again.",
                transitionType: 'auto'
            }
        ]
    }
}; 