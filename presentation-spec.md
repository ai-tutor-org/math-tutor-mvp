<!--
# Presentation Specification

## Purpose
This file contains the detailed specification for a presentation including all interactions, content, and expected behaviors. It serves as the single source of truth for what needs to be implemented.

## Usage
- User provides the complete presentation specification in markdown format
- Includes all interactions, tutor text, content requirements, and user flows
- Used as reference during implementation planning and development
- Should be updated if requirements change during development

## Structure
Each presentation spec should include:
- Presentation overview and learning objectives
- Complete list of interactions in order
- Detailed description of each interaction (tutor text, content, user actions, transitions)
- Special requirements (animations, physics, custom components)
- Success criteria and edge cases
-->

# Shape Sorting Game Presentation

Interaction Q1: The Problem (The Hook)
Type: Lesson Introduction
AI Tutor (Left Side): "Oh no! Welcome to the Shape Factory. We've had a bit of a mix-up, and all our shapes are jumbled together! We need a new Chief Organizer to help us sort everything out. Do you think you can help?"
Content (Right Side):
The AI Tutor's avatar is on the left side of the screen, next to their dialogue.
On the main screen area, a pile of jumbled, unsorted shapes is shown at the top.
There are no sorting containers visible yet.
A single button appears: "I can help!"


Interaction Q2: Introducing the Tools
Type: User Clicks "I can help!"
AI Tutor (Left Side): "Fantastic! A good organizer always prepares their workspace first. Let's bring out the sorting bins."
Content (Right Side): Four empty, clearly labeled containers animate into place at the bottom of the screen: "Rectangles," "Squares," "Triangles," and "Circles."

Interaction Q3: Modeling the Task ("I Do")
Type: Automatic Animation
AI Tutor (Left Side): "Let me show you how it works. This is a Square. See how it has 4 equal sides and 4 corners? It belongs in the 'Squares' bin. Like this!"
Content (Right Side): One square from the top pile gets a highlight and automatically animates into the "Squares" bin with a positive "pop" sound.

Interaction Q4: First Guided Attempt ("We Do")
Type: User Activity (Drag and Drop - Simplified)
AI Tutor (Left Side): "Now it's your turn. Here’s a Triangle. Take a look at its sides and corners, and drag it to the right bin."
Content (Right Side): A single triangle is presented to the user. Other shapes are faded to reduce distraction. The user can drag and drop it.

Interaction Q5: Scaffolding for the First Attempt
Type: Automatic Intervention / Fail-safe
Description: Triggers only during Interaction 4 if the user makes two incorrect attempts with the first triangle.
AI Tutor (Left Side): "Almost! This one can be tricky. A shape with 3 sides is always a triangle. No problem, let me get this one for you!"
Content (Right Side): The triangle automatically animates into the correct "Triangles" bin.

Interaction Q6: Transition to Small Group Practice
Type: Automatic (Triggers after the triangle is correctly sorted)
AI Tutor (Left Side): "Exactly! You've got the hang of it. Let's try sorting a small batch now."
Content (Right Side): Three new shapes appear at the top: a Rectangle, a Circle, and another Square.

Interaction Q7: Small Group Sorting ("You Do" with support)
Type: User Activity (Drag and Drop)
AI Tutor (Left Side): "Okay, Chief Organizer, sort these three shapes into their bins."
Content (Right Side): The user sorts the three shapes. The system provides full support during this phase.
System Logic:
WHEN user drops a shape in the CORRECT bucket: Positive sound, shape settles.
WHEN user drops a shape in an INCORRECT bucket (1st attempt): Gentle "bloop" sound, shape returns to the top.
WHEN user drops the same shape in an INCORRECT bucket (2nd attempt): Trigger Interaction 8 (Targeted Intervention).

Interaction Q8: Targeted Intervention
Type: Automatic Intervention
Description: Provides specific, corrective feedback.
AI Tutor (Left Side): "Hold on, let's check that! A shape in the 'Rectangles' bucket needs 4 sides. The shape you're holding, a Triangle, has 3 sides. It has its own special home!"
Content (Right Side): The correct bucket glows. The tutor says: "Try dropping it in the glowing bucket!"

Interaction Q9: Automated Correction
Type: Automatic Fail-safe
Description: Triggers if the user is still incorrect after the intervention in Interaction 8.
AI Tutor (Left Side): "No problem, let me help with this one! This [Shape Name] goes right over here."
Content (Right Side): The shape animates into the correct, glowing bucket.

Interaction Q10: Transition to Final Challenge
Type: Automatic (Triggers after the small batch of 3 is sorted)
AI Tutor (Left Side): "Incredible work! The factory is looking so much more organized. Here comes the final jumble. Let's go!"
Content (Right Side): The remaining 8 (or more) shapes appear at the top. A small counter with two stars [⭐ ⭐] might appear near the tutor to indicate available "helps".

Interaction Q11: The Final Challenge Gameplay Loop
Type: User Activity (Drag and Drop - Limited Help)
Description: The user must now sort the entire remaining batch of shapes. A new system variable, intervention_count, is initialized to 0.
User Activity: The user drags a shape from the top pile and drops it into one of the bins.
System Logic:
WHEN the user drops a shape in the CORRECT bucket:
A positive pop sound plays. The shape settles into the bucket.
WHEN the user drops a shape in an INCORRECT bucket (First Attempt on that shape):
A gentle bloop sound plays. The shape animates back to the top.
WHEN the user drops the same shape in ANY INCORRECT bucket (Second Attempt on that shape):
The system checks: IF intervention_count < 2:
Trigger Interaction 8 (Targeted Intervention).
Increment intervention_count by 1. (One star on the counter fades).
If the user still fails, Interaction 9 (Automated Correction) will trigger as the final part of that "help".
ELSE (if intervention_count is 2):
The AI Tutor remains silent. No intervention is triggered.
The system plays the gentle "bloop" sound and the shape animates back to the top, just like a first attempt. The user must now solve it through trial and error.


Interaction Q12: Game Completion
Type: Automatic (Triggers after the last shape is successfully sorted)
Content (Right Side): Celebratory animation with stars and confetti.
The tutor's response adapts based on performance:
IF the user sorted everything with zero interventions:
AI Tutor: "A perfect score! You're a true shape superstar! ⭐ You've made the factory perfectly organized without any help at all!"
ELSE (if the user received one or more interventions):
AI Tutor: "All sorted! Fantastic job finishing the puzzle. Even when it was tough, you kept trying and figured it all out. That perseverance is what makes a great problem-solver!"


Interaction Q13: Final Recap
Type: User Clicks "Next"
AI Tutor (Left Side): "As our Chief Organizer, let's do a final review of the shapes you sorted today. This will help you remember them for next time!"
Content (Right Side): A clean summary graphic appears, showing each shape category with its key properties visually highlighted, reinforcing the core lesson concepts.