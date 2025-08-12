
### Content Extension

#### Adding New Presentations

To add a new presentation to the system, follow these patterns from `contentData.js`:

**1. Presentation Structure**
```javascript
export const presentations = {
    'your-presentation-id': {
        interactions: [
            // Array of interaction objects
        ]
    }
};
```

**2. Interaction Object Pattern**
Each interaction follows this structure:
```javascript
{
    id: 'unique-interaction-id',           // Unique identifier for the interaction
    type: 'interaction-type',              // Defines the interaction behavior
    tutorText: "TTS content here",         // Text that will be spoken by tutor
    ContentComponent: ComponentName,       // (Optional) React component to render
    contentProps: { /* props */ },        // (Optional) Props passed to ContentComponent
    layout: 'full-screen' | 'dual-panel', // (Optional) Layout override
    layoutChange: 'dual-panel',            // (Optional) Trigger layout change
    transitionType: 'manual' | 'auto',    // How interaction progresses
    showNextButton: true,                  // (Optional) Show manual next button
    nextButtonText: 'Continue',            // (Optional) Custom button text
    showWelcomeButton: true,               // (Optional) Special welcome button
    navigateToInteraction: 'target-id'     // (Optional) Jump to specific interaction
}
```

**3. Common Interaction Types**
- `'welcome'`: Initial greeting with special welcome button
- `'tutor-monologue'`: Simple tutor speech with optional next button
- `'room-question'`: Question with visual content component
- `'multiple-choice-question'`: MCQ with choices in contentProps
- `'interactive-question'`: Custom interactive question component
- `'perimeter-input'`: Perimeter calculation input with shape visualization

**4. ContentComponent Integration**
Import components at the top of `contentData.js`:
```javascript
import { YourComponent } from './components';
```

Use in interaction:
```javascript
ContentComponent: YourComponent,
contentProps: {
    // Props specific to your component
    question: "Your question here",
    choices: [
        { text: 'Option 1', isCorrect: false },
        { text: 'Option 2', isCorrect: true }
    ]
}
```

**5. Layout Management**
- `layout: 'full-screen'`: Full screen content (used for welcome)
- `layoutChange: 'dual-panel'`: Switch to tutor + content layout
- Default is dual-panel if not specified

**6. Transition Control**
- `transitionType: 'auto'`: Auto-advance after TTS finishes
- `transitionType: 'manual'`: Require user interaction to continue
- `showNextButton: true` + `nextButtonText`: Custom next button

**7. Adding to Lesson Sequence**
Update the lesson's sequence array in the `lessons` object:
```javascript
sequence: [
    {
        presentationId: 'your-presentation-id',
        transition: { type: 'manual', buttonText: "Continue" }
    }
]
```

**8. Conditional Presentations**
For presentations accessed conditionally (like feedback), add to:
```javascript
conditionalPresentations: [
    'your-conditional-presentation-id'
]
```

**9. Feedback Interactions**
Create feedback interactions in a dedicated presentation (like 'feedback-interactions') with specific IDs that can be referenced by `feedbackIds` in contentProps:
```javascript
contentProps: {
    feedbackIds: {
        correct: 'your-correct-feedback-id',
        hint1: 'your-hint-feedback-id',
        solution: 'your-solution-feedback-id'
    }
}
```
