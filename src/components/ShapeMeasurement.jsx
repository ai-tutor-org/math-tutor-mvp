import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import './ShapeMeasurement.css';

const PX_PER_CM = 30; // keep spacing constant
const PX_PER_MM = PX_PER_CM / 10;
const MIN_CM = 5;
const MAX_CM = 30;
const SNAP_ANGLE_DEG = 7; // snap to 0, 90, 180, 270 within this threshold
const SNAP_DISTANCE_PX = 12; // snap to edges/corners within this threshold

const InteractiveRuler = ({ objectRef, orientation = 'horizontal' }) => {
    const lengthPx = 12 * PX_PER_CM; // Fixed to 12cm
    const [angleDeg, setAngleDeg] = useState(orientation === 'vertical' ? 90 : 0);
    
    const rulerRef = useRef(null);
    const rotateHandleRef = useRef(null);

    // Controlled drag position
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useMotionValue(orientation === 'vertical' ? 90 : 0);
    
    // Update angle when orientation prop changes
    useEffect(() => {
        const newAngle = orientation === 'vertical' ? 90 : 0;
        setAngleDeg(newAngle);
        rotate.set(newAngle);
    }, [orientation, rotate]);
    
    // Update rotate motion value when angle changes
    useEffect(() => {
        rotate.set(angleDeg);
    }, [angleDeg, rotate]);

    // Rotation offset so clicking the handle does not snap to opposite side
    const rotateOffsetRef = useRef(0);


    const computePointerAngle = (point) => {
        if (!rulerRef.current) return angleDeg;
        const rect = rulerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radians = Math.atan2(point.y - centerY, point.x - centerX);
        return (radians * 180) / Math.PI;
    };

    const snapAngle = (rawAngleDeg) => {
        const normalized = ((rawAngleDeg % 360) + 360) % 360;
        const candidates = [0, 90, 180, 270, 360];
        for (const c of candidates) {
            if (Math.abs(normalized - c) <= SNAP_ANGLE_DEG) {
                return c % 360;
            }
        }
        return rawAngleDeg;
    };


    // Snap position disabled since handles are removed
    const snapDragPosition = () => {
        // No-op since we removed the handles
    };

    const numWholeCm = Math.floor(lengthPx / PX_PER_CM);
    const numMm = Math.floor(lengthPx / PX_PER_MM);

    return (
        <motion.div
            ref={rulerRef}
            className="interactive-ruler"
            style={{ width: lengthPx, x, y, rotate }}
            drag
            onDrag={snapDragPosition}
            dragConstraints={{ top: -250, left: -450, right: 450, bottom: 250 }}
            dragMomentum={false}
        >
            {/* Body + ticks - rotation now applied to outer div */}
            <div className="interactive-ruler-rotating">
                <div className="interactive-ruler-body">
                    {/* Whole cm ticks with numbers */}
                    {[...Array(numWholeCm + 1)].map((_, i) => (
                        <div key={`cm-${i}`} className="interactive-ruler-tick" style={{ left: `${i * PX_PER_CM}px` }}>
                            <div className="interactive-ruler-tick-line" />
                            <span className="interactive-ruler-number">{i}</span>
                        </div>
                    ))}

                    {/* Millimeter ticks (skip where cm ticks exist) */}
                    {[...Array(numMm + 1)].map((_, i) => {
                        if (i % 10 === 0) return null; // cm already drawn
                        const isHalf = i % 10 === 5;
                        return (
                            <div
                                key={`mm-${i}`}
                                className={`interactive-ruler-tick-mm${isHalf ? ' half' : ''}`}
                                style={{ left: `${i * PX_PER_MM}px` }}
                            >
                                <div className="interactive-ruler-tick-line" />
                            </div>
                        );
                    })}

                </div>
            </div>
        </motion.div>
    );
};

const HighlightedSide = ({ orientation = 'top' }) => {
    const className = `highlighted-side ${orientation}`;
    return <div className={className}></div>;
};

const ShapeVisual = React.forwardRef(({ shape }, ref) => {
    const { type = 'rectangle', width, height, imageSrc, highlight = 'top' } = shape || {};
    const baseClass = 'shape-obj';
    const className = `${baseClass} shape-${type}`;

    const style = { width: `${width}px`, height: `${height}px` };

    if (imageSrc) {
        return (
            <div ref={ref} className={className} style={style}>
                <img src={imageSrc} alt={type} className="rect-object-img" />
                <HighlightedSide orientation={highlight} />
            </div>
        );
    }

    return (
        <div ref={ref} className={className} style={style}>
            <HighlightedSide orientation={highlight} />
        </div>
    );
});

const ShapeMeasurement = ({ onAnswer, interactionId, shape, correctAnswer, rulerOrientation }) => {
    const [answer, setAnswer] = useState('');
    const objectRef = useRef(null);

    const handleCheck = () => {
        onAnswer({
            interactionId: interactionId,
            isCorrect: parseFloat(answer) === correctAnswer,
            answer: parseFloat(answer),
        });
    };

    return (
        <div className="shape-measurement-container">
            <div className="shape-area">
                <ShapeVisual ref={objectRef} shape={shape?.type ? shape : { ...shape, type: 'rectangle', imageSrc: '/assets/notebook.svg', highlight: shape?.highlight || 'top' }} />

                {/* Interactive Ruler */}
                <InteractiveRuler objectRef={objectRef} orientation={rulerOrientation} />
            </div>

            <div className="controls-area">
                <label htmlFor="length-input">Length (cm):</label>
                <input
                    id="length-input"
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="e.g., 8"
                />
                <button onClick={handleCheck}>Check</button>
            </div>
        </div>
    );
};

export default ShapeMeasurement; 