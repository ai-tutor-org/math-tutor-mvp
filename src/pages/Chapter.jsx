import React from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../components/common/LessonCard'
import { useDevModeNavigate } from '../utils/devMode'

function Chapter() {
    const navigate = useDevModeNavigate()

    const handleLessonSelect = () => {
        navigate('/lesson-start')
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '15%',
                right: '15%',
                fontSize: '5rem',
                opacity: 0.1,
                animation: 'float 6s ease-in-out infinite'
            }}>
                📐
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '15%',
                fontSize: '4rem',
                opacity: 0.1,
                animation: 'float 8s ease-in-out infinite reverse'
            }}>
                🧮
            </div>

            {/* Main content */}
            <div style={{
                textAlign: 'center',
                zIndex: 2,
                maxWidth: '800px',
                width: '100%',
                padding: '0 40px'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                    📚 Area and Perimeter
                </h1>

                <p style={{
                    fontSize: '1.8rem',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '60px',
                    fontWeight: '300',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}>
                    Choose your adventure! 🚀
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <LessonCard
                        title="Perimeter"
                        description="🎯 Learn how to calculate the perimeter of different shapes in a fun way!"
                        onClick={handleLessonSelect}
                    />
                </div>
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    )
}

export default Chapter 