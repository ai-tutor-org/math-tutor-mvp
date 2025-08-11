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
                presentationId: 'introduction-to-standard-units',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'measurement-practice-activities',
                transition: { type: 'manual', buttonText: "Done" }
            }
        ],
        // These presentations are not in the main sequence - they are navigated to conditionally
        conditionalPresentations: [
            'measurement-reason-incorrect',
            'measurement-reason-correct'
        ]
    }
};

export const presentations = {
    'introduction-to-standard-units': {
        interactions: [
            {
                id: 'welcome',
                type: 'welcome',
                tutorText: "Hey there, learner! I'm Vyas, your personal AI tutor. I'm so excited to explore the world of shapes and sizes with you. Ready to start our first adventure?",
                layout: 'full-screen',
                transitionType: 'manual',
                showWelcomeButton: true,
            },
            {
                id: 'tutor-intro',
                type: 'tutor-monologue',
                tutorText: "Awesome! Now I'm going to move over here to the left side so we can see our learning space better! ✨",
                layoutChange: 'dual-panel',
                transitionType: 'auto',
            },
            {
                id: 'room-question',
                type: 'room-question',
                tutorText: "Perfect! Let's start with a simple question. Imagine this is your room. How would you figure out how long it is from one wall to the other?",
                ContentComponent: RoomIllustration,
                transitionType: 'auto',
            },
            {
                id: 'footsteps-demo',
                type: 'footsteps-animation',
                tutorText: "A common way is to use footsteps! Let's try it. Help me walk from one side to the other by clicking the button for each step.",
                ContentComponent: RoomIllustration,
                contentProps: {
                    totalSteps: 10,
                    footIconColor: '#4A90E2',
                    buttonText: "Take a Step"
                },
                transitionType: 'manual',
            },
            {
                id: 'footsteps-friend',
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
            },
            {
                id: 'conflicting-problem',
                type: 'conflicting-measurements',
                tutorText: "Hold on. One person says the room is 10 steps long, and another says it's 8 steps long. But the room didn't change! Who is right? This is confusing, isn't it?",
                ContentComponent: ConflictingMeasurements,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next',
            },
            {
                id: 'measurement-reason-question',
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
            },
            {
                id: 'standard-units-intro',
                type: 'standard-units-explanation',
                tutorText: "What if we had a tool that was the same for everyone in this room? And the same for kids in the classroom next door? And the same for kids all over the world? To solve this problem, people all over the world agreed to use **standard units**.",
                ContentComponent: StandardUnits,
                transitionType: 'auto',
            },
            {
                id: 'centimeter-ruler',
                type: 'ruler-measurement',
                tutorText: "A standard unit is something which measures the same for everyone. One of the standard units is the **centimeter (cm)**. It's very small, perfect for measuring little things.",
                ContentComponent: RulerMeasurement,
                contentProps: { length: 3, unit: 'cm' },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next',
            },
            {
                id: 'meter-stick-demo',
                type: 'meter-measurement',
                tutorText: "Nice! For bigger things, we use a bigger unit called a meter. A meter is the same as 100 centimeters. See how this meter stick compares to the height of a door?",
                ContentComponent: MeterStick,
                contentProps: {},
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue',
            }
        ]
    },
    'measurement-practice-activities': {
        interactions: [
            {
                id: 'crayon-question',
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
            },
            {
                id: 'activity-intro',
                type: 'tutor-monologue',
                tutorText: "Great job! Now for a real challenge. You'll see a shape with colored sides. Your mission is to figure out the length of each colored side using a special on-screen ruler that you can drag around. Once you measure a side, enter its length in the input box. Let's see what you've got!",
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Let's Go!",
            },
            {
                id: 'measure-notebook',
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
            },
            {
                id: 'measure-sticky-note',
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
            },
            {
                id: 'measure-coaster',
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
            },
            {
                id: 'measure-house-sign',
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
            },
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
    // Conditional presentations for the measurement reason question
    'measurement-reason-incorrect': {
        interactions: [
            {
                id: 'measurement-reason-retry',
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
                id: 'measurement-reason-explanation',
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
                navigateToInteraction: 'standard-units-intro' // Continue to standard units explanation
            }
        ]
    },
    // Feedback interactions - not part of sequential flow, used only for lookup
    'feedback-interactions': {
        interactions: [
            {
                id: 'crayon-correct',
                type: 'tutor-monologue',
                tutorText: "Exactly! Centimeters are perfect for that.",
                transitionType: 'auto'
            },
            {
                id: 'crayon-incorrect',
                type: 'tutor-monologue',
                tutorText: "Good try, but a meter is way too big for a crayon! Centimeters are the better choice here.",
                transitionType: 'auto'
            },
            {
                id: 'shape-correct',
                type: 'tutor-monologue',
                tutorText: "Correct! Great job measuring.",
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Continue"
            },
            {
                id: 'shape-incorrect',
                type: 'tutor-monologue',
                tutorText: "Not quite. Try adjusting the ruler and measuring again.",
                transitionType: 'auto'
            }
        ]
    }
}; 