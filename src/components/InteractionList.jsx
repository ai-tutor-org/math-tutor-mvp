import React from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Chip
} from '@mui/material';
import { lessons, presentations } from '../contentData';

/**
 * Component that displays all interactions in the current lesson for developer navigation
 */
const InteractionList = ({ 
    lessonId, 
    currentPresIndex, 
    currentInteractionIndex, 
    currentConditionalPresentation,
    onInteractionSelect,
    onClose 
}) => {
    // Get all interactions for the current lesson
    const getAllInteractions = () => {
        const lesson = lessons[lessonId];
        if (!lesson) return [];

        const allInteractions = [];

        // Add interactions from main sequence
        lesson.sequence.forEach((sequenceItem, presIndex) => {
            const presentation = presentations[sequenceItem.presentationId];
            if (presentation && presentation.interactions) {
                presentation.interactions.forEach((interaction, interactionIndex) => {
                    allInteractions.push({
                        id: interaction.id,
                        tutorText: interaction.tutorText,
                        type: interaction.type,
                        presentationId: sequenceItem.presentationId,
                        presIndex,
                        interactionIndex,
                        isConditional: false,
                        isCurrent: presIndex === currentPresIndex && 
                                  interactionIndex === currentInteractionIndex && 
                                  !currentConditionalPresentation
                    });
                });
            }
        });

        // Add conditional presentations
        if (lesson.conditionalPresentations) {
            lesson.conditionalPresentations.forEach(presId => {
                const presentation = presentations[presId];
                if (presentation && presentation.interactions) {
                    presentation.interactions.forEach((interaction, interactionIndex) => {
                        allInteractions.push({
                            id: interaction.id,
                            tutorText: interaction.tutorText,
                            type: interaction.type,
                            presentationId: presId,
                            presIndex: -1, // Conditional presentations don't have a presIndex
                            interactionIndex,
                            isConditional: true,
                            isCurrent: currentConditionalPresentation === presId && 
                                      interactionIndex === currentInteractionIndex
                        });
                    });
                }
            });
        }

        // Add feedback interactions for reference (but mark them as non-navigable)
        const feedbackPresentation = presentations['feedback-interactions'];
        if (feedbackPresentation && feedbackPresentation.interactions) {
            feedbackPresentation.interactions.forEach((interaction, interactionIndex) => {
                allInteractions.push({
                    id: interaction.id,
                    tutorText: interaction.tutorText,
                    type: interaction.type,
                    presentationId: 'feedback-interactions',
                    presIndex: -1,
                    interactionIndex,
                    isConditional: true,
                    isFeedback: true,
                    isCurrent: false
                });
            });
        }

        return allInteractions;
    };

    const interactions = getAllInteractions();

    const handleInteractionClick = (interaction) => {
        if (interaction.isFeedback) {
            // Don't navigate to feedback interactions
            return;
        }
        onInteractionSelect(interaction);
        onClose();
    };

    const getInteractionLabel = (interaction) => {
        // Create a descriptive label for the interaction
        let label = `${interaction.id}`;
        
        if (interaction.type === 'welcome') {
            label = 'Welcome';
        } else if (interaction.type === 'tutor-monologue') {
            label = 'Tutor Explanation';
        } else if (interaction.type.includes('question')) {
            label = 'Question';
        } else if (interaction.type.includes('measurement')) {
            label = 'Measurement Activity';
        } else if (interaction.type.includes('animation')) {
            label = 'Animation';
        }

        // Add type suffix for clarity
        return label;
    };

    const getTruncatedText = (text, maxLength = 60) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <Box sx={{ width: 350, maxHeight: '70vh', overflow: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
                <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                    Developer Navigation
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                    Jump to any interaction in the lesson
                </Typography>
            </Box>
            
            <List sx={{ p: 0 }}>
                {interactions.map((interaction, index) => (
                    <ListItem 
                        key={`${interaction.presentationId}-${interaction.id}`} 
                        disablePadding
                    >
                        <ListItemButton
                            onClick={() => handleInteractionClick(interaction)}
                            disabled={interaction.isFeedback}
                            sx={{
                                py: 2,
                                px: 2,
                                borderBottom: '1px solid #222',
                                bgcolor: interaction.isCurrent ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                                '&:hover': {
                                    bgcolor: interaction.isFeedback 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : 'rgba(255, 255, 255, 0.08)'
                                },
                                '&.Mui-disabled': {
                                    opacity: 0.5
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: interaction.isCurrent ? '#4CAF50' : '#fff',
                                                fontWeight: interaction.isCurrent ? 600 : 400
                                            }}
                                        >
                                            {getInteractionLabel(interaction)}
                                        </Typography>
                                        {interaction.isCurrent && (
                                            <Chip 
                                                label="Current" 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: '#4CAF50', 
                                                    color: '#fff',
                                                    fontSize: '0.7rem',
                                                    height: '20px'
                                                }} 
                                            />
                                        )}
                                        {interaction.isConditional && (
                                            <Chip 
                                                label={interaction.isFeedback ? "Feedback" : "Branch"} 
                                                size="small" 
                                                sx={{ 
                                                    bgcolor: interaction.isFeedback ? '#FF9800' : '#2196F3', 
                                                    color: '#fff',
                                                    fontSize: '0.7rem',
                                                    height: '20px'
                                                }} 
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            color: '#999',
                                            display: 'block',
                                            mt: 0.5,
                                            lineHeight: 1.3
                                        }}
                                    >
                                        {getTruncatedText(interaction.tutorText)}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default InteractionList;