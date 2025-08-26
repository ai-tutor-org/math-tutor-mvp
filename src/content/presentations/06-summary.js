import React from 'react';

export const summaryPresentations = {
    'lesson-summary': {
        title: "Lesson Summary",
        interactions: [
            {
                id: 'lesson-summary-intro',
                type: 'lesson-summary',
                tutorText: "Great job! You learned about standard units and perimeter. \n\nPlease fill out the form to share your feedback.",
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