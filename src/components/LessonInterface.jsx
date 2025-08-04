import React from 'react'

function LessonInterface() {
    return (
        <div className="lesson-interface" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            padding: '50px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            width: '100%',
            margin: '0 auto'
        }}>
            <h2 style={{
                fontSize: '2.8rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: '30px',
                textAlign: 'center'
            }}>
                🎯 Perimeter Learning Interface
            </h2>

            <p style={{
                fontSize: '1.4rem',
                color: '#34495e',
                textAlign: 'center',
                marginBottom: '40px',
                lineHeight: '1.6'
            }}>
                This is where the interactive perimeter learning will happen!
            </p>

            <div style={{
                border: '3px dashed #4ecdc4',
                borderRadius: '25px',
                padding: '50px',
                margin: '30px 0',
                backgroundColor: 'rgba(78, 205, 196, 0.05)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    fontSize: '2.5rem',
                    opacity: 0.3
                }}>
                    ✨
                </div>

                <p style={{
                    fontSize: '1.6rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    🎯 Interactive Perimeter Learning Coming Soon!
                </p>

                <p style={{
                    fontSize: '1.3rem',
                    color: '#34495e',
                    marginBottom: '35px',
                    textAlign: 'center'
                }}>
                    Here you'll be able to:
                </p>

                <ul style={{
                    textAlign: 'left',
                    display: 'inline-block',
                    fontSize: '1.3rem',
                    color: '#34495e',
                    lineHeight: '2.2'
                }}>
                    <li>🎨 Create and manipulate shapes</li>
                    <li>⚡ See perimeter calculations in real-time</li>
                    <li>🎮 Practice with interactive problems</li>
                    <li>📚 Learn step-by-step explanations</li>
                    <li>🏆 Earn points and achievements</li>
                    <li>🌟 Have fun while learning!</li>
                </ul>
            </div>
        </div>
    )
}

export default LessonInterface 