import React from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';

const MeasurementInput = ({ 
    value,
    onInputChange,
    onCheck,
    disabled = false,
    placeholder = "Enter value",
    unit = "units"
}) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && value.trim() && !disabled && onCheck) {
            onCheck();
        }
    };

    return (
        <Box sx={{ mb: 3, width: '100%', maxWidth: '295px' }}>
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                {/* Input field container */}
                <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '4px 14px',
                    height: '48px',
                    flex: 1,
                    '&:focus-within': {
                        boxShadow: '0 0 0 4px #82B0FF'
                    }
                }}>
                    <TextField
                        value={value}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="number"
                        variant="standard"
                        placeholder={placeholder}
                        disabled={disabled}
                        sx={{
                            flex: 1,
                            '& .MuiInput-root': {
                                color: '#000',
                                fontSize: '16px',
                                fontFamily: "'Fustat', 'Inter', sans-serif",
                                fontWeight: 400,
                                '&:before': { display: 'none' },
                                '&:after': { display: 'none' },
                                '&:hover:not(.Mui-disabled):before': { display: 'none' }
                            },
                            '& .MuiInput-input': {
                                padding: '0',
                                '&::placeholder': {
                                    color: '#B3BDD2',
                                    opacity: 1
                                },
                                '&::-webkit-outer-spin-button': {
                                    '-webkit-appearance': 'none',
                                    margin: 0
                                },
                                '&::-webkit-inner-spin-button': {
                                    '-webkit-appearance': 'none',
                                    margin: 0
                                },
                                '&[type=number]': {
                                    '-moz-appearance': 'textfield'
                                }
                            }
                        }}
                    />
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#000', 
                            fontFamily: "'Fustat', 'Inter', sans-serif", 
                            fontWeight: 400,
                            fontSize: '16px',
                            marginLeft: '8px'
                        }}
                    >
                        {unit}
                    </Typography>
                </Box>
                {/* Check button */}
                <Button
                    variant="contained"
                    onClick={onCheck}
                    onKeyDown={handleKeyDown}
                    disabled={!value.trim() || disabled}
                    sx={{
                        minWidth: '54px',
                        width: '54px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#2281E4',
                        padding: 0,
                        transition: 'all 0.1s ease',
                        '&:hover': {
                            background: '#135BB1',
                            boxShadow: '0 4px 0 0 #0E4485',
                        },
                        '&:active': {
                            transform: 'translateY(4px)',
                            boxShadow: '0 0px 0 0 #0E4485',
                        },
                        '&:focus': {
                            outline: 'none',
                            boxShadow: '0 4px 0 0 #0E4485'
                        },
                        '&:disabled': {
                            background: '#73757B',
                            boxShadow: '0 4px 0 0 #484D5C',
                            opacity: 0.6
                        },
                        boxShadow: '0 4px 0 0 #0E4485',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
                    <path d="M8.75003 7L3.14503 12.67C2.71503 13.11 2.01003 13.11 1.57503 12.67C1.14003 12.23 1.14003 11.52 1.57503 11.08L5.60503 7L1.57503 2.92C1.14003 2.48 1.14003 1.77 1.57503 1.33C2.01003 0.89 2.71503 0.89 3.14503 1.33L8.75003 7Z" fill="white" stroke="white"/>
                    </svg>
                </Button>
            </Box>
        </Box>
    );
};

export default MeasurementInput;