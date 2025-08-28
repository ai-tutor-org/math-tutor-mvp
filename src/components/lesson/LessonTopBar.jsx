import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DeveloperMenu from '../dev/DeveloperMenu';
import './LessonTopBar.css';

const LessonTopBar = ({
    lessonTitle = 'Perimeter',
    lessonId = 'perimeter',
    isDevMode = false,
    currentPresIndex = 0,
    currentInteractionIndex = 0,
    onInteractionSelect,
    onResetLesson,
    onHomeClick,
    onBackClick
}) => {
    return (
        <AppBar position="static" className="lesson-app-bar">
            <Toolbar className="lesson-toolbar">
                {/* Left Side - Lesson Info */}
                <Box>
                    <Typography variant="caption" className="lesson-info-caption">
                        LESSON {lessonId === 'perimeter' ? '1' : '1'}
                        {isDevMode && (
                            <span style={{ color: '#4CAF50', marginLeft: '8px', fontWeight: 600 }}>
                                • DEV MODE
                            </span>
                        )}
                    </Typography>
                    <Typography variant="h6" className="lesson-info-title">
                        {lessonTitle}
                    </Typography>
                </Box>

                {/* Right Side - Navigation */}
                <Box className="lesson-nav-buttons">
                    {/* Developer Menu */}
                    {isDevMode && (
                        <DeveloperMenu
                            lessonId={lessonId}
                            currentPresIndex={currentPresIndex}
                            currentInteractionIndex={currentInteractionIndex}
                            onInteractionSelect={onInteractionSelect}
                            onResetLesson={onResetLesson}
                        />
                    )}
                    <IconButton
                        sx={{
                            color: '#fff',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '8px',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                        }}
                        onClick={onHomeClick}
                    >
                        <HomeIcon />
                    </IconButton>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: '#fff',
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
                        }}
                        onClick={onBackClick}
                    >
                        Go Back
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default LessonTopBar;