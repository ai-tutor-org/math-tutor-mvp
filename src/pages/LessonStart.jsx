import React from 'react'
import { useNavigate } from 'react-router-dom'
import NameInput from '../components/NameInput'
import { useDevModeNavigate, useIsDevMode } from '../utils/devMode'

function LessonStart() {
    const navigate = useDevModeNavigate()
    const isDevMode = useIsDevMode()

    const handleStartLesson = (name) => {
        // Save name to localStorage and navigate to the interactive lesson
        localStorage.setItem('userName', name)
        navigate('/lesson/perimeter', { state: { userName: name } })
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ffc371 100%)'
        }}>
            <NameInput onStart={handleStartLesson} />
        </div>
    )
}

export default LessonStart 