import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { SHAPE_TYPES, CONTAINER_DEFINITIONS } from '../data/shapeDefinitions';
import './SortingBin.css';

/**
 * SortingBin Component - B1.4
 * Drop zone container component using PNG assets with counters and hover effects
 * Supports 1.1x hover scaling with aspect-ratio preservation and glowing effects
 * Now uses Framer Motion collision detection instead of HTML5 drag/drop
 */
const SortingBin = forwardRef(({
    type,
    count = 0,
    isGlowing = false,
    isDraggedOver = false,  // Now controlled by parent via collision detection
    className = ''
}, ref) => {
    const binRef = useRef(null);

    // Get container definition for this shape type
    const containerDef = CONTAINER_DEFINITIONS[type];
    
    if (!containerDef) {
        console.warn(`No container definition found for type: ${type}`);
        return null;
    }

    // Expose container bounds to parent for collision detection
    useImperativeHandle(ref, () => ({
        getBounds: () => {
            if (!binRef.current) return null;
            const rect = binRef.current.getBoundingClientRect();
            return {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
                centerX: rect.left + rect.width / 2,
                centerY: rect.top + rect.height / 2
            };
        },
        getElement: () => binRef.current,
        type: type
    }));

    // Removed mouse event handlers - using Framer Motion for hover

    // Get dynamic CSS classes
    const getBinClasses = () => {
        const classes = ['sorting-bin', type];
        
        if (isGlowing) {
            classes.push('glowing');
        }
        
        if (isDraggedOver) {
            classes.push('drag-over');
        }
        
        if (count > 0) {
            classes.push('has-shapes');
        }
        
        if (className) {
            classes.push(className);
        }
        
        return classes.join(' ');
    };

    // Get container image path
    const getImagePath = () => {
        // Ensure the path is correct for the PNG assets
        return containerDef.image;
    };

    return (
        <motion.div
            ref={binRef}
            className={getBinClasses()}
            data-container-type={type}
            // Framer Motion hover effects with 1.1x scaling and aspect-ratio preservation
            whileHover={{
                scale: 1.1,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            // Ensure aspect ratio is preserved during scaling
            style={{
                transformOrigin: "center",
                aspectRatio: "1 / 1.2", // Preserve container aspect ratio
                '--shape-color': containerDef.color // Set CSS variable for glow color
            }}
            // Layout animation for smooth transitions
            layout
            transition={{
                layout: { duration: 0.3, ease: "easeOut" }
            }}
        >
            {/* Container Image */}
            <div className="container-image-wrapper">
                <img
                    src={getImagePath()}
                    alt={`${containerDef.label} Container`}
                    className="container-image"
                    draggable={false}
                    onError={(e) => {
                        console.warn(`Failed to load container image: ${getImagePath()}`);
                        e.target.style.display = 'none';
                    }}
                />
                
                {/* Clean container - fallback elements removed */}
            </div>

            {/* Shape Counter - Only show if count > 0 */}
            {count > 0 && (
                <motion.div 
                    className="shape-counter"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                >
                    <span className="counter-number">{count}</span>
                </motion.div>
            )}

            {/* Clean container - glow handled by CSS on image */}
            {/* Debug info removed for clean interface */}
        </motion.div>
    );
});

SortingBin.displayName = 'SortingBin';

export default SortingBin;