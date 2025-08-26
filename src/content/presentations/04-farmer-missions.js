import React from 'react';
import {
    MissionReadiness,
    FarmerIntro,
    FarmerCelebration,
    FoxThreat,
    FarmMap,
    PerimeterDefinition,
    RectangleSolution,
    SquareFarmMap,
    SquareSolution,
    TriangleFarmMap,
    TriangleSolution,
    PentagonFarmMap,
    PentagonSolution
} from '../../components/presentations/04-farmer-missions';

export const farmerMissionPresentations = {
    'farmer-mission-intro': {
        interactions: [
            {
                id: 'mission-readiness',
                type: 'mission-readiness',
                tutorText: "Fantastic! You're now set with your knowledge of units and shapes. \n\nWith these tools, we're ready to help someone solve a real problem. Are you up for a mission?",
                tutorAnimation: 'thinking-curious-question',
                ContentComponent: MissionReadiness,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "I'm Ready!"
            },
            {
                id: 'meet-farmer',
                type: 'farmer-intro',
                tutorText: "Excellent! Let me introduce you to Farmer Giles. \n\nHe's in a bit of a pickle and needs our help.",
                tutorAnimation: 'explaining',
                ContentComponent: FarmerIntro,
                transitionType: 'auto'
            },
            {
                id: 'fox-threat',
                type: 'fox-threat',
                tutorText: "Farmer Giles loves his sheep, but a sneaky fox has been spotted nearby! \n\nHe needs to build a fence around his entire farm to keep his flock safe.",
                tutorAnimation: 'explaining',
                ContentComponent: FoxThreat,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Help Farmer"
            },
            {
                id: 'farm-map',
                type: 'farm-map',
                tutorText: "Fantastic! Here's the plan. \n\nThis is a map of his farm. It's a perfect rectangle. \n\nWe need to figure out the total length of the edge to know how many fence pieces to buy.",
                tutorAnimation: 'explaining',
                ContentComponent: FarmMap,
                transitionType: 'auto'
            },
            {
                id: 'perimeter-definition',
                type: 'perimeter-definition',
                tutorText: "This total length around the outside edge of a shape has a very important name in math. \n\nIt's called the Perimeter.",
                tutorAnimation: 'explaining',
                ContentComponent: PerimeterDefinition,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Got It!'
            }
        ]
    },
    'farmer-rectangle-challenge': {
        interactions: [
            {
                id: 'rectangle-challenge',
                type: 'perimeter-input',
                tutorText: "To find the perimeter, we need to add up the lengths of all the sides. \n\nLet's give it a try with Farmer Giles' field. What's the total length of the fence he needs?",
                tutorAnimation: 'explaining',
                ContentComponent: FarmMap,
                contentProps: {
                    shape: { type: 'rectangle', width: 30, height: 20, unit: 'meters' },
                    correctAnswer: 100,
                    feedbackIds: {
                        correct: 'rectangle-correct',
                        hint1: 'rectangle-hint-1',
                        solution: 'rectangle-solution'
                    }
                },
                transitionType: 'manual'
            },
            {
                id: 'farmer-celebration',
                type: 'tutor-monologue',
                tutorText: "Great job! Farmer Giles needs 100 meters of fencing.",
                tutorAnimation: 'happy-applauding',
                ContentComponent: FarmerCelebration,
                transitionType: 'auto'
            }
        ],
        feedbackRegistry: {
            'rectangle-correct': {
                id: 'rectangle-correct',
                type: 'tutor-monologue',
                tutorText: "That's exactly right! The perimeter is 100 meters.",
                tutorAnimation: 'happy-applauding',
                transitionType: 'auto'
            },
            'rectangle-hint-1': {
                id: 'rectangle-hint-1',
                type: 'tutor-monologue',
                tutorText: "Not quite. Remember, the perimeter is the total length around the entire outside edge of the farm. \n\nTake another look and try again.",
                transitionType: 'auto'
            },
            'rectangle-solution': {
                id: 'rectangle-solution',
                type: 'rectangle-solution',
                tutorText: "Hmm, let's try a different way. Let's add up the sides together. \n\nThirty plus twenty plus thirty plus twenty equals one hundred.",
                ContentComponent: RectangleSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Got it!"
            }
        }
    },
    'square-field-practice': {
        interactions: [
            {
                id: 'square-challenge-input',
                type: 'perimeter-input',
                tutorText: "Now that you've got the hang of it, let's help some other people with their fencing problems. \n\nWhat's the perimeter of this next field?",
                tutorAnimation: 'normal-talking',
                ContentComponent: SquareFarmMap,
                contentProps: {
                    shape: { type: 'square', side: 15, unit: 'meters' },
                    correctAnswer: 60,
                    feedbackIds: {
                        correct: 'square-correct',
                        hint1: 'square-hint-1',
                        solution: 'square-solution'
                    }
                },
                transitionType: 'manual'
            }
        ],
        feedbackRegistry: {
            'square-correct': {
                id: 'square-correct',
                type: 'tutor-monologue',
                tutorText: "Exactly! The perimeter of this square field is 60 meters.",
                transitionType: 'auto'
            },
            'square-hint-1': {
                id: 'square-hint-1',
                type: 'tutor-monologue',
                tutorText: "Not quite. Try to add up the sides again.",
                transitionType: 'auto'
            },
            'square-solution': {
                id: 'square-solution',
                type: 'square-solution',
                tutorText: "Let's work this one out together. \n\nSince all four sides of a square are equal, we can add them up like this: Fifteen plus fifteen plus fifteen plus fifteen equals sixty.",
                ContentComponent: SquareSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Got it!"
            }
        }
    },
    'triangle-field-practice': {
        interactions: [
            {
                id: 'triangle-challenge',
                type: 'perimeter-input',
                tutorText: "You're a real pro at this! \n\nReady for a new challenge?",
                tutorAnimation: 'thinking-curious-question',
                ContentComponent: TriangleFarmMap,
                contentProps: {
                    shape: { type: 'triangle', sides: [10, 12, 18], unit: 'meters' },
                    correctAnswer: 40,
                    feedbackIds: {
                        correct: 'triangle-correct',
                        hint1: 'triangle-hint-1',
                        solution: 'triangle-solution'
                    }
                },
                transitionType: 'manual'
            }
        ],
        feedbackRegistry: {
            'triangle-correct': {
                id: 'triangle-correct',
                type: 'tutor-monologue',
                tutorText: "Perfect! The perimeter is 40 meters.",
                transitionType: 'auto'
            },
            'triangle-hint-1': {
                id: 'triangle-hint-1',
                type: 'tutor-monologue',
                tutorText: "That's not it. Give it another shot!",
                transitionType: 'auto'
            },
            'triangle-solution': {
                id: 'triangle-solution',
                type: 'triangle-solution',
                tutorText: "No problem. Let's add them up: \n\nTen plus twelve plus eighteen equals forty.",
                ContentComponent: TriangleSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Got it!"
            }
        }
    },
    'pentagon-final-challenge': {
        interactions: [
            {
                id: 'pentagon-challenge',
                type: 'perimeter-input',
                tutorText: "Great job! Just one more to go!",
                tutorAnimation: 'normal-talking',
                ContentComponent: PentagonFarmMap,
                contentProps: {
                    shape: { type: 'pentagon', sides: [8, 8, 8, 8, 8], unit: 'meters' },
                    correctAnswer: 40,
                    feedbackIds: {
                        correct: 'pentagon-correct',
                        hint1: 'pentagon-hint-1',
                        solution: 'pentagon-solution'
                    }
                },
                transitionType: 'manual'
            },
            {
                id: 'mission-complete',
                type: 'tutor-monologue',
                tutorText: "You did it! You've successfully helped Farmer Giles and so many others. You're a perimeter pro!",
                tutorAnimation: 'on-completion-confetti-happy',
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "I'm a Pro!"
            }
        ],
        feedbackRegistry: {
            'pentagon-correct': {
                id: 'pentagon-correct',
                type: 'tutor-monologue',
                tutorText: "Incredible! The perimeter of this pentagon is 40 meters.",
                transitionType: 'auto'
            },
            'pentagon-hint-1': {
                id: 'pentagon-hint-1',
                type: 'tutor-monologue',
                tutorText: "Not quite right. Remember, a pentagon has five sides!",
                transitionType: 'auto'
            },
            'pentagon-solution': {
                id: 'pentagon-solution',
                type: 'pentagon-solution',
                tutorText: "Let's add them up together: \n\n Eight... plus eight... plus eight... plus eight... plus eight... equals forty.",
                ContentComponent: PentagonSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Got it!"
            }
        }
    }
};