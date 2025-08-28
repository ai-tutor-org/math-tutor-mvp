import React, { useState, useEffect, useMemo, memo } from 'react';
import { Typography } from '@mui/material';
import './HighlightedText.css';

const HighlightedText = ({
    text,
    currentTime = 0,
    timingData = null,
    sx = {},
    variant = 'body2',
    ...typographyProps
}) => {
    
    
    // Initialize state based on current time immediately
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
    const [spokenSentences, setSpokenSentences] = useState(new Set());
    const [audioEnded, setAudioEnded] = useState(false);

    // Parse text into sentences for rendering
    const sentences = useMemo(() => {
        if (!text) return [];
        
        // Split text by sentence boundaries, preserving the punctuation
        const sentenceParts = text.split(/([.!?]+\s*)/);
        const sentences = [];
        
        for (let i = 0; i < sentenceParts.length; i += 2) {
            const sentence = sentenceParts[i];
            const punctuation = sentenceParts[i + 1] || '';
            if (sentence.trim()) {
                sentences.push(sentence + punctuation);
            }
        }
        
        return sentences;
    }, [text]);



    // Find which sentence should be highlighted based on current time
    useEffect(() => {
        if (!timingData || !timingData.sentences) {
            setCurrentSentenceIndex(-1);
            setSpokenSentences(new Set());
            setAudioEnded(false);
            return;
        }

        // Check if audio has ended (currentTime is beyond all sentence timings)
       const maxEndTime = Math.max(...timingData.sentences.map(s => s.end));
       if (currentTime > maxEndTime && currentTime > 0) {
            setAudioEnded(true);
       }

        // Find the sentence that should be highlighted at current time
        const newSentenceIndex = timingData.sentences.findIndex(sentenceData => {
            return currentTime >= sentenceData.start && currentTime <= sentenceData.end;
        });

        if (newSentenceIndex !== currentSentenceIndex) {
            // Add previous sentence to spoken set
            if (currentSentenceIndex >= 0) {
                setSpokenSentences(prev => new Set([...prev, currentSentenceIndex]));
            }
            
            setCurrentSentenceIndex(newSentenceIndex);
        }
    }, [currentTime, timingData, currentSentenceIndex]);

    // Reset state immediately when text or timing data changes
    useEffect(() => {
        setCurrentSentenceIndex(-1);
        setSpokenSentences(new Set());
        setAudioEnded(false);
    }, [text, timingData]);


    // Render the text with sentence highlighting
    const renderText = () => {
        // If no timing data, render as plain text
        if (!timingData?.sentences) {
            return <span className="highlighted-word">{text}</span>;
        }
        
        return sentences.map((sentence, index) => {
            const isCurrentSentence = index === currentSentenceIndex;
            const hasBeenSpoken = spokenSentences.has(index);
            
            // Determine the appropriate CSS class
            let className = 'highlighted-word';
            
            // Always add has-timing class when we have timing data
            if (timingData?.sentences) {
                className += ' has-timing';
            }
            
            if (isCurrentSentence) {
                className += ' highlight-active';
            } else if (hasBeenSpoken) {
                className += ' highlight-previous';
            }

            return (
                <span
                    key={`${audioEnded}-${index}`}
                    className={className}
                >
                    {sentence}
                </span>
            );
        });
    };

    return (
        <Typography
            variant={variant}
            sx={sx}
            className=""
            {...typographyProps}
        >
            {renderText()}
        </Typography>
    );
};

export default memo(HighlightedText);