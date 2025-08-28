import React from 'react';
import { Box, Typography } from '@mui/material';
import MeasurementInput from '../../../common/MeasurementInput';

const PerimeterInputInterface = ({ interaction, perimeterHook, onCheck, visible }) => {
  if (!visible) return null;

  const renderPerimeterEquation = () => {
    const { shape, correctAnswer } = interaction.contentProps;
    
    if (!perimeterHook.showPerimeterSolution) return null;

    let equation = '';
    if (shape?.type === 'rectangle') {
      equation = `${shape.width} + ${shape.height} + ${shape.width} + ${shape.height} = ${correctAnswer}`;
    } else if (shape?.type === 'square') {
      equation = `${shape.side} + ${shape.side} + ${shape.side} + ${shape.side} = ${correctAnswer}`;
    } else if (shape?.type === 'triangle' && shape?.sides) {
      equation = `${shape.sides.join(' + ')} = ${correctAnswer}`;
    } else if (shape?.type === 'pentagon' && shape?.sides) {
      equation = `${shape.sides.join(' + ')} = ${correctAnswer}`;
    }

    if (!equation) return null;

    return (
      <Box sx={{ mb: 2, textAlign: 'left' }}>
        <Typography 
          variant="body2" 
          sx={{ color: '#4CAF50', fontSize: '0.9rem' }}
        >
          {equation}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      {renderPerimeterEquation()}
      <MeasurementInput
        value={perimeterHook.perimeterInput}
        onInputChange={perimeterHook.setPerimeterInput}
        onCheck={onCheck}
        disabled={perimeterHook.showPerimeterSolution}
        placeholder="Enter perimeter"
        unit={interaction?.contentProps?.shape?.unit || 'units'}
      />
    </Box>
  );
};

export default PerimeterInputInterface;