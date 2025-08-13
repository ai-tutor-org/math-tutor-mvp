import React from 'react';
import { motion } from 'framer-motion';
import { SHAPE_TYPES } from '../data/shapeDefinitions';
import './GameShape.css';

/**
 * GameShape Component - B1.3
 * Individual draggable shape component with Framer Motion drag functionality
 * Supports size and thickness variations with simple shadows
 */
const GameShape = ({ 
    shape, 
    onDragStart, 
    onDragEnd,
    onAnimationComplete,
    dragConstraints = false,
    isDisabled = false,
    isHighlighted = false,
    className = ''
}) => {
    // Determine shape-specific CSS classes
    const getShapeClasses = () => {
        const classes = ['game-shape', shape.type];
        
        if (shape.variant && shape.variant !== 'standard') {
            classes.push(shape.variant);
        }
        
        if (shape.thickness && shape.thickness !== 'normal') {
            classes.push(shape.thickness);
        }
        
        if (isDisabled) {
            classes.push('disabled');
        }
        
        if (isHighlighted) {
            classes.push('highlighted');
        }
        
        // Special demo styling: disabled but highlighted (demo square)
        if (isDisabled && isHighlighted) {
            classes.push('demo-active');
        }
        
        if (shape.isBouncing) {
            classes.push('bouncing');
        }
        
        if (className) {
            classes.push(className);
        }
        
        return classes.join(' ');
    };

    // Calculate dynamic styles
    const getDynamicStyles = () => {
        // Special handling for highlighted shapes during animation (demo mode)
        if (isHighlighted && shape.isAnimating) {
            return {
                backgroundColor: `${shape.color}CC`, // More opaque during animation
                borderColor: shape.color,
                opacity: 1,
                transform: `scale(${shape.size / 100})`,
                cursor: 'not-allowed',
                boxShadow: `0 0 15px ${shape.color}88`, // Glow effect during animation
                zIndex: 50 // Ensure animated shapes appear above everything
            };
        }
        
        return {
            backgroundColor: isDisabled ? `${shape.color}33` : `${shape.color}88`, // Transparency for disabled
            borderColor: shape.color,
            opacity: isDisabled ? 0.3 : 1,
            transform: `scale(${shape.size / 100})`, // Size variation
            cursor: isDisabled ? 'not-allowed' : 'grab'
        };
    };

    // Get shape content - clean shapes without text or symbols
    const renderShapeContent = () => {
        // Return empty content for clean, simple shapes
        return (
            <div className="shape-content clean-shape">
                {/* Clean shape - no text or internal symbols */}
            </div>
        );
    };

    // Handle drag start
    const handleDragStart = (event, info) => {
        if (isDisabled) return false;
        onDragStart?.(shape, event, info);
    };

    // Handle drag end
    const handleDragEnd = (event, info) => {
        if (isDisabled) return;
        onDragEnd?.(shape, event, info);
    };

    // Combined drag handler for both Framer Motion and HTML5 
    const handleCombinedDragStart = (event, info) => {
        if (isDisabled) return false;
        
        // Handle Framer Motion drag
        onDragStart?.(shape, event, info);
        
        // Handle HTML5 drag for SortingBin compatibility
        if (event.dataTransfer) {
            event.dataTransfer.setData('application/json', JSON.stringify({
                id: shape.id,
                type: shape.type,
                variant: shape.variant
            }));
            event.dataTransfer.effectAllowed = 'move';
        }
        
        console.log('🎯 Combined drag start:', shape.type, shape.id);
    };

    const handleCombinedDragEnd = (event, info) => {
        if (isDisabled) return;
        
        // Handle Framer Motion drag end
        onDragEnd?.(shape, event, info);
        
        console.log('🎯 Combined drag end:', shape.type, shape.id);
    };


    return (
        <motion.div
            className={getShapeClasses()}
            style={{
                position: 'absolute',
                ...getDynamicStyles()
            }}
            // Initial position and animation
            initial={{
                x: shape.position?.x ?? 0,
                y: shape.position?.y ?? 0
            }}
            // Animation for demo movement and positioning
            animate={shape.isAnimating ? {
                x: shape.animationTarget?.x ?? shape.position?.x ?? 0,
                y: shape.animationTarget?.y ?? shape.position?.y ?? 0
            } : {
                x: shape.position?.x ?? 0,
                y: shape.position?.y ?? 0
            }}
            // Framer Motion drag functionality
            drag={!isDisabled && !shape.isAnimating}
            dragConstraints={dragConstraints}
            dragElastic={0} // Remove springy resistance
            dragMomentum={false}
            dragTransition={{ power: 0, timeConstant: 0 }} // Instant response
            onDragStart={handleCombinedDragStart}
            onDragEnd={handleCombinedDragEnd}
            // HTML5 drag and drop support for SortingBin compatibility
            draggable={!isDisabled}
            // Simplified drag feedback for performance
            whileDrag={!isDisabled ? { 
                zIndex: 20
            } : {}}
            // Removed layout animation to prevent flicker
            transition={shape.isAnimating ? {
                duration: 2.5,
                ease: "easeInOut",
                type: "tween"
            } : {
                duration: 0.1 // Faster transitions for better drag responsiveness
            }}
            // Animation completion callback for demo timing
            onAnimationComplete={() => {
                if (shape.isAnimating && onAnimationComplete) {
                    onAnimationComplete(shape.id);
                }
            }}
        >
            {renderShapeContent()}
            
            {/* Debug info overlay removed for clean interface */}
        </motion.div>
    );
};

export default GameShape;