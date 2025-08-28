import React from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../components/common/LessonCard'
import { useDevModeNavigate } from '../utils/devMode'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import { getLessonsList } from '../content/lessons'

function Home() {
    const navigate = useDevModeNavigate()
    const lessonsList = getLessonsList()

    const handleLessonSelect = (lessonId) => {
        navigate(`/lesson/${lessonId}`)
    }

    return (
        <div style={{
            width: '100vw',
            minHeight: '100vh',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header Bar - Similar to InteractiveLesson */}
            <AppBar position="static" sx={{
                bgcolor: '#000',
                boxShadow: 'none',
                borderBottom: '1px solid #2B2B2B'
            }}>
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    minHeight: '60px !important',
                    px: { xs: '16px', sm: '32px' },
                    py: '16px'
                }}>
                    {/* Left Side - Welcome Message with Avatar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: { xs: '40px', sm: '50px' },
                            height: { xs: '40px', sm: '50px' }
                        }}>
                            <img
                                src="/images/tutor_avatar.png"
                                alt="Tutor Avatar"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{
                                color: '#999',
                                fontFamily: 'Fustat',
                                fontWeight: '500',
                                textTransform: 'uppercase'
                            }}>
                                Welcome to Mathy
                            </Typography>
                            <Typography variant="h6" sx={{
                                color: '#fff',
                                fontSize: { xs: '16px', sm: '20px' },
                                fontFamily: 'Fustat',
                                fontWeight: '500'
                            }}>
                                Hey learner!
                            </Typography>
                        </Box>
                    </Box>
                    {/* Right Side - Grade Label */}
                    <Box sx={{
                        bgcolor: '#24262B',
                        color: '#FFF',
                        padding: '6px 16px',
                        borderRadius: '8px'
                    }}>
                        <Typography sx={{
                            fontFamily: 'Fustat',
                            fontWeight: '500'
                        }}>
                            5th Grade
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: { xs: '20px 16px', sm: '40px 20px' },
                boxSizing: 'border-box'
            }}>
                {/* Content Container - Responsive width */}
                <Box sx={{
                    width: { xs: '100%', sm: '90%', md: '75%' },
                    maxWidth: '1200px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Header Section - Left Aligned */}
                    <Box sx={{
                        textAlign: 'left',
                        marginBottom: { xs: '30px', sm: '50px' },
                        width: '100%'
                    }}>
                        <Typography variant="h1" sx={{
                            fontSize: { xs: '24px', sm: '32px' },
                            fontFamily: 'Fustat',
                            fontWeight: '500',
                            color: 'white',
                            marginBottom: '8px'
                        }}>
                            Math Tutor
                        </Typography>
                        <Typography sx={{
                            fontSize: { xs: '14px', sm: '16px' },
                            color: '#B3BDD2',
                            fontFamily: 'Fustat',
                            fontWeight: '500',
                            lineHeight: 1.5
                        }}>
                            A warm, engaging and fun AI tutor for children
                        </Typography>
                    </Box>

                    {/* Lesson Cards - Dynamic from lessons.js */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: '20px', sm: '24px' },
                        width: '100%',
                        marginBottom: { xs: '20px', sm: '40px' }
                    }}>
                        {lessonsList.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                lessonNumber={`Lesson ${lesson.order}`}
                                title={lesson.title}
                                description={lesson.description}
                                buttonText={lesson.status === 'available' ? 'Start Lesson' : 'Coming Soon'}
                                onClick={() => lesson.status === 'available' && handleLessonSelect(lesson.id)}
                                disabled={lesson.status !== 'available'}
                                backgroundColor={lesson.theme.backgroundColor}
                                tutorImage={lesson.theme.tutorImage}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default Home