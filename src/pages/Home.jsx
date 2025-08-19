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
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>
                                Welcome to Mathy
                            </Typography>
                            <Typography variant="h6" sx={{
                                color: '#fff',
                                fontSize: { xs: '16px', sm: '20px' },
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
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '8px'
                        }}>
                            Area and Perimeter
                        </Typography>
                        <Typography sx={{
                            fontSize: { xs: '14px', sm: '16px' },
                            color: '#B3BDD2',
                            fontWeight: '300',
                            lineHeight: 1.5
                        }}>
                            Let's explore shapes, numbers, and discover the magic of perimeter and area together
                        </Typography>
                    </Box>

                    {/* Lesson Cards - Always Stacked Vertically */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: '20px', sm: '24px' },
                        width: '100%',
                        marginBottom: { xs: '20px', sm: '40px' }
                    }}>
                        <LessonCard
                            lessonNumber="Lesson 1"
                            title="Introduction to Perimeter"
                            description="Learn how to calculate the Perimter of different shapes in a fun way!"
                            buttonText="Start Lesson"
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
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default Home