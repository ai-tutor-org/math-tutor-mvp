import React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { SHAPE_TYPES } from '../../../data/shapeDefinitions';
import './GameShape.css';

/**
 * GameShape Component - B1.3
 * Individual draggable shape component with Framer Motion drag functionality
 * Supports size and thickness variations with simple shadows
 */
const GameShape = ({ 
    shape, 
    onDragStart, 
    onDrag,
    onDragEnd,
    onAnimationComplete,
    dragConstraints = false,
    isDisabled = false,
    isHighlighted = false,
    className = ''
}) => {
    
    // Motion values for position tracking
    // IMPORTANT: Motion values are the single source of truth for position during interactions
    // Redux state is only updated at key moments (drag end, animation complete)
    const x = useMotionValue(shape.position?.x ?? 0);
    const y = useMotionValue(shape.position?.y ?? 0);
    
    // Track if this is the first render
    const isFirstRender = React.useRef(true);
    
    // Only sync motion values with Redux position on initial mount
    React.useEffect(() => {
        if (isFirstRender.current && shape.position) {
            x.set(shape.position.x ?? 0);
            y.set(shape.position.y ?? 0);
            isFirstRender.current = false;
        }
    }, []); // Empty deps - only run once
    
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
        
        if (className) {
            classes.push(className);
        }
        
        return classes.join(' ');
    };

    // Calculate dynamic styles
    const getDynamicStyles = () => {
        // Special handling for highlighted shapes during unified animation (demo mode)
        if (isHighlighted && shape.animation && shape.animation.type !== 'none') {
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

    // Handle drag end with improved position tracking
    const handleDragEnd = (event, info) => {
        
        if (isDisabled) {
            return;
        }
        
        // Get current motion values for accurate position
        const currentX = x.get();
        const currentY = y.get();
        
        // Create enhanced info object with accurate positions
        const enhancedInfo = {
            ...info,
            point: { x: currentX, y: currentY },
            offset: { x: currentX - (shape.position?.x ?? 0), y: currentY - (shape.position?.y ?? 0) }
        };
        
        onDragEnd?.(shape, event, enhancedInfo);
    };

    // Framer Motion drag handler
    const handleFramerDragStart = (event, info) => {
        if (isDisabled) return false;
        
        // Handle Framer Motion drag
        onDragStart?.(shape, event, info);
    };

    const handleFramerDragEnd = (event, info) => {
        if (isDisabled) return;
        
        // Handle Framer Motion drag end with enhanced position tracking
        handleDragEnd(event, info);
    };
    
    // Handle drag during movement
    const handleFramerDrag = (event, info) => {
        if (isDisabled) return;
        
        onDrag?.(shape, event, info);
    };


    return (
        <motion.div
            className={getShapeClasses()}
            style={{
                position: 'absolute',
                x: x, // Use motion value for x
                y: y, // Use motion value for y
                ...getDynamicStyles()
            }}
            // Unified animation system
            // Only animate when there's an active animation with a target
            animate={(shape.animation && shape.animation.type !== 'none' && shape.animation.target) ? {
                x: shape.animation.target.x,
                y: shape.animation.target.y
            } : undefined}
            // Framer Motion drag functionality
            drag={!isDisabled && !(shape.animation && shape.animation.type !== 'none')}
            dragConstraints={dragConstraints}
            dragElastic={0} // Remove springy resistance
            dragMomentum={false}
            dragTransition={{ power: 0, timeConstant: 0 }} // Instant response
            onDragStart={handleFramerDragStart}
            onDrag={handleFramerDrag}
            onDragEnd={handleFramerDragEnd}
            // Simplified drag feedback for performance
            whileDrag={!isDisabled ? { 
                zIndex: 20
            } : {}}
            // Removed layout animation to prevent flicker
            transition={
                // Use unified animation settings if active
                (shape.animation && shape.animation.type !== 'none') ? {
                    duration: shape.animation.duration,
                    ease: shape.animation.easing,
                    type: "tween"
                } : {
                    duration: 0 // No transition when not animating - prevents double bounce
                }
            }
            // Unified animation completion callback
            onAnimationComplete={() => {
                if (shape.animation && shape.animation.type !== 'none') {
                    // First call the external completion handler if provided
                    if (onAnimationComplete) {
                        onAnimationComplete(shape.id, 'unified-' + shape.animation.type);
                    }
                    
                    // Then call the animation's own onComplete callback if it exists
                    if (shape.animation.onComplete) {
                        shape.animation.onComplete();
                    }
                }
            }}
        >
            {renderShapeContent()}
            
            {/* Debug info overlay removed for clean interface */}
        </motion.div>
    );
};

export default GameShape;