import React from 'react'
import { useNavigate } from 'react-router-dom'
import LessonCard from '../components/LessonCard'
import { useDevModeNavigate } from '../utils/devMode'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'

function Home() {
    const navigate = useDevModeNavigate()

    const handleLessonSelect = () => {
        navigate('/lesson/perimeter')
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
                    px: '32px',
                    py: '16px'
                }}>
                    {/* Left Side - Welcome Message with Avatar */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <img
                            src="/images/tutor_avatar.png"
                            alt="Tutor Avatar"
                            style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain'
                            }}
                        />
                        <Box>
                            <Typography variant="caption" sx={{
                                color: '#999',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>
                                Welcome to Mathy
                            </Typography>
                            <Typography variant="h6" sx={{
                                color: '#fff',
                                fontSize: '20px',
                                fontWeight: '700'
                            }}>
                                Hi there
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
                            fontWeight: '600'
                        }}>
                            5th Grade
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: '40px 20px',
                boxSizing: 'border-box'
            }}>
                {/* Content Container - 75% width */}
                <div style={{
                    width: '75%',
                    maxWidth: '1200px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Header Section - Left Aligned */}
                    <div style={{
                        textAlign: 'left',
                        marginBottom: '50px',
                        width: '100%'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '16px'
                        }}>
                            Area and Perimeter
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#B3BDD2',
                            fontWeight: '300'
                        }}>
                            Let's explore shapes, numbers, and discover the magic of perimeter and area together
                        </p>
                    </div>

                    {/* Lesson Cards - Always Stacked Vertically */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        width: '100%',
                        marginBottom: '40px'
                    }}>
                        <LessonCard
                            lessonNumber="Lesson 1"
                            title="Introduction to Perimeter"
                            description="Learn how to calculate the Perimter of different shapes in a fun way!"
                            buttonText="Start Learning"
                            onClick={handleLessonSelect}
                            disabled={false}
                            backgroundColor="#17A94E"
                            tutorImage="perimeter_tutor.png"
                        />

                        <LessonCard
                            lessonNumber="Lesson 2"
                            title="Introduction to Area"
                            description="In this lesson you’ll be taught to find an area of a given shape."
                            buttonText="Coming Soon"
                            onClick={() => { }}
                            disabled={true}
                            backgroundColor="#FFB039"
                            tutorImage="area_tutor.png"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home