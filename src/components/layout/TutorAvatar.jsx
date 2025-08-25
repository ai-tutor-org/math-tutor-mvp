import React, { useState, useEffect } from 'react'

function TutorAvatar({ isWaving = false, isSpeaking = false }) {
    const [waveAnimation, setWaveAnimation] = useState(false)

    useEffect(() => {
        if (isWaving) {
            setWaveAnimation(true)
            const timer = setTimeout(() => setWaveAnimation(false), 2000)
            return () => clearTimeout(timer)
        }
    }, [isWaving])

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            height: '200px'
        }}>
            {/* Avatar Body */}
            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#4ecdc4',
                border: '4px solid #2c3e50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                animation: isSpeaking ? 'pulse 1s ease-in-out infinite' : 'none'
            }}>
                {/* Face */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#ffd93d',
                    border: '3px solid #f39c12',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Eyes */}
                    <div style={{
                        position: 'absolute',
                        top: '25px',
                        left: '20px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#2c3e50',
                        animation: isSpeaking ? 'blink 3s infinite' : 'none'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '25px',
                        right: '20px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#2c3e50',
                        animation: isSpeaking ? 'blink 3s infinite' : 'none'
                    }} />

                    {/* Smile */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '10px',
                        borderBottom: '3px solid #2c3e50',
                        borderLeft: '3px solid #2c3e50',
                        borderRight: '3px solid #2c3e50',
                        borderRadius: '0 0 20px 20px'
                    }} />
                </div>
            </div>

            {/* Waving Hand */}
            {waveAnimation && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '2rem',
                    animation: 'wave 0.5s ease-in-out infinite',
                    transformOrigin: 'bottom right'
                }}>
                    👋
                </div>
            )}

            {/* Speaking Indicator */}
            {isSpeaking && (
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '20px',
                    fontSize: '1.5rem',
                    animation: 'bounce 1s ease-in-out infinite'
                }}>
                    💬
                </div>
            )}

            {/* Name */}
            <div style={{
                marginTop: '15px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#2c3e50',
                textAlign: 'center'
            }}>
                Vyas
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    )
}

export default TutorAvatar 