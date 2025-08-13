import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ShapeDesigner.css';

const ShapeDesigner = ({
  mode = 'welcome',
  initialWidth = 4,
  initialHeight = 3,
  showGrid = true,
  showSideLabels = true,
  enableDragging = false,
  highlightDragIcon = false,
  trackInteraction = false,
  targetPerimeter = null,
  showTarget = false,
  showCurrentPerimeter = false,
  showSuccess = false,
  showCheckmark = false,
  showSolution = false,
  animateSolution = false,
  solutionWidth = 6,
  solutionHeight = 4,
  enableValidation = false,
  correctAnswer = null,
  feedbackIds = {},
  encouragementMode = false,
  onInteraction,
  onPerimeterCalculated,
  onValidationRequest
}) => {
  const [rectangleWidth, setRectangleWidth] = useState(initialWidth);
  const [rectangleHeight, setRectangleHeight] = useState(initialHeight);
  const [visualWidth, setVisualWidth] = useState(initialWidth);
  const [visualHeight, setVisualHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);

  const GRID_SIZE = 10;
  const CELL_SIZE = 49;
  const GRID_TOTAL_SIZE = GRID_SIZE * CELL_SIZE;

  // Calculate current perimeter
  const currentPerimeter = 2 * (rectangleWidth + rectangleHeight);

  // Notify parent of perimeter changes
  useEffect(() => {
    if (onPerimeterCalculated) {
      onPerimeterCalculated(currentPerimeter);
    }
  }, [currentPerimeter, onPerimeterCalculated]);

  // Initialize visual dimensions when props change
  useEffect(() => {
    setVisualWidth(rectangleWidth);
    setVisualHeight(rectangleHeight);
  }, [rectangleWidth, rectangleHeight]);

  // Handle solution animation
  useEffect(() => {
    if (animateSolution && showSolution) {
      const timer = setTimeout(() => {
        setRectangleWidth(solutionWidth);
        setRectangleHeight(solutionHeight);
        setVisualWidth(solutionWidth);
        setVisualHeight(solutionHeight);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animateSolution, showSolution, solutionWidth, solutionHeight]);

  const handleMouseDown = useCallback((e) => {
    if (!enableDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // Get the grid container
    const gridContainer = document.querySelector('.shape-designer__grid-container');
    if (gridContainer) {
      const rect = gridContainer.getBoundingClientRect();
      setDragStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    // Track first interaction
    if (trackInteraction && !hasInteracted) {
      setHasInteracted(true);
      if (onInteraction) {
        onInteraction();
      }
    }
  }, [enableDragging, trackInteraction, hasInteracted, onInteraction]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !enableDragging) return;

    // Get the grid container's bounding rect instead of event target
    const gridContainer = document.querySelector('.shape-designer__grid-container');
    if (!gridContainer) return;
    
    const rect = gridContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Account for the offset - rectangle starts at (1,1), so mouse position relative to rectangle start
    const relativeMouseX = mouseX - CELL_SIZE; // Subtract one cell size for offset
    const relativeMouseY = mouseY - CELL_SIZE;

    // Calculate smooth visual dimensions (in fractional grid units)
    // Minimum size should be 1 unit, maximum should fit within the grid
    const visualWidthUnits = Math.max(1, Math.min(GRID_SIZE - 1, relativeMouseX / CELL_SIZE));
    const visualHeightUnits = Math.max(1, Math.min(GRID_SIZE - 1, relativeMouseY / CELL_SIZE));

    // Update visual dimensions for smooth dragging
    setVisualWidth(visualWidthUnits);
    setVisualHeight(visualHeightUnits);
  }, [isDragging, enableDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Snap to grid boundaries (max size is GRID_SIZE - 1 since we start at offset 1,1)
      const snappedWidth = Math.max(1, Math.min(GRID_SIZE - 1, Math.round(visualWidth)));
      const snappedHeight = Math.max(1, Math.min(GRID_SIZE - 1, Math.round(visualHeight)));
      
      setRectangleWidth(snappedWidth);
      setRectangleHeight(snappedHeight);
      setVisualWidth(snappedWidth);
      setVisualHeight(snappedHeight);
      
      setIsDragging(false);
      setDragStartPos(null);
    }
  }, [isDragging, visualWidth, visualHeight]);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleValidation = () => {
    if (onValidationRequest) {
      onValidationRequest(currentPerimeter);
    }
  };

  // Grid component
  const Grid = () => (
    <>
      {/* Grid cells */}
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * CELL_SIZE + 0.5}
            y={row * CELL_SIZE + 0.5}
            width={CELL_SIZE - 1}
            height={CELL_SIZE - 1}
            className="shape-designer__grid-cell"
          />
        ))
      )}
    </>
  );

  // Rectangle component
  const Rectangle = () => {
    // Use visual dimensions during dragging, actual dimensions otherwise
    const currentWidth = isDragging ? visualWidth : rectangleWidth;
    const currentHeight = isDragging ? visualHeight : rectangleHeight;
    
    const rectWidth = currentWidth * CELL_SIZE;
    const rectHeight = currentHeight * CELL_SIZE;
    
    // Offset rectangle to start at grid position (1,1) instead of (0,0)
    const offsetX = CELL_SIZE;
    const offsetY = CELL_SIZE;
    
    return (
      <motion.g
        initial={animateSolution ? { opacity: 0.7 } : false}
        animate={animateSolution ? { opacity: 1 } : false}
        transition={{ duration: 0.5 }}
      >
        {/* Rectangle outline */}
        <rect
          x={offsetX}
          y={offsetY}
          width={rectWidth}
          height={rectHeight}
          className={`shape-designer__rectangle ${isDragging ? 'shape-designer__rectangle--dragging' : ''}`}
        />
        
        {/* Side labels */}
        {showSideLabels && (
          <>
            {/* Top label - show preview of snapped value during drag */}
            <text
              x={offsetX + rectWidth / 2}
              y={offsetY - 8}
              textAnchor="middle"
              className="shape-designer__side-label"
            >
              {isDragging ? Math.round(visualWidth) : rectangleWidth}
            </text>
            
            {/* Right label */}
            <text
              x={offsetX + rectWidth + 8}
              y={offsetY + rectHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="shape-designer__side-label"
            >
              {isDragging ? Math.round(visualHeight) : rectangleHeight}
            </text>
            
            {/* Bottom label */}
            <text
              x={offsetX + rectWidth / 2}
              y={offsetY + rectHeight + 20}
              textAnchor="middle"
              className="shape-designer__side-label"
            >
              {isDragging ? Math.round(visualWidth) : rectangleWidth}
            </text>
            
            {/* Left label */}
            <text
              x={offsetX - 8}
              y={offsetY + rectHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="shape-designer__side-label"
            >
              {isDragging ? Math.round(visualHeight) : rectangleHeight}
            </text>
          </>
        )}
        
        {/* Drag handle */}
        {(enableDragging || mode === 'welcome') && (
          <g transform={`translate(${offsetX + rectWidth}, ${offsetY + rectHeight})`}>
            <circle
              r="20"
              fill="white"
              stroke={highlightDragIcon ? "#f59e0b" : "#4079da"}
              strokeWidth={highlightDragIcon ? "3" : "2"}
              className={`shape-designer__drag-handle ${highlightDragIcon ? 'shape-designer__drag-handle--highlighted' : ''} ${!enableDragging ? 'shape-designer__drag-handle--disabled' : ''}`}
              onMouseDown={handleMouseDown}
            />
            {/* Drag icon */}
            <image
              href="/math-tutor-mvp/assets/shape-designer/drag-icon.svg"
              x="-17"
              y="-17"
              width="34"
              height="34"
              className="shape-designer__drag-icon"
            />
          </g>
        )}
        
        {/* Success checkmark */}
        {showCheckmark && (
          <g transform={`translate(${offsetX + rectWidth + 30}, ${offsetY + rectHeight / 2})`} className="shape-designer__checkmark">
            <circle r="20" fill="#10b981" />
            <path
              d="M-8 0L-2 6L8 -6"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        )}
      </motion.g>
    );
  };

  return (
    <div className="shape-designer">
      {/* Target display */}
      {showTarget && targetPerimeter && (
        <div className="shape-designer__target">
          <div className="shape-designer__target-title">
            Target Perimeter: {targetPerimeter} units
          </div>
          {showCurrentPerimeter && (
            <div className={`shape-designer__current-perimeter ${currentPerimeter === targetPerimeter ? 'shape-designer__current-perimeter--correct' : 'shape-designer__current-perimeter--incorrect'}`}>
              Current: {currentPerimeter} units
            </div>
          )}
        </div>
      )}
      
      {/* Grid and rectangle */}
      <div 
        className="shape-designer__grid-container"
        style={{ 
          width: GRID_TOTAL_SIZE, 
          height: GRID_TOTAL_SIZE 
        }}
      >
        <svg 
          width={GRID_TOTAL_SIZE} 
          height={GRID_TOTAL_SIZE}
          className="shape-designer__grid-svg"
        >
          {showGrid && <Grid />}
          <Rectangle />
        </svg>
      </div>
      
      {/* Validation button */}
      {enableValidation && (
        <button
          onClick={handleValidation}
          className="shape-designer__validation-button"
        >
          Check My Shape
        </button>
      )}
      
      {/* Success message */}
      {showSuccess && (
        <div className="shape-designer__success-message">
          <div className="shape-designer__success-title">Perfect!</div>
          <div className="shape-designer__success-subtitle">You created a shape with perimeter {currentPerimeter} units!</div>
        </div>
      )}
    </div>
  );
};

export default ShapeDesigner;