// Shape Definitions for Shape Sorting Game - B1.2
// 12 total shapes: 3 triangles, 3 circles, 3 rectangles, 3 squares

// Shape type constants
export const SHAPE_TYPES = {
    TRIANGLE: 'triangle',
    CIRCLE: 'circle',
    RECTANGLE: 'rectangle',
    SQUARE: 'square'
};

// Size variations (subtle differences as specified)
export const SIZE_VARIATIONS = {
    SMALL: 80,   // 80% of base size
    MEDIUM: 100, // 100% base size (default)
    LARGE: 120   // 120% of base size
};

// Thickness variations
export const THICKNESS_VARIATIONS = {
    THIN: 'thin',
    NORMAL: 'normal',
    THICK: 'thick'
};

// Triangle variants - 3 broadly different types (not educational detail)
export const TRIANGLE_VARIANTS = {
    EQUILATERAL: 'equilateral',  // Standard equilateral triangle
    RIGHT: 'right',              // Right-angled triangle  
    ISOSCELES: 'isosceles'       // Isosceles triangle (longer base)
};

// Base colors for each shape type - consistent greyish theme for all shapes
export const SHAPE_COLORS = {
    [SHAPE_TYPES.TRIANGLE]: '#8A9BA8',   // Vibrant bluish-grey
    [SHAPE_TYPES.CIRCLE]: '#8A9BA8',     // Vibrant bluish-grey
    [SHAPE_TYPES.RECTANGLE]: '#8A9BA8',  // Vibrant bluish-grey
    [SHAPE_TYPES.SQUARE]: '#8A9BA8'      // Vibrant bluish-grey
};

// Shape generation utilities
let shapeIdCounter = 1;
const generateShapeId = () => `shape-${shapeIdCounter++}`;

/**
 * Generate all 12 shapes with variations
 * Returns array of shape objects with properties needed for game
 */
export const generateShapes = () => {
    const shapes = [];
    const sizeValues = Object.values(SIZE_VARIATIONS);
    const thicknessValues = Object.values(THICKNESS_VARIATIONS);

    // 3 Triangles with different variants (broadly different, not educational)
    const triangleVariants = Object.values(TRIANGLE_VARIANTS);
    triangleVariants.forEach((variant, index) => {
        shapes.push({
            id: generateShapeId(),
            type: SHAPE_TYPES.TRIANGLE,
            variant: variant,
            size: sizeValues[index % sizeValues.length],
            thickness: THICKNESS_VARIATIONS.NORMAL, // Standardized to normal
            color: SHAPE_COLORS[SHAPE_TYPES.TRIANGLE],
            position: { x: 0, y: 0 }, // Will be positioned by positioning utilities
            attempts: 0,
            isHighlighted: false,
            isDisabled: true, // Start disabled, will be enabled per phase
            
            // Unified Animation System
            animation: {
                type: 'none',
                target: null,
                duration: 0,
                easing: 'easeOut',
                onComplete: null,
                startTime: null
            }
        });
    });

    // 3 Circles with size and thickness variations
    for (let i = 0; i < 3; i++) {
        shapes.push({
            id: generateShapeId(),
            type: SHAPE_TYPES.CIRCLE,
            variant: 'standard', // Circles have one variant
            size: sizeValues[i],
            thickness: THICKNESS_VARIATIONS.NORMAL, // Standardized to normal
            color: SHAPE_COLORS[SHAPE_TYPES.CIRCLE],
            position: { x: 0, y: 0 },
            attempts: 0,
            isHighlighted: false,
            isDisabled: true,
            
            // Unified Animation System
            animation: {
                type: 'none',
                target: null,
                duration: 0,
                easing: 'easeOut',
                onComplete: null,
                startTime: null
            }
        });
    }

    // 3 Rectangles with size and thickness variations  
    for (let i = 0; i < 3; i++) {
        shapes.push({
            id: generateShapeId(),
            type: SHAPE_TYPES.RECTANGLE,
            variant: 'standard', // Rectangles have one variant
            size: sizeValues[i],
            thickness: THICKNESS_VARIATIONS.NORMAL, // Standardized to normal
            color: SHAPE_COLORS[SHAPE_TYPES.RECTANGLE],
            position: { x: 0, y: 0 },
            attempts: 0,
            isHighlighted: false,
            isDisabled: true,
            
            // Unified Animation System
            animation: {
                type: 'none',
                target: null,
                duration: 0,
                easing: 'easeOut',
                onComplete: null,
                startTime: null
            }
        });
    }

    // 3 Squares with size and thickness variations
    for (let i = 0; i < 3; i++) {
        shapes.push({
            id: generateShapeId(),
            type: SHAPE_TYPES.SQUARE,
            variant: 'standard', // Squares have one variant
            size: sizeValues[i],
            thickness: THICKNESS_VARIATIONS.NORMAL, // Standardized to normal
            color: SHAPE_COLORS[SHAPE_TYPES.SQUARE],
            position: { x: 0, y: 0 },
            attempts: 0,
            isHighlighted: false,
            isDisabled: true,
            
            // Unified Animation System
            animation: {
                type: 'none',
                target: null,
                duration: 0,
                easing: 'easeOut',
                onComplete: null,
                startTime: null
            }
        });
    }


    return shapes;
};

/**
 * Container definitions for sorting bins
 * Maps to the PNG assets in /public/images/
 */
export const CONTAINER_DEFINITIONS = {
    [SHAPE_TYPES.TRIANGLE]: {
        image: '/images/triangles_container.png',
        label: 'Triangles',
        acceptedTypes: [SHAPE_TYPES.TRIANGLE],
        color: SHAPE_COLORS[SHAPE_TYPES.TRIANGLE]
    },
    [SHAPE_TYPES.CIRCLE]: {
        image: '/images/circles_container.png',
        label: 'Circles', 
        acceptedTypes: [SHAPE_TYPES.CIRCLE],
        color: SHAPE_COLORS[SHAPE_TYPES.CIRCLE]
    },
    [SHAPE_TYPES.RECTANGLE]: {
        image: '/images/rectangles_container.png',
        label: 'Rectangles',
        acceptedTypes: [SHAPE_TYPES.RECTANGLE],
        color: SHAPE_COLORS[SHAPE_TYPES.RECTANGLE]
    },
    [SHAPE_TYPES.SQUARE]: {
        image: '/images/squares_container.png',
        label: 'Squares',
        acceptedTypes: [SHAPE_TYPES.SQUARE],
        color: SHAPE_COLORS[SHAPE_TYPES.SQUARE]
    }
};

// Helper functions for game logic

/**
 * Get all shapes of a specific type
 */
export const getShapesByType = (shapes, type) => {
    return shapes.filter(shape => shape.type === type);
};

/**
 * Check if a shape can be dropped in a specific container
 */
export const isValidDrop = (shape, containerType) => {
    return CONTAINER_DEFINITIONS[containerType]?.acceptedTypes.includes(shape.type);
};

/**
 * Get count of shapes by type
 */
export const getShapeTypeCounts = (shapes) => {
    return Object.values(SHAPE_TYPES).reduce((counts, type) => {
        counts[type] = getShapesByType(shapes, type).length;
        return counts;
    }, {});
};

/**
 * Get specific shape for phases (modeling, guided practice)
 */
export const getShapeForPhase = (shapes, type) => {
    const shapesByType = getShapesByType(shapes, type);
    return shapesByType.length > 0 ? shapesByType[0] : null;
};

/**
 * Get shapes for practice phase (Q6-Q7): triangle, circle, square
 */
export const getPracticePhaseShapes = (shapes) => {
    const practiceTypes = [SHAPE_TYPES.TRIANGLE, SHAPE_TYPES.CIRCLE, SHAPE_TYPES.SQUARE];
    return practiceTypes
        .map(type => getShapeForPhase(shapes, type))
        .filter(Boolean);
};

/**
 * Get shapes for guided phase (Q4): 1 triangle
 */
export const getGuidedPhaseShapes = (shapes) => {
    const triangle = getShapeForPhase(shapes, SHAPE_TYPES.TRIANGLE);
    return triangle ? [triangle] : [];
};

/**
 * Get shapes for challenge phases (Q10-Q11): 8 diverse shapes (2 of each type)
 */
export const getChallengePhaseShapes = (shapes) => {
    const challengeShapes = [];
    
    // Get 2 of each shape type for a diverse mix
    Object.values(SHAPE_TYPES).forEach(type => {
        const shapesOfType = getShapesByType(shapes, type);
        // Take first 2 shapes of each type
        challengeShapes.push(...shapesOfType.slice(0, 2));
    });
    
    // Should return exactly 8 shapes (2 triangles, 2 circles, 2 rectangles, 2 squares)
    return challengeShapes.slice(0, 8);
};

/**
 * Get remaining shapes for final challenge (Q10-Q11)
 */
export const getFinalChallengeShapes = (shapes, excludeUsedShapes = []) => {
    return shapes.filter(shape => !excludeUsedShapes.includes(shape.id));
};

/**
 * Reset shape counters (useful for testing)
 */
export const resetShapeIdCounter = () => {
    shapeIdCounter = 1;
};

// Export shape generation for testing
export const TOTAL_SHAPES = 12;
export const SHAPES_PER_TYPE = 3;