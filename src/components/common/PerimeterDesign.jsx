import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryButton from './PrimaryButton';

const PerimeterDesign = ({ 
    targetPerimeter, 
    onCheck,
    buttonText = "Check My Shape" 
}) => {
    return (
        <Box sx={{ mb: 3, width: '100%' }}>
            <Box sx={{ mb: 2, textAlign: 'left' }}>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#fff', 
                        fontSize: '0.9rem', 
                        mb: 1, 
                        fontFamily: "'Fustat', 'Inter', sans-serif", 
                        fontWeight: 500 
                    }}
                >
                    Target: {targetPerimeter} units
                </Typography>
            </Box>
            <PrimaryButton onClick={onCheck}>
                {buttonText}
            </PrimaryButton>
        </Box>
    );
};

export default PerimeterDesign;