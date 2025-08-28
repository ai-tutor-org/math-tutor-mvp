import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export class LessonErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[LessonErrorBoundary] Caught error:', error);
            console.error('[LessonErrorBoundary] Error info:', errorInfo);
        }

        // In production, you might want to send to error tracking service
        // ErrorTrackingService.captureException(error, { extra: errorInfo });
    }

    handleRetry = () => {
        this.setState({ 
            hasError: false, 
            error: null,
            errorInfo: null 
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box 
                    sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        bgcolor: '#1B1B1B',
                        color: 'white',
                        borderRadius: '16px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Oops! Something went wrong
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                        The lesson encountered an unexpected error. Don't worry, your progress is saved!
                    </Typography>
                    
                    {process.env.NODE_ENV === 'development' && (
                        <Box sx={{ 
                            mb: 3, 
                            p: 2, 
                            bgcolor: '#333', 
                            borderRadius: '8px', 
                            fontSize: '12px', 
                            fontFamily: 'monospace',
                            maxWidth: '500px',
                            textAlign: 'left'
                        }}>
                            <div><strong>Error:</strong> {this.state.error?.message}</div>
                            {this.state.errorInfo?.componentStack && (
                                <div><strong>Component Stack:</strong> {this.state.errorInfo.componentStack.slice(0, 200)}...</div>
                            )}
                        </Box>
                    )}
                    
                    <Button 
                        variant="contained" 
                        onClick={this.handleRetry}
                        sx={{ 
                            mb: 1,
                            bgcolor: '#4CAF50',
                            '&:hover': { bgcolor: '#45a049' }
                        }}
                    >
                        Try Again
                    </Button>
                    
                    <Button 
                        variant="text" 
                        onClick={this.props.onReturnHome}
                        sx={{ color: 'white', opacity: 0.7 }}
                    >
                        Return to Home
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}