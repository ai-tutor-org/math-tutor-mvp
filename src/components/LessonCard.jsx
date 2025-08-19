import React, { useState } from 'react'
import { PlayArrow } from '@mui/icons-material'

function LessonCard({ 
    lessonNumber,
    title, 
    description, 
    buttonText, 
    onClick, 
    disabled = false,
    backgroundColor = 'white',
    tutorImage
}) {
    const [isHovered, setIsHovered] = useState(false)
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = () => {
        if (!disabled) {
            setIsClicked(true)
            setTimeout(() => setIsClicked(false), 300)
            onClick()
        }
    }

    const getLevelColor = () => {
        switch(level?.toLowerCase()) {
            case 'beginner':
                return '#4CAF50'
            case 'intermediate':
                return '#FF9800'
            case 'advanced':
                return '#F44336'
            default:
                return '#9E9E9E'
        }
    }

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: backgroundColor,
                borderRadius: '16px',
                padding: '32px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isClicked 
                    ? 'scale(0.98)' 
                    : isHovered 
                        ? 'translateY(-8px)' 
                        : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 20px 40px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2)'
                    : '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)',
                opacity: 1,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Main Container - Horizontal on desktop, vertical on mobile */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '24px',
                width: '100%'
            }} className="card-content-container">
                {/* Left - Tutor Image */}
                {tutorImage && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <img 
                            src={`/images/${tutorImage}`}
                            alt="Lesson Tutor"
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                )}

                {/* Middle - Text Content */}
                <div style={{ 
                    flex: 1,
                    minWidth: 0 // Prevents text overflow
                }}>
                    {/* Lesson Number */}
                    {lessonNumber && (
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: 0,
                            marginBottom: '8px',
                            fontWeight: '700'
                        }}>
                            {lessonNumber}
                        </p>
                    )}

                    {/* Title */}
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#000',
                        margin: 0,
                        marginBottom: '8px',
                        lineHeight: '1.3'
                    }}>
                        {title}
                    </h3>

                    {/* Description */}
                    <p style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#3F2A0B',
                        margin: 0,
                        lineHeight: '1.5'
                    }}>
                        {description}
                    </p>
                </div>

                {/* Right Side - Button */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <button
                        style={{
                            display: 'flex',
                            width: '154px',
                            height: '52px',
                            padding: '10px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 0,
                            borderRadius: '32px',
                            background: disabled ? '#FEE97D' : '#67E697',
                            color: disabled ? '#B2761B' : '#0C612C',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            transform: isHovered && !disabled ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: isHovered && !disabled
                                ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                                : '0 2px 4px rgba(0, 0, 0, 0.1)',
                            whiteSpace: 'nowrap'
                        }}
                        disabled={disabled}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!disabled && (
                            <PlayArrow style={{
                                fontSize: '20px'
                            }} />
                        )}
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'rgba(255, 255, 255, 0.5)',
                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s ease',
                borderRadius: '16px 16px 0 0'
            }} />

            {/* Responsive styles */}
            <style>{`
                @media (max-width: 768px) {
                    .card-content-container {
                        flex-direction: column !important;
                        align-items: center !important;
                        gap: 20px !important;
                        text-align: center !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default LessonCard