import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chapter from './pages/Chapter'
import LessonStart from './pages/LessonStart'
import Lesson from './pages/Lesson'
import InteractiveLesson from './pages/InteractiveLesson'
import Navigation from './components/Navigation'

function App() {
    return (
        <Router basename="/math-tutor-mvp/">
            <div className="App">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chapter" element={<Chapter />} />
                    <Route path="/lesson-start" element={<LessonStart />} />
                    <Route path="/lesson" element={<Lesson />} />
                    <Route path="/lesson/:lessonId" element={<InteractiveLesson />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App 