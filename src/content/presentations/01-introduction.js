import React from 'react';
import { StandardUnits, RulerMeasurement, MeterStick } from '../../components/presentations/01-introduction';

export const introductionPresentations = {
    'standard-units-pre-intro': {
        interactions: [
            {
                id: 'welcome',
                type: 'welcome',
                tutorText: "Hey there! \n\nI'm Mathy, your personal tutor. 😊 I'm so excited to explore the world of shapes and sizes with you. \n\nReady to start our first adventure?",
                tutorAnimation: 'waving',
                layout: 'full-screen',
                transitionType: 'manual',
                showWelcomeButton: true,
            },
            {
                id: 'room-question',
                type: 'room-question',
                tutorText: "Let's start with a simple question. Imagine this is your room. How would you figure out how long it is from one wall to the other?",
                tutorAnimation: 'thinking-curious-question',
                transitionType: 'auto',
            },
            {
                id: 'footsteps-demo',
                type: 'footsteps-animation',
                tutorText: "A common way is to use footsteps! Let's try it. Help me walk from one side to the other by clicking the button for each step.",
                tutorAnimation: 'explaining',
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
                tutorText: "Okay, so the room is 10 steps long. \n\nSimple enough! But wait... here comes your friend, who has bigger feet. He doesn't believe that the room is 10 steps long. He will use his own steps to measure the room.\n\n Help him measure the room too - click the button for each of his steps.",
                tutorAnimation: 'explaining',
                contentProps: {
                    totalSteps: 8,
                    footIconColor: '#e24a4a',
                    previousResultText: "You: 10 Steps",
                    buttonText: "Friend's Turn",
                    persistentStepsData: Array.from({ length: 10 }, (_, i) => {
                        const svgWidth = 500;
                        const innerRoomLeft = (47.8 / 578) * svgWidth; // ~41px
                        const innerRoomWidth = (482.4 / 578) * svgWidth; // ~417px
                        const availableWidth = innerRoomWidth - 20; // Some padding
                        const slotWidth = availableWidth / 10;
                        const footSize = slotWidth * 0.9;
                        const slotStart = innerRoomLeft + 10 + (i * slotWidth);
                        const footOffsetInSlot = (slotWidth - footSize) / 2;
                        const position = slotStart + footOffsetInSlot;
                        return {
                            id: `persistent-${i}`,
                            position: position,
                            color: '#4A90E2',
                            size: footSize
                        };
                    })
                },
                transitionType: 'manual',
            },
            {
                id: 'conflicting-problem',
                type: 'conflicting-measurements',
                tutorText: "Hold on. One person says the room is 10 steps long, and another says it's 8 steps long. \n\nBut the room didn't change! Who is right? This is confusing, isn't it?",
                tutorAnimation: 'thinking-curious-question',
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a',
                },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Interesting!',
            },
            {
                id: 'measurement-reason-question',
                type: 'multiple-choice-question',
                tutorText: "What do you think is the reason?",
                tutorAnimation: 'thinking-curious-question',
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a',
                    question: "What do you think is the reason?",
                    choices: [
                        {
                            text: 'The size of the room changed',
                            isCorrect: false,
                            feedbackId: 'measurement-reason-retry'
                        },
                        {
                            text: "The size of my feet and my friend's feet are different",
                            isCorrect: true,
                            feedbackId: 'measurement-reason-explanation'
                        }
                    ]
                },
                transitionType: 'manual',
            },
        ],
        feedbackRegistry: {
            'measurement-reason-retry': {
                id: 'measurement-reason-retry',
                type: 'multiple-choice-question',
                tutorText: "No, the size of the room is the same. Choose again.",
                tutorAnimation: 'thinking-curious-question',
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a',
                    question: "What do you think is the reason?",
                    choices: [
                        {
                            text: "The size of my feet and my friend's feet are different",
                            isCorrect: true,
                            feedbackId: 'measurement-reason-explanation'
                        }
                    ]
                },
                transitionType: 'manual'
            },
            'measurement-reason-explanation': {
                id: 'measurement-reason-explanation',
                type: 'tutor-monologue',
                tutorText: "Exactly, the size of your feet and your friend's feet are different. Because of this, we cannot use our feet to measure the room, because everyone will get a different number.",
                tutorAnimation: 'explaining',
                contentProps: {
                    showBothFootsteps: true,
                    yourSteps: 10,
                    friendSteps: 8,
                    yourFootColor: '#4A90E2',
                    friendFootColor: '#e24a4a'
                },
                transitionType: 'auto'
            }
        }
    },
    'intro-to-standard-units': {
        interactions: [
            {
                id: 'standard-units-intro',
                type: 'standard-units-explanation',
                tutorText: "What if we had a tool that was the same for everyone in this room? \n\nAnd the same for kids in the classroom next door? \n\nAnd the same for kids all over the world? \n\nTo solve this problem, people all over the world agreed to use standard units.",
                tutorAnimation: 'explaining',
                ContentComponent: StandardUnits,
                transitionType: 'auto',
            },
            {
                id: 'centimeter-ruler',
                type: 'ruler-measurement',
                tutorText: "A standard unit is something which measures the same for everyone. \n\nOne of the standard units is the centimeter (cm). It's very small, perfect for measuring little things.",
                tutorAnimation: 'explaining',
                ContentComponent: RulerMeasurement,
                contentProps: { length: 3, unit: 'cm' },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Show More',
            },
            {
                id: 'meter-stick-demo',
                type: 'meter-measurement',
                tutorText: "Nice! For bigger things, we use a bigger unit called a meter. \n\nA meter is the same as 100 centimeters. \n\nSee how this meter stick compares to the height of a door?",
                tutorAnimation: 'explaining',
                ContentComponent: MeterStick,
                contentProps: {},
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next',
            }
        ]
    }
};