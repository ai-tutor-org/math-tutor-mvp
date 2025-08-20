import React, { useEffect, useRef } from 'react';
import { Button } from '@mui/material';

const PrimaryButton = ({ 
    children,
    onClick,
    disabled = false,
    autoFocus = true,
    sx = {},
    ...props 
}) => {
    const buttonRef = useRef(null);
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !disabled && onClick) {
            onClick(event);
        }
    };

    useEffect(() => {
        if (autoFocus && buttonRef.current && !disabled) {
            buttonRef.current.focus();
        }
    }, [autoFocus, disabled]);

    return (
        <Button
            ref={buttonRef}
            variant="contained"
            onClick={onClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            sx={{
                padding: '8px',
                borderRadius: '12px',
                background: '#2281E4',
                color: '#fff',
                textTransform: 'none',
                fontSize: '1rem',
                minWidth: '140px',
                textAlign: 'center',
                fontFamily: "'Fustat', 'Inter', sans-serif",
                fontWeight: 700,
                boxShadow: '0 4px 0 0 #0E4485',
                transition: 'all 0.1s ease',
                '&:hover': {
                    background: '#1A6BC4',
                    boxShadow: '0 4px 0 0 #0E4485'
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
                    color: '#999',
                    opacity: 0.7,
                    boxShadow: '0 4px 0 0 #484D5C'
                },
                // Allow custom sx to override defaults
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export default PrimaryButton;