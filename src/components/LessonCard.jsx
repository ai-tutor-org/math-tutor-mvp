import React, { useState } from 'react'

function LessonCard({ title, description, onClick }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="lesson-card"
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                border: '3px solid #ff6b6b',
                borderRadius: '30px',
                padding: '40px',
                margin: '20px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isHovered ? 'scale(1.05) translateY(-15px)' : 'scale(1)',
                boxShadow: isHovered
                    ? '0 25px 50px rgba(255, 107, 107, 0.4), 0 15px 30px rgba(0,0,0,0.1)'
                    : '0 15px 40px rgba(0,0,0,0.1), 0 8px 20px rgba(255, 107, 107, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '500px',
                minWidth: '400px',
                width: '100%'
            }}
        >
            {/* Animated background gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: isHovered
                    ? 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1), rgba(69, 183, 209, 0.1))'
                    : 'linear-gradient(45deg, rgba(255, 107, 107, 0.05), rgba(78, 205, 196, 0.05))',
                transition: 'all 0.4s ease',
                zIndex: 0
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '20px',
                    textAlign: 'center',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                }}>
                    {title}
                </h2>

                <p style={{
                    fontSize: '1.3rem',
                    color: '#34495e',
                    textAlign: 'center',
                    lineHeight: '1.6',
                    margin: 0,
                    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                    transition: 'transform 0.3s ease'
                }}>
                    {description}
                </p>

                {/* Fun arrow indicator */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '30px',
                    fontSize: '2rem',
                    opacity: isHovered ? 1 : 0.7,
                    transform: isHovered ? 'translateX(15px)' : 'translateX(0)',
                    transition: 'all 0.3s ease'
                }}>
                    {isHovered ? '🎯' : '👉'}
                </div>
            </div>

            {/* Floating particles on hover */}
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 2
                }}>
                    {['✨', '🎯', '💫'].map((particle, index) => (
                        <span
                            key={index}
                            style={{
                                position: 'absolute',
                                fontSize: '1.5rem',
                                animation: `particleFloat ${2 + index * 0.5}s ease-in-out infinite`,
                                animationDelay: `${index * 0.3}s`,
                                top: `${20 + index * 20}%`,
                                left: `${10 + index * 30}%`
                            }}
                        >
                            {particle}
                        </span>
                    ))}
                </div>
            )}

            {/* CSS animations */}
            <style>{`
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-15px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    )
}

export default LessonCard 