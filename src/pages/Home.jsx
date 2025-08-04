import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChapterCard from '../components/ChapterCard'

function Home() {
    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showSparkles, setShowSparkles] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
        const timer = setTimeout(() => setShowSparkles(true), 500)
        return () => clearTimeout(timer)
    }, [])

    const handleChapterSelect = () => {
        navigate('/chapter')
    }

    const sparkles = ['✨', '🌟', '💫', '⭐', '🎯', '🎨', '🧮', '📐']

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '15%',
                left: '15%',
                fontSize: '4rem',
                opacity: 0.1,
                animation: 'float 6s ease-in-out infinite',
                transform: `translateY(${isLoaded ? '0px' : '50px'})`,
                transition: 'transform 1s ease-out'
            }}>
                📐
            </div>

            <div style={{
                position: 'absolute',
                top: '25%',
                right: '20%',
                fontSize: '3.5rem',
                opacity: 0.1,
                animation: 'float 8s ease-in-out infinite reverse',
                transform: `translateY(${isLoaded ? '0px' : '-30px'})`,
                transition: 'transform 1.2s ease-out'
            }}>
                🧮
            </div>

            <div style={{
                position: 'absolute',
                bottom: '25%',
                left: '20%',
                fontSize: '3rem',
                opacity: 0.1,
                animation: 'float 7s ease-in-out infinite',
                transform: `translateY(${isLoaded ? '0px' : '40px'})`,
                transition: 'transform 0.8s ease-out'
            }}>
                🎯
            </div>

            {/* Main content */}
            <div style={{
                textAlign: 'center',
                zIndex: 2,
                transform: `translateY(${isLoaded ? '0px' : '100px'})`,
                opacity: isLoaded ? 1 : 0,
                transition: 'all 1s ease-out',
                maxWidth: '800px',
                width: '100%',
                padding: '0 40px'
            }}>
                {/* Title with fun styling */}
                <h1 style={{
                    fontSize: '4.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                    backgroundSize: '300% 300%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradientShift 3s ease-in-out infinite'
                }}>
                    🎓 TutorP
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '2rem',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '40px',
                    fontWeight: '300',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}>
                    Learning Math is FUN! 🚀
                </p>

                {/* Fun description */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '25px',
                    padding: '30px',
                    marginBottom: '50px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: '700px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <p style={{
                        fontSize: '1.3rem',
                        color: 'white',
                        margin: '0',
                        lineHeight: '1.6'
                    }}>
                        Ready for an amazing adventure in mathematics?
                        Let's explore shapes, numbers, and discover the magic of perimeter together!
                        🎨✨
                    </p>
                </div>

                {/* Sparkles animation */}
                {showSparkles && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}>
                        {sparkles.map((sparkle, index) => (
                            <span
                                key={index}
                                style={{
                                    position: 'absolute',
                                    fontSize: '2rem',
                                    animation: `sparkle ${2 + index * 0.5}s ease-in-out infinite`,
                                    animationDelay: `${index * 0.2}s`,
                                    opacity: 0
                                }}
                            >
                                {sparkle}
                            </span>
                        ))}
                    </div>
                )}

                {/* Chapter card with enhanced styling */}
                <div style={{
                    transform: `scale(${isLoaded ? 1 : 0.8})`,
                    transition: 'transform 0.8s ease-out 0.5s',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <ChapterCard
                        title="Area and Perimeter"
                        description="🎯 Explore shapes and their measurements in a fun way!"
                        onClick={handleChapterSelect}
                    />
                </div>

                {/* Fun footer */}
                <div style={{
                    marginTop: '60px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '1.1rem'
                }}>
                    <p>🌟 Made with ❤️ for curious minds 🌟</p>
                </div>
            </div>

            {/* CSS animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes sparkle {
          0% { 
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          50% { 
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1) rotate(180deg);
            opacity: 1;
          }
          100% { 
            transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    )
}

export default Home 