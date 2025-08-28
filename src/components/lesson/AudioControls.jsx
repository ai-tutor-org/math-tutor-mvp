import React from 'react';
import { Box, IconButton } from '@mui/material';
import {
    VolumeOff as VolumeOffIcon,
    VolumeUp as VolumeUpIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import './AudioControls.css';

const AudioControls = ({
    isMuted = false,
    isTTSPaused = false,
    isSpeaking = false,
    onMuteToggle,
    onTTSPauseResume
}) => {
    return (
        <Box className="lesson-audio-controls">
            <IconButton 
                sx={{
                    color: isMuted ? '#999' : '#fff',
                    '&:hover': {
                        color: isMuted ? '#bbb' : '#fff',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                }} 
                onClick={onMuteToggle}
            >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <IconButton 
                sx={{
                    color: (isSpeaking || isTTSPaused) ? '#fff' : '#999',
                    cursor: (isSpeaking || isTTSPaused) ? 'pointer' : 'not-allowed',
                    '&:hover': { color: (isSpeaking || isTTSPaused) ? '#fff' : '#999' }
                }} 
                onClick={(isSpeaking || isTTSPaused) ? onTTSPauseResume : (e) => e.preventDefault()}
            >
                {isTTSPaused ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
        </Box>
    );
};

export default AudioControls;