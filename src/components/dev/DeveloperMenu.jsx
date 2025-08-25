import React, { useState } from 'react';
import {
    IconButton,
    Drawer,
    Box,
    Typography,
    Button
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Code as CodeIcon
} from '@mui/icons-material';
import InteractionList from './InteractionList';

/**
 * Developer menu component that provides navigation tools for developers
 */
const DeveloperMenu = ({
    lessonId,
    currentPresIndex,
    currentInteractionIndex,
    onInteractionSelect,
    onResetLesson
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleResetLesson = () => {
        onResetLesson();
        handleClose();
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            <IconButton
                onClick={handleOpen}
                sx={{
                    color: '#4CAF50',
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '8px',
                    padding: '8px',
                    '&:hover': { 
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 0.5)'
                    }
                }}
                title="Developer Menu"
            >
                <CodeIcon />
            </IconButton>

            {/* Drawer Panel */}
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        bgcolor: '#1B1B1B',
                        color: '#fff',
                        width: 350,
                        borderLeft: '1px solid #333'
                    }
                }}
            >
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: '1px solid #333'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CodeIcon sx={{ color: '#4CAF50' }} />
                        <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                            Developer Mode
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        sx={{ color: '#999', '&:hover': { color: '#fff' } }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Current Status */}
                <Box sx={{ p: 2, borderBottom: '1px solid #333', bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                    <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
                        Current Position:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#fff', mb: 1 }}>
                        Lesson: {lessonId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                        {`Presentation: ${currentPresIndex + 1}`}
                        {' • '}
                        Interaction: {currentInteractionIndex + 1}
                    </Typography>
                </Box>

                {/* Reset Button */}
                <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
                    <Button
                        variant="outlined"
                        onClick={handleResetLesson}
                        fullWidth
                        sx={{
                            color: '#FF9800',
                            borderColor: '#FF9800',
                            '&:hover': {
                                bgcolor: 'rgba(255, 152, 0, 0.1)',
                                borderColor: '#FFB74D'
                            }
                        }}
                    >
                        Reset to Beginning
                    </Button>
                </Box>

                {/* Interaction List */}
                <InteractionList
                    lessonId={lessonId}
                    currentPresIndex={currentPresIndex}
                    currentInteractionIndex={currentInteractionIndex}
                    onInteractionSelect={onInteractionSelect}
                    onClose={handleClose}
                />
            </Drawer>
        </>
    );
};

export default DeveloperMenu;