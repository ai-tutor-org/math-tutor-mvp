import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './ShapeMeasurement.css';

const PX_PER_CM = 30; // keep spacing constant
const MIN_CM = 5;
const MAX_CM = 30;

const InteractiveRuler = () => {
    const [lengthPx, setLengthPx] = useState(10 * PX_PER_CM);
    const [angleDeg, setAngleDeg] = useState(0);
    const rulerRef = useRef(null);

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

    const handleRotateStart = (event, info) => {
        const pointerAngle = computePointerAngle(info.point);
        rotateOffsetRef.current = angleDeg - pointerAngle;
    };

    const handleRotateDrag = (event, info) => {
        const pointerAngle = computePointerAngle(info.point);
        setAngleDeg(pointerAngle + rotateOffsetRef.current);
    };

    const numWholeCm = Math.floor(lengthPx / PX_PER_CM);

    return (
        <motion.div
            ref={rulerRef}
            className="interactive-ruler"
            style={{ width: lengthPx }}
            drag
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

                    {/* Half-cm minor ticks */}
                    {[...Array(numWholeCm)].map((_, i) => (
                        <div
                            key={`half-${i}`}
                            className="interactive-ruler-tick minor"
                            style={{ left: `${i * PX_PER_CM + PX_PER_CM / 2}px` }}
                        >
                            <div className="interactive-ruler-tick-line" />
                        </div>
                    ))}

                    {/* Handles inside the body so they rotate and stay attached */}
                    <motion.div
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

const ShapeMeasurement = ({ onAnswer, interactionId, shape, correctAnswer }) => {
    const [answer, setAnswer] = useState('');

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
                <div
                    className="rect-object"
                    style={{ width: `${shape.width}px`, height: `${shape.height}px` }}
                >
                    <img src="/assets/notebook.svg" alt="Notebook" className="rect-object-img" />
                    <div className="highlighted-side" style={{ width: '100%', height: '10px' }}></div>
                </div>

                {/* Interactive Ruler */}
                <InteractiveRuler />
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