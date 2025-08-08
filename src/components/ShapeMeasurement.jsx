import React, { useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import './ShapeMeasurement.css';

const PX_PER_CM = 30; // keep spacing constant
const PX_PER_MM = PX_PER_CM / 10;
const MIN_CM = 5;
const MAX_CM = 30;
const SNAP_ANGLE_DEG = 7; // snap to 0, 90, 180, 270 within this threshold
const SNAP_DISTANCE_PX = 12; // snap to edges/corners within this threshold

const InteractiveRuler = ({ objectRef }) => {
    const [lengthPx, setLengthPx] = useState(10 * PX_PER_CM);
    const [angleDeg, setAngleDeg] = useState(0);
    const rulerRef = useRef(null);
    const rotateHandleRef = useRef(null);

    // Controlled drag position
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Rotation offset so clicking the handle does not snap to opposite side
    const rotateOffsetRef = useRef(0);

    const handleResizeDrag = (event, info) => {
        const dx = info.delta?.x || 0;
        const dy = info.delta?.y || 0;
        const theta = (angleDeg * Math.PI) / 180;
        // Project pointer delta onto the ruler's local x-axis
        const alongAxis = dx * Math.cos(theta) + dy * Math.sin(theta);
        setLengthPx((prev) => {
            const next = prev + alongAxis;
            const minPx = MIN_CM * PX_PER_CM;
            const maxPx = MAX_CM * PX_PER_CM;
            return Math.max(minPx, Math.min(maxPx, next));
        });
    };

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

    const handleRotateStart = (event, info) => {
        const pointerAngle = computePointerAngle(info.point);
        rotateOffsetRef.current = angleDeg - pointerAngle;
    };

    const handleRotateDrag = (event, info) => {
        const pointerAngle = computePointerAngle(info.point);
        const raw = pointerAngle + rotateOffsetRef.current;
        setAngleDeg(snapAngle(raw));
    };

    // Snap position of the ruler based on rotate handle proximity to object edges/corners
    const snapDragPosition = () => {
        if (!objectRef?.current || !rotateHandleRef.current) return;
        const objRect = objectRef.current.getBoundingClientRect();
        const handleRect = rotateHandleRef.current.getBoundingClientRect();
        const handleCenter = {
            x: handleRect.left + handleRect.width / 2,
            y: handleRect.top + handleRect.height / 2,
        };

        const targets = [];
        // Corners
        const corners = [
            { x: objRect.left, y: objRect.top },
            { x: objRect.right, y: objRect.top },
            { x: objRect.left, y: objRect.bottom },
            { x: objRect.right, y: objRect.bottom },
        ];
        for (const c of corners) {
            const dx = c.x - handleCenter.x;
            const dy = c.y - handleCenter.y;
            const dist = Math.hypot(dx, dy);
            targets.push({ dx, dy, dist });
        }
        // Edges: top/bottom align Y, left/right align X
        const yTargets = [objRect.top, objRect.bottom];
        for (const ty of yTargets) {
            const dy = ty - handleCenter.y;
            targets.push({ dx: 0, dy, dist: Math.abs(dy) });
        }
        const xTargets = [objRect.left, objRect.right];
        for (const tx of xTargets) {
            const dx = tx - handleCenter.x;
            targets.push({ dx, dy: 0, dist: Math.abs(dx) });
        }

        // Find the closest within threshold
        let best = null;
        for (const t of targets) {
            if (t.dist <= SNAP_DISTANCE_PX && (!best || t.dist < best.dist)) {
                best = t;
            }
        }
        if (!best) return;

        // Apply snap by adjusting motion values
        x.set(x.get() + best.dx);
        y.set(y.get() + best.dy);
    };

    const numWholeCm = Math.floor(lengthPx / PX_PER_CM);
    const numMm = Math.floor(lengthPx / PX_PER_MM);

    return (
        <motion.div
            ref={rulerRef}
            className="interactive-ruler"
            style={{ width: lengthPx, x, y }}
            drag
            onDrag={snapDragPosition}
            dragConstraints={{ top: -250, left: -450, right: 450, bottom: 250 }}
            dragMomentum={false}
        >
            {/* Rotating layer: body + ticks */}
            <div className="interactive-ruler-rotating" style={{ transform: `rotate(${angleDeg}deg)` }}>
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

                    {/* Handles inside the body so they rotate and stay attached */}
                    <motion.div
                        ref={rotateHandleRef}
                        className="interactive-rotate-handle"
                        drag
                        onDragStart={handleRotateStart}
                        onDrag={handleRotateDrag}
                        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                        dragElastic={0}
                    />

                    <motion.div
                        className="interactive-resize-handle"
                        drag="x"
                        onDrag={handleResizeDrag}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0}
                    />
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

const ShapeMeasurement = ({ onAnswer, interactionId, shape, correctAnswer }) => {
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
                <InteractiveRuler objectRef={objectRef} />
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