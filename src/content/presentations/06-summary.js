import React from 'react';

export const summaryPresentations = {
    'lesson-summary': {
        title: "Lesson Summary",
        layout: "dual-panel",
        interactions: [
            {
                id: 'lesson-summary-intro',
                type: 'lesson-summary',
                tutorText: "Congratulations! You've completed our perimeter lesson. Let's review what you learned:\n\n• Standard units help everyone measure consistently\n• Perimeter is the distance around the outside of a shape\n• You can find perimeter by adding up all the sides\n• Different shapes can have the same perimeter\n\nI hope you enjoyed learning about perimeter with me! Please fill out the form on the right to share your feedback.",
                tutorAnimation: 'on-completion-confetti-happy',
                ContentComponent: () => {
                    return React.createElement('div', {
                        style: { 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    }, React.createElement('iframe', {
                        src: "https://forms.gle/UqVNWtoUw4eac3Yy9",
                        width: "100%", 
                        height: "600",
                        frameBorder: "0", 
                        marginHeight: "0", 
                        marginWidth: "0",
                        style: {
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                        }
                    }, "Loading..."));
                },
                transitionType: 'manual',
                showNextButton: true,
                nextButtonText: "Finish Lesson"
            }
        ]
    }
};