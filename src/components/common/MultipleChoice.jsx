import React from 'react';
import { Box, Button } from '@mui/material';

const MultipleChoice = ({
    choices,
    onAnswer,
    disabled = false
}) => {
    return (
        <Box sx={{ mb: 3, width: '100%' }}>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {choices?.map((choice, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            onClick={() => onAnswer(choice)}
                            disabled={disabled}
                            sx={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #545E7D',
                                background: '#484D5C',
                                fontWeight: 500,
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                textAlign: 'left',
                                justifyContent: 'flex-start',
                                fontFamily: "'Fustat', 'Inter', sans-serif",
                                '&:hover': {
                                    background: '#545E7D',
                                    borderColor: '#545E7D'
                                },
                                '&:disabled': {
                                    background: '#3a3a3a',
                                    borderColor: '#3a3a3a',
                                    color: '#888',
                                    opacity: 0.6
                                }
                            }}
                        >
                            {choice.text}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default MultipleChoice;