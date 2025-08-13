import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import InteractiveLesson from './pages/InteractiveLesson'

function App() {
    return (
        <Router basename="/math-tutor-mvp/">
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lesson/:lessonId" element={<InteractiveLesson />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App 
