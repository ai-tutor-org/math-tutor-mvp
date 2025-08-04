import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Navigation() {
    const navigate = useNavigate()
    const location = useLocation()

    const goHome = () => {
        navigate('/')
    }

    const goBack = () => {
        navigate(-1)
    }

    // Don't show navigation on home page
    if (location.pathname === '/') {
        return null
    }

    return (
        <div style={{
            position: 'fixed',
            top: '30px',
            left: '30px',
            zIndex: 1000,
            display: 'flex',
            gap: '15px'
        }}>
            <button
                onClick={goBack}
                style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    borderRadius: '30px',
                    border: '2px solid #ff6b6b',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 15px rgba(255, 107, 107, 0.3)'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 8px 20px rgba(255, 107, 107, 0.4)'
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 6px 15px rgba(255, 107, 107, 0.3)'
                }}
            >
                ← Back
            </button>

            <button
                onClick={goHome}
                style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    borderRadius: '30px',
                    border: '2px solid #4ecdc4',
                    backgroundColor: '#4ecdc4',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 15px rgba(78, 205, 196, 0.3)'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 8px 20px rgba(78, 205, 196, 0.4)'
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 6px 15px rgba(78, 205, 196, 0.3)'
                }}
            >
                🏠 Home
            </button>
        </div>
    )
}

export default Navigation 