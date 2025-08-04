import React from 'react'
import { useNavigate } from 'react-router-dom'
import NameInput from '../components/NameInput'

function LessonStart() {
    const navigate = useNavigate()

    const handleStartLesson = (name) => {
        // Save name to localStorage and navigate to the interactive lesson
        localStorage.setItem('userName', name)
        navigate('/interactive-lesson', { state: { userName: name } })
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