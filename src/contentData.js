import {
    RoomIllustration,
    ConflictingMeasurements,
    StandardUnits,
    RulerMeasurement,
    MeterStick
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
                presentationId: 'standard-units-intro',
                transition: { type: 'manual', buttonText: "Show Me Standard Units!" }
            },
            {
                presentationId: 'centimeter-ruler-example',
                transition: { type: 'manual', buttonText: "Learn the Next Unit" }
            },
            {
                presentationId: 'meter-stick-example',
                transition: { type: 'manual', buttonText: "Continue" }
            },
        ]
    }
};

export const presentations = {
    'welcome': {
        interactions: [
            {
                id: 0,
                type: 'welcome',
                tutorText: "Hey there, {userName}! I'm Vyas, your personal AI tutor. I'm so excited to explore the world of shapes and sizes with you. Ready to start our first adventure?",
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
                transitionType: 'auto',
            }
        ]
    },
    'footsteps-measurement-friend': {
        interactions: [
            {
                id: 4,
                type: 'footsteps-animation-friend',
                tutorText: "Okay, so the room is 10 steps long. Simple enough! But wait... here comes my friend, who has much bigger feet. Help him measure the room too - click the button for each of his steps.",
                ContentComponent: RoomIllustration,
                contentProps: {
                    totalSteps: 8,
                    footIconColor: '#e24a4a',
                    previousResultText: "You: 10 Steps",
                    buttonText: "Friend's Turn"
                },
                transitionType: 'auto',
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
                transitionType: 'auto',
            }
        ]
    },
    'standard-units-intro': {
        interactions: [
            {
                id: 6,
                type: 'standard-units-explanation',
                tutorText: "This is why we need 'Standard Units'! They are fixed measurements that everyone agrees on, so we all get the same answer.",
                ContentComponent: StandardUnits,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue',
            }
        ]
    },
    'centimeter-ruler-example': {
        interactions: [
            {
                id: 7,
                type: 'ruler-measurement',
                tutorText: "Let's start with a small unit called a centimeter. We often use a ruler to measure it. See this paperclip? It's exactly 3 centimeters long.",
                ContentComponent: RulerMeasurement,
                contentProps: { length: 3, unit: 'cm' },
                transitionType: 'manual',
                triggerWords: ['paperclip'],
                onWordBoundary: {
                    action: 'startAnimation'
                },
                showNextButton: true,
                nextButtonText: 'Next Unit',
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
                nextButtonText: 'Finish Lesson',
            },
        ]
    }
}; 