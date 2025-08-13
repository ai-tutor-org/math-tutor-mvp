import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SHAPE_TYPES, CONTAINER_DEFINITIONS } from '../data/shapeDefinitions';
import './SortingBin.css';

/**
 * SortingBin Component - B1.4
 * Drop zone container component using PNG assets with counters and hover effects
 * Supports 1.1x hover scaling with aspect-ratio preservation and glowing effects
 */
const SortingBin = ({
    type,
    count = 0,
    isGlowing = false,
    isHovered = false,
    onShapeDrop,
    onDragOver,
    onDragLeave,
    className = ''
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const binRef = useRef(null);

    // Get container definition for this shape type
    const containerDef = CONTAINER_DEFINITIONS[type];
    
    if (!containerDef) {
        console.warn(`No container definition found for type: ${type}`);
        return null;
    }

    // Handle drag over events
    const handleDragOver = (event) => {
        event.preventDefault();
        if (!isDragOver) {
            setIsDragOver(true);
            onDragOver?.(type, event);
        }
    };

    // Handle drag leave events
    const handleDragLeave = (event) => {
        // Only trigger if leaving the container entirely
        if (!binRef.current?.contains(event.relatedTarget)) {
            setIsDragOver(false);
            onDragLeave?.(type, event);
        }
    };

    // Handle drop events
    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        
        // Extract shape data from drag event (will be set by GameShape)
        const shapeData = event.dataTransfer?.getData('application/json');
        if (shapeData) {
            try {
                const shape = JSON.parse(shapeData);
                const isValidDrop = containerDef.acceptedTypes.includes(shape.type);
                onShapeDrop?.(shape.id, shape.type, type, isValidDrop);
            } catch (error) {
                console.error('Error parsing dropped shape data:', error);
            }
        }
    };

    // Handle mouse events for hover effects
    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    // Get dynamic CSS classes
    const getBinClasses = () => {
        const classes = ['sorting-bin', type];
        
        if (isGlowing) {
            classes.push('glowing');
        }
        
        if (isDragOver) {
            classes.push('drag-over');
        }
        
        if (isHovering || isHovered) {
            classes.push('hovering');
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // Framer Motion hover effects with 1.1x scaling and aspect-ratio preservation
            whileHover={{
                scale: 1.1,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            // Ensure aspect ratio is preserved during scaling
            style={{
                transformOrigin: "center",
                aspectRatio: "1 / 1.2" // Preserve container aspect ratio
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

            {/* Shape Counter */}
            <motion.div 
                className="shape-counter"
                animate={{
                    scale: count > 0 ? 1.1 : 1,
                    color: count > 0 ? containerDef.color : 'rgba(255, 255, 255, 0.6)'
                }}
                transition={{ duration: 0.3 }}
            >
                <span className="counter-number">{count}</span>
                <span className="counter-label">
                    {count === 1 ? 'shape' : 'shapes'}
                </span>
            </motion.div>

            {/* Clean container - drop zone text removed */}

            {/* Glow Effect Overlay */}
            {isGlowing && (
                <motion.div
                    className="glow-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        borderColor: containerDef.color,
                        boxShadow: `0 0 20px ${containerDef.color}66`
                    }}
                />
            )}

            {/* Debug info removed for clean interface */}
        </motion.div>
    );
};

export default SortingBin;