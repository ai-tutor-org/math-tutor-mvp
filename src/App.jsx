import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ToastProvider from './components/ToastProvider'
import { useToast } from './hooks/toast/useToast'
import notificationService from './services/NotificationService'
import Home from './pages/Home'
import InteractiveLesson from './pages/InteractiveLesson'

// Component to initialize NotificationService with ToastProvider
const NotificationServiceInitializer = () => {
    const toastContext = useToast();

    useEffect(() => {
        // Initialize the notification service with our toast provider
        notificationService.initialize(toastContext);
        console.log('🎉 NotificationService initialized globally');
    }, [toastContext]);

    return null; // This component only handles initialization
};

// Main App Component wrapped with ToastProvider
function App() {
    return (
        <ToastProvider
            config={{
                duration: 5000,
                position: 'top-right'
            }}
            messages={{
                success: 'Operation completed successfully!',
                error: 'An error occurred. Please try again.',
                warning: 'Please pay attention to this warning.',
                info: 'Here is some helpful information.'
            }}
        >
            <NotificationServiceInitializer />
            <Router basename="/math-tutor-mvp/">
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/lesson/:lessonId" element={<InteractiveLesson />} />
                    </Routes>
                </div>
            </Router>
        </ToastProvider>
    )
}

export default App 