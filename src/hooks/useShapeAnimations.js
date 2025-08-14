import { useCallback } from 'react';

/**
 * Unified Shape Animation System
 * 
 * This hook provides a single interface for all shape animations:
 * - Demo animations (modeling phase)
 * - Bounce back animations (wrong container detection)
 * - Custom animations (future extensibility)
 * 
 * Benefits:
 * - Single source of truth for animations
 * - Consistent animation behavior
 * - Easy to debug and maintain
 * - Extensible for new animation types
 */

// Animation types
export const ANIMATION_TYPES = {
    NONE: 'none',
    DEMO: 'demo',
    BOUNCE: 'bounce', 
    CUSTOM: 'custom'
};

// Animation easings
export const ANIMATION_EASINGS = {
    EASE_OUT: 'easeOut',
    EASE_IN_OUT: 'easeInOut',
    LINEAR: 'linear',
    SPRING: 'spring'
};

// Default animation configurations
const ANIMATION_CONFIGS = {
    [ANIMATION_TYPES.DEMO]: {
        duration: 2.5,
        easing: ANIMATION_EASINGS.EASE_IN_OUT
    },
    [ANIMATION_TYPES.BOUNCE]: {
        duration: 0.5,
        easing: ANIMATION_EASINGS.EASE_OUT
    },
    [ANIMATION_TYPES.CUSTOM]: {
        duration: 1.0,
        easing: ANIMATION_EASINGS.EASE_OUT
    }
};

/**
 * Hook for managing shape animations
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Object} Animation control functions
 */
export const useShapeAnimations = (dispatch) => {
    
    /**
     * Start an animation for a shape
     * @param {string} shapeId - ID of the shape to animate
     * @param {Object} config - Animation configuration
     * @param {string} config.type - Animation type (demo, bounce, custom)
     * @param {Object} config.target - Target position {x, y}
     * @param {number} [config.duration] - Animation duration (optional, uses defaults)
     * @param {string} [config.easing] - Animation easing (optional, uses defaults)
     * @param {Function} [config.onComplete] - Callback when animation completes
     */
    const startAnimation = useCallback((shapeId, config) => {
        const {
            type,
            target,
            duration = ANIMATION_CONFIGS[type]?.duration || 1.0,
            easing = ANIMATION_CONFIGS[type]?.easing || ANIMATION_EASINGS.EASE_OUT,
            onComplete
        } = config;

        // Validate required parameters
        if (!shapeId || !type || !target) {
            console.error('useShapeAnimations: Missing required parameters', { shapeId, type, target });
            return;
        }

        // Validate animation type
        if (!Object.values(ANIMATION_TYPES).includes(type)) {
            console.error('useShapeAnimations: Invalid animation type', type);
            return;
        }

        // Validate target position
        if (typeof target.x !== 'number' || typeof target.y !== 'number') {
            console.error('useShapeAnimations: Invalid target position', target);
            return;
        }

        // Dispatch unified animation action
        dispatch({
            type: 'ANIMATE_SHAPE',
            shapeId,
            animation: {
                type,
                target,
                duration,
                easing,
                onComplete,
                startTime: Date.now() // For debugging/tracking
            }
        });

    }, [dispatch]);

    /**
     * Stop animation for a shape
     * @param {string} shapeId - ID of the shape
     */
    const stopAnimation = useCallback((shapeId) => {
        dispatch({
            type: 'STOP_SHAPE_ANIMATION',
            shapeId
        });
    }, [dispatch]);

    /**
     * Check if a shape is currently animating
     * @param {Object} shape - Shape object
     * @returns {boolean} True if shape is animating
     */
    const isAnimating = useCallback((shape) => {
        return shape.animation && shape.animation.type !== ANIMATION_TYPES.NONE;
    }, []);

    /**
     * Get animation progress (0-1)
     * @param {Object} shape - Shape object
     * @returns {number} Animation progress between 0 and 1
     */
    const getAnimationProgress = useCallback((shape) => {
        if (!isAnimating(shape)) return 0;
        
        const { animation } = shape;
        const elapsed = Date.now() - animation.startTime;
        const progress = Math.min(elapsed / (animation.duration * 1000), 1);
        
        return progress;
    }, [isAnimating]);

    /**
     * Create demo animation for modeling phase
     * @param {string} shapeId - Shape ID
     * @param {Object} targetPosition - Target position
     * @param {Function} onComplete - Completion callback
     */
    const startDemoAnimation = useCallback((shapeId, targetPosition, onComplete) => {
        startAnimation(shapeId, {
            type: ANIMATION_TYPES.DEMO,
            target: targetPosition,
            onComplete
        });
    }, [startAnimation]);

    /**
     * Create bounce back animation for wrong container detection
     * @param {string} shapeId - Shape ID
     * @param {Object} targetPosition - Safe target position
     * @param {Function} onComplete - Completion callback
     */
    const startBounceAnimation = useCallback((shapeId, targetPosition, onComplete) => {
        startAnimation(shapeId, {
            type: ANIMATION_TYPES.BOUNCE,
            target: targetPosition,
            onComplete
        });
    }, [startAnimation]);

    return {
        // Core functions
        startAnimation,
        stopAnimation,
        isAnimating,
        getAnimationProgress,
        
        // Convenience functions
        startDemoAnimation,
        startBounceAnimation,
        
        // Constants for external use
        ANIMATION_TYPES,
        ANIMATION_EASINGS
    };
};

export default useShapeAnimations;