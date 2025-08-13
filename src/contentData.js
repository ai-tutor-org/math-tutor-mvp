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
    ShapeMeasurement,
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
    PentagonSolution,
    ShapeDesigner
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
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'farmer-mission-intro',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'farmer-rectangle-challenge',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'square-field-practice',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'triangle-field-practice',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'pentagon-final-challenge',
                transition: { type: 'manual', buttonText: "Continue" }
            },
            {
                presentationId: 'shape-designer-intro',
                transition: { type: 'manual', buttonText: "Continue" }
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
                tutorText: "Hey there!",
                layout: 'full-screen',
                transitionType: 'manual',
                showWelcomeButton: true,
            },
            {
                id: 'room-question',
                type: 'room-question',
                tutorText: "Let's start with a simple question. Imagine this is your room. How would you figure out how long it is from one wall to the other?",
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
                tutorText: "Okay, so the room is 10 steps long. \n\nSimple enough! But wait... here comes your friend, who has bigger feet. He doesn't believe that the room is 10 steps long. He will use his own steps to measure the room.\n\n Help him measure the room too - click the button for each of his steps.",
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
                tutorText: "Hold on. One person says the room is 10 steps long, and another says it's 8 steps long. \n\nBut the room didn't change! Who is right? This is confusing, isn't it?",
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
                tutorText: "What if we had a tool that was the same for everyone in this room? \n\nAnd the same for kids in the classroom next door? \n\nAnd the same for kids all over the world? \n\nTo solve this problem, people all over the world agreed to use standard units.",
                ContentComponent: StandardUnits,
                transitionType: 'auto',
            },
            {
                id: 'centimeter-ruler',
                type: 'ruler-measurement',
                tutorText: "A standard unit is something which measures the same for everyone. \n\nOne of the standard units is the centimeter (cm). It's very small, perfect for measuring little things.",
                ContentComponent: RulerMeasurement,
                contentProps: { length: 3, unit: 'cm' },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next',
            },
            {
                id: 'meter-stick-demo',
                type: 'meter-measurement',
                tutorText: "Nice! For bigger things, we use a bigger unit called a meter. \n\nA meter is the same as 100 centimeters. \n\nSee how this meter stick compares to the height of a door?",
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
                tutorText: "Great job! Now for a real challenge. You'll see a shape with colored sides. Your mission is to figure out the length of each colored side using a special on-screen ruler that you can drag around. \n\nOnce you measure a side, enter its length in the input box. Let's see what you've got!",
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Let's Go!",
            },
            {
                id: 'measure-notebook',
                type: 'tutor-monologue',
                tutorText: "Here's our first object: a notebook. \n\nUse the ruler to measure the length of the highlighted blue edge. \n\nThen, type your answer in the box and click 'Check'.",
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
                tutorText: "And that's a wrap! You did a fantastic job measuring those shapes. \n\nUsing tools like rulers is a very important skill in math and science. You should be proud!",
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
                tutorText: "Exactly, the size of your feet and your friend's feet are different. \n\nBecause of this, we cannot use our feet to measure the room, because everyone will get a different number.",
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
    // FARMER MISSION PRESENTATIONS
    'farmer-mission-intro': {
        interactions: [
            {
                id: 'mission-readiness',
                type: 'mission-readiness',
                tutorText: "Fantastic! You're now set with your knowledge of units and shapes. \n\nWith these tools, we're ready to help someone solve a real problem. Are you up for a mission?",
                ContentComponent: MissionReadiness,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "I'm Ready!"
            },
            {
                id: 'meet-farmer',
                type: 'farmer-intro',
                tutorText: "Excellent! Let me introduce you to Farmer Giles. \n\nHe's in a bit of a pickle and needs our help.",
                ContentComponent: FarmerIntro,
                transitionType: 'auto'
            },
            {
                id: 'fox-threat',
                type: 'fox-threat',
                tutorText: "Farmer Giles loves his sheep, but a sneaky fox has been spotted nearby! \n\nHe needs to build a fence around his entire farm to keep his flock safe.",
                ContentComponent: FoxThreat,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Help the Farmer!"
            },
            {
                id: 'farm-map',
                type: 'farm-map',
                tutorText: "Fantastic! Here's the plan. \n\nThis is a map of his farm. It's a perfect rectangle. \n\nWe need to figure out the total length of the boundary to know how much fencing material to buy.",
                ContentComponent: FarmMap,
                transitionType: 'auto'
            },
            {
                id: 'perimeter-definition',
                type: 'perimeter-definition',
                tutorText: "This total length around the outside edge of a shape has a very important name in mathematics. \n\nIt's called the Perimeter.",
                ContentComponent: PerimeterDefinition,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next'
            }
        ]
    },
    'farmer-rectangle-challenge': {
        interactions: [
            {
                id: 'rectangle-challenge',
                type: 'perimeter-input',
                tutorText: "To find the perimeter, we need to add up the lengths of all the sides. \n\nLet's give it a try with Farmer Giles' field. What's the total length of the fence he needs?",
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
                ContentComponent: FarmerCelebration,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Next'
            }
        ]
    },
    'square-field-practice': {
        interactions: [
            {
                id: 'square-challenge-input',
                type: 'perimeter-input',
                tutorText: "Now that you've got the hang of it, let's help some other people with their fencing problems. \n\nWhat's the perimeter of this next field?",
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
        ]
    },
    'triangle-field-practice': {
        interactions: [
            {
                id: 'triangle-challenge',
                type: 'perimeter-input',
                tutorText: "You're a real pro at this! \n\nReady for a new challenge?",
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
        ]
    },
    'pentagon-final-challenge': {
        interactions: [
            {
                id: 'pentagon-challenge',
                type: 'perimeter-input',
                tutorText: "Great job! Just one more to go!",
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
                ContentComponent: () => null,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Go to Next Lesson"
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
            },
            // Perimeter feedback interactions
            {
                id: 'rectangle-correct',
                type: 'tutor-monologue',
                tutorText: "That's exactly right! The perimeter is 100 meters.",
                transitionType: 'auto'
            },
            {
                id: 'rectangle-hint-1',
                type: 'tutor-monologue',
                tutorText: "Not quite. Remember, the perimeter is the total length around the entire outside edge of the farm. \n\nTake another look and try again.",
                transitionType: 'auto'
            },
            {
                id: 'rectangle-solution',
                type: 'rectangle-solution',
                tutorText: "Hmm, let's try a different approach. Let's add up the sides together. \n\nThirty plus twenty plus thirty plus twenty equals one hundred.",
                ContentComponent: RectangleSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            },
            {
                id: 'square-correct',
                type: 'tutor-monologue',
                tutorText: "Exactly! The perimeter of this square field is 60 meters.",
                transitionType: 'auto'
            },
            {
                id: 'square-hint-1',
                type: 'tutor-monologue',
                tutorText: "Not quite, try again!",
                transitionType: 'auto'
            },
            {
                id: 'square-solution',
                type: 'square-solution',
                tutorText: "Let's work this one out together. \n\nSince all four sides of a square are equal, we can add them up like this: Fifteen plus fifteen plus fifteen plus fifteen equals sixty.",
                ContentComponent: SquareSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            },
            {
                id: 'triangle-correct',
                type: 'tutor-monologue',
                tutorText: "Perfect! The perimeter is 40 meters.",
                transitionType: 'auto'
            },
            {
                id: 'triangle-hint-1',
                type: 'tutor-monologue',
                tutorText: "That's not it. Give it another shot!",
                transitionType: 'auto'
            },
            {
                id: 'triangle-solution',
                type: 'triangle-solution',
                tutorText: "No problem. Let's add them up: \n\nTen plus twelve plus eighteen equals forty.",
                ContentComponent: TriangleSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            },
            {
                id: 'pentagon-correct',
                type: 'tutor-monologue',
                tutorText: "Incredible! The perimeter of this pentagon is 40 meters.",
                transitionType: 'auto'
            },
            {
                id: 'pentagon-hint-1',
                type: 'tutor-monologue',
                tutorText: "Not quite right. Remember, a pentagon has five sides!",
                transitionType: 'auto'
            },
            {
                id: 'pentagon-solution',
                type: 'pentagon-solution',
                tutorText: "Let's add them up together: \n\nEight plus eight plus eight plus eight plus eight equals forty.",
                ContentComponent: PentagonSolution,
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            },
            // Design feedback interactions
            {
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
            {
                id: 'rectangle-design-hint-1',
                type: 'tutor-monologue',
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try adjusting the sides a bit more to get to exactly 20.",
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
            {
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
            {
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
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            },
            {
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
            {
                id: 'rectangle-design-hint-1-2',
                type: 'tutor-monologue',
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try adjusting the sides a bit more to get to exactly 26.",
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
            {
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
            {
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
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            },
            {
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
            {
                id: 'rectangle-design-hint-1-3',
                type: 'tutor-monologue',
                tutorText: "So close! Your perimeter is {currentPerimeter}. Try adjusting the sides a bit more to get to exactly 8.",
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
            {
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
            {
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
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: 'Continue'
            }
        ]
    },

    'shape-designer-intro': {
        title: "Shape Designer Tool",
        layout: "dual-panel",
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
                buttonText: "I'm Ready for a Challenge!",
                waitTime: 3000
            }
        ]
    },

    'rectangle-design-challenge': {
        title: "Rectangle Challenge",
        layout: "dual-panel", 
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
        ]
    },
    'rectangle-design-challenge-2': {
        title: "Rectangle Challenge",
        layout: "dual-panel", 
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
        ]
    },
    'rectangle-design-challenge-3': {
        title: "Rectangle Challenge",
        layout: "dual-panel", 
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
        ]
    }
}; 