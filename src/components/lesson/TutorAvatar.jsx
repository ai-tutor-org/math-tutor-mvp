import React from 'react';
import { Box } from '@mui/material';
import { shouldAnimationLoop } from '../../utils/animationHelpers';
import './TutorAvatar.css';

const TutorAvatar = ({ 
    animation = null,
    isWaving = false,
    videoRef = null
}) => {
    return (
        <Box className="lesson-mb-3">
            {animation ? (
                <video
                    ref={videoRef}
                    src={`/animations/${animation}.webm`}
                    autoPlay
                    loop={shouldAnimationLoop(animation)}
                    muted
                    style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover'
                    }}
                />
            ) : (
                <img
                    src="/images/tutor.svg"
                    alt="AI Tutor"
                    style={{
                        width: '100px',
                        height: '100px'
                    }}
                />
            )}
        </Box>
    );
};

export default TutorAvatar;