# Adding New Presentations Process

## 1. Draft Interactions Document
Create a markdown file with detailed interaction flows:

```markdown
#### **Presentation Name**

* **Interaction 1**  
  * **AI Tutor (Left Side):** "Tutor dialogue text"  
  * **Content (Right Side):** Description of visual content and user interactions
  * Transition: Auto/Manual/Conditional details
  * Conditionals (if any):
    * If condition, go to interaction X
    * If other condition, go to interaction Y

* **Interaction 2**
  * (continue pattern...)
```

## 2. Review and Refine
- Check interaction flow logic
- Ensure conditionals are well-defined
- Add retry attempts where needed (typically 2 attempts before solution)
- Verify transitions make sense

## 3. Break Into Logical Presentations
Group related interactions:
- **Intro/Setup presentations**: Introduction and tool familiarization
- **Challenge presentations**: Task-focused with retry logic
- **Practice presentations**: Guided practice activities

## 4. Convert to contentData.js Structure

### Add to lesson sequence:
```javascript
{
    presentationId: 'presentation-name',
    transition: { type: 'manual', buttonText: "Continue" }
}
```

### Follow existing patterns:
- Use `feedbackIds` for challenges with multiple attempts:
  ```javascript
  feedbackIds: {
      correct: 'challenge-correct',
      hint1: 'challenge-hint-1', 
      hint2: 'challenge-hint-2',
      solution: 'challenge-solution'
  }
  ```
- Separate feedback interactions for each attempt
- Use `contentProps` to configure component behavior
- Follow naming: `layout: "dual-panel"`, `transitionType: 'manual/auto/conditional'`

### Define comprehensive contentProps:
```javascript
contentProps: {
    mode: 'welcome|practice|challenge|success|hint|solution',
    // Layout props
    showGrid: true,
    showSideLabels: true,
    // Interaction props  
    enableDragging: true,
    highlightDragIcon: true,
    // Challenge props
    targetValue: X,
    enableValidation: true,
    // Feedback props
    showSuccess: true,
    showCheckmark: true
}
```

## 5. Import Required Components
Add new components to imports at top of contentData.js:
```javascript
import {
    ExistingComponent,
    NewComponent
} from './components';
```

## Key Principles
- **Single component, multiple modes**: Use props to configure behavior rather than separate components
- **Follow existing patterns**: Match structure of similar presentations in the file
- **2-attempt rule**: Allow 2 attempts before showing solution for challenges
- **Consistent naming**: Use descriptive, consistent IDs and prop names