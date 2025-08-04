import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LessonInterface from '../components/LessonInterface'

function Lesson() {
    const [userName, setUserName] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const name = localStorage.getItem('userName')
        if (name) {
            setUserName(name)
        }
    }, [])

    const startInteractiveLesson = () => {
        navigate('/interactive-lesson')
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #45b7d1 0%, #96ceb4 100%)',
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
                fontSize: '4rem',
                opacity: 0.1,
                animation: 'float 8s ease-in-out infinite'
            }}>
                🎯
            </div>

            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '15%',
                fontSize: '3.5rem',
                opacity: 0.1,
                animation: 'float 6s ease-in-out infinite reverse'
            }}>
                📐
            </div>

            {/* Main content */}
            <div style={{
                textAlign: 'center',
                zIndex: 2,
                maxWidth: '1000px',
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
                    🎓 Perimeter Lesson
                </h1>

                {userName && (
                    <p style={{
                        fontSize: '1.8rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '50px',
                        fontWeight: '300',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                    }}>
                        Welcome, {userName}! Let's learn about perimeter together! 🚀
                    </p>
                )}

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '40px'
                }}>
                    <LessonInterface />
                </div>

                {/* Interactive Lesson Button */}
                <button
                    onClick={startInteractiveLesson}
                    style={{
                        padding: '20px 40px',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        backgroundColor: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                        transition: 'all 0.3s ease',
                        marginTop: '20px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)'
                        e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 107, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                        e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 107, 0.4)'
                    }}
                >
                    🎯 Start Interactive Lesson with Vyas!
                </button>
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

export default Lesson 