import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryButton from '../../../common/PrimaryButton';

const ShapeDesignInterface = ({ interaction, onCheck, visible }) => {
  if (!visible) return null;

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      {/* Target perimeter display */}
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
          Target: {interaction?.contentProps?.targetPerimeter} units
        </Typography>
      </Box>

      {/* Check button */}
      <PrimaryButton onClick={onCheck}>
        Check My Shape
      </PrimaryButton>
    </Box>
  );
};

export default ShapeDesignInterface;