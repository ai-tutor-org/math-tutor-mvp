export const shapeSortingPresentations = {
    'shape-sorting-factory': {
        interactions: [
            {
                id: 'shape-factory-intro',
                type: 'shape-sorting-game',
                tutorText: "Now that you've mastered measuring with standard units, let's apply what you've learned! \n\nWelcome to the Shape Factory - where we sort shapes by type. I'll guide you through this step by step.",
                tutorAnimation: 'explaining',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Show Me!",
                phaseConfig: { initialPhase: 'intro' }
            },
            {
                id: 'shape-tools-reveal',
                type: 'shape-sorting-game',
                tutorText: "Perfect! Let me show you your sorting tools - these special containers will help organize our shapes.",
                tutorAnimation: 'explaining',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Watch Demo!",
                phaseConfig: { initialPhase: 'tools' }
            },
            {
                id: 'shape-demo-modeling',
                type: 'shape-sorting-game',
                tutorText: "Watch carefully! I'll demonstrate by sorting one square into its matching container. See how the square goes to the squares container?",
                tutorAnimation: 'explaining',
                transitionType: 'interaction',
                showNextButton: true,
                nextButtonText: "Try It",
                phaseConfig: { initialPhase: 'modeling' }
            },
            {
                id: 'shape-guided-practice',
                type: 'shape-sorting-game',
                tutorText: "Now it's your turn! Try sorting this triangle into the correct container. Drag it to where you think it belongs.",
                tutorAnimation: 'normal-talking',
                transitionType: 'interaction-based',
                phaseConfig: { initialPhase: 'guided', targetShapes: 1 }
            },
            {
                id: 'shape-practice-setup',
                type: 'shape-sorting-game',
                tutorText: "Ready for more? This time you'll sort 3 different shapes. Remember - triangles with triangles, circles with circles, and so on. I'll help if you need it!",
                tutorAnimation: 'explaining',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Start Practice",
                phaseConfig: { initialPhase: 'practice_setup', targetShapes: 3 }
            },
            {
                id: 'shape-practice-main',
                type: 'shape-sorting-game',
                tutorText: "Go ahead and sort these 3 shapes! Take your time and think about which container each shape belongs in.",
                tutorAnimation: 'normal-talking',
                transitionType: 'interaction-based',
                phaseConfig: { initialPhase: 'practice', targetShapes: 3, maxInterventions: 2 }
            },
            {
                id: 'shape-challenge-setup',
                type: 'shape-sorting-game',
                tutorText: "Great progress! Now for the final challenge - you'll sort 8 shapes with minimal help. This will show how well you understand shape sorting!",
                tutorAnimation: 'explaining',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Begin Challenge",
                phaseConfig: { initialPhase: 'challenge_setup', targetShapes: 8 }
            },
            {
                id: 'shape-final-challenge',
                type: 'shape-sorting-game',
                tutorText: "Here we go! Sort all 8 shapes into their correct containers. You've got this!",
                tutorAnimation: 'normal-talking',
                transitionType: 'interaction-based',
                phaseConfig: { initialPhase: 'challenge', targetShapes: 8, maxInterventions: 1 }
            },
            {
                id: 'shape-completion',
                type: 'shape-sorting-game',
                tutorText: "Outstanding work! You've successfully completed the Shape Factory challenge. You've shown you can identify and sort shapes accurately!",
                tutorAnimation: 'happy-applauding',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "What's Next?",
                phaseConfig: { initialPhase: 'completion' }
            },
            {
                id: 'shape-recap-intro',
                type: 'shape-sorting-game',
                tutorText: "Let's recap what you learned: shapes can be sorted by their type.",
                tutorAnimation: 'explaining',
                transitionType: 'auto',
                phaseConfig: { initialPhase: 'recap' }
            },
            {
                id: 'shape-recap-triangle',
                type: 'shape-sorting-game',
                tutorText: "Triangles have three sides and three corners. They go in the triangles group.",
                tutorAnimation: 'explaining',
                transitionType: 'auto',
                phaseConfig: { initialPhase: 'recap' },
                contentProps: {
                    highlightedShape: 'triangle'
                }
            },
            {
                id: 'shape-recap-circle',
                type: 'shape-sorting-game',
                tutorText: "Circles are round with no corners or straight sides. They belong in the circles group.",
                tutorAnimation: 'explaining',
                transitionType: 'auto',
                phaseConfig: { initialPhase: 'recap' },
                contentProps: {
                    highlightedShape: 'circle'
                }
            },
            {
                id: 'shape-recap-rectangle',
                type: 'shape-sorting-game',
                tutorText: "Rectangles have four sides with opposite sides equal. They go in the rectangles group.",
                tutorAnimation: 'explaining',
                transitionType: 'auto',
                phaseConfig: { initialPhase: 'recap' },
                contentProps: {
                    highlightedShape: 'rectangle'
                }
            },
            {
                id: 'shape-recap-square',
                type: 'shape-sorting-game',
                tutorText: "Squares have four equal sides. They belong in the squares group.",
                tutorAnimation: 'explaining',
                transitionType: 'auto',
                phaseConfig: { initialPhase: 'recap' },
                contentProps: {
                    highlightedShape: 'square'
                }
            },
            {
                id: 'shape-recap-final',
                type: 'shape-sorting-game',
                tutorText: "Great work! You've learned to identify and sort all these different shapes. This skill will help you in many areas of math!",
                tutorAnimation: 'happy-applauding',
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Continue Lesson",
                phaseConfig: { initialPhase: 'recap' },
                contentProps: {
                    highlightedShape: 'all'
                }
            }
        ],
        feedbackRegistry: {
            'triangle-hint': {
                id: 'triangle-hint',
                type: 'tutor-monologue',
                tutorText: "Remember, a triangle has three sides. Look for the container labeled 'Triangles'.",
                transitionType: 'auto'
            },
            'triangle-auto-help': {
                id: 'triangle-auto-help',
                type: 'tutor-monologue',
                tutorText: "Let me help you with that triangle. Watch as I place it in the correct container.",
                transitionType: 'auto'
            },
            'triangle-correction': {
                id: 'triangle-correction',
                type: 'tutor-monologue',
                tutorText: "Great! Let's continue with the next shape.",
                transitionType: 'auto'
            },
            'circle-hint': {
                id: 'circle-hint',
                type: 'tutor-monologue',
                tutorText: "A circle is round with no corners. Find the 'Circles' container.",
                transitionType: 'auto'
            },
            'circle-auto-help': {
                id: 'circle-auto-help',
                type: 'tutor-monologue',
                tutorText: "No worries! Let me show you where this circle belongs.",
                transitionType: 'auto'
            },
            'circle-correction': {
                id: 'circle-correction',
                type: 'tutor-monologue',
                tutorText: "Perfect! You're getting the hang of this.",
                transitionType: 'auto'
            },
            'rectangle-hint': {
                id: 'rectangle-hint',
                type: 'tutor-monologue',
                tutorText: "This rectangle has four sides with opposite sides equal. Look for the 'Rectangles' container.",
                transitionType: 'auto'
            },
            'rectangle-auto-help': {
                id: 'rectangle-auto-help',
                type: 'tutor-monologue',
                tutorText: "Here, let me help you place this rectangle in the right spot.",
                transitionType: 'auto'
            },
            'rectangle-correction': {
                id: 'rectangle-correction',
                type: 'tutor-monologue',
                tutorText: "Excellent work! Keep going.",
                transitionType: 'auto'
            },
            'square-hint': {
                id: 'square-hint',
                type: 'tutor-monologue',
                tutorText: "A square has four equal sides. Find the 'Squares' container.",
                transitionType: 'auto'
            },
            'square-auto-help': {
                id: 'square-auto-help',
                type: 'tutor-monologue',
                tutorText: "Don't worry! Watch me put this square where it belongs.",
                transitionType: 'auto'
            },
            'square-correction': {
                id: 'square-correction',
                type: 'tutor-monologue',
                tutorText: "Wonderful! You sorted that perfectly.",
                transitionType: 'auto'
            }
        }
    }
};