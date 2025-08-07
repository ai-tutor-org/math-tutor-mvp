import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import './ShapeMeasurement.css';

const Ruler = () => {
    const x = useMotionValue(0);
    const rotate = useMotionValue(0);
    const rulerRef = useRef(null);

    const handleResizeDrag = (event, info) => {
        x.set(x.get() + info.offset.x);
    };

    const handleRotateDrag = (event, info) => {
        if (!rulerRef.current) return;
        const rulerRect = rulerRef.current.getBoundingClientRect();
        const rulerCenter = {
            x: rulerRect.left + rulerRect.width / 2,
            y: rulerRect.top + rulerRect.height / 2,
        };
        const newAngle = Math.atan2(info.point.y - rulerCenter.y, info.point.x - rulerCenter.x) * (180 / Math.PI);
        rotate.set(newAngle);
    };

    const width = useTransform(x, value => 300 + value);

    return (
        <motion.div
            ref={rulerRef}
            className="ruler"
            style={{ width, rotate }}
            drag
            dragConstraints={{ top: -250, left: -450, right: 450, bottom: 250 }}
            dragMomentum={false}
        >
            <div className="ruler-body">
                {/* Create 10 cm markings */}
                {[...Array(11)].map((_, i) => (
                    <div key={i} className="ruler-mark-container" style={{ left: `${i * 10}%` }}>
                        <div className="ruler-mark"></div>
                        <span className="ruler-number">{i}</span>
                    </div>
                ))}
            </div>
            <motion.div
                className="rotate-handle"
                drag
                onDrag={handleRotateDrag}
                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                dragElastic={0}
            />
            <motion.div
                className="resize-handle"
                drag="x"
                onDrag={handleResizeDrag}
                dragConstraints={{ left: 0, right: 300 }}
                dragElastic={0}
            />
        </motion.div>
    )
}

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
                {/* Rectangle will be rendered here */}
                <div
                    className="rectangle"
                    style={{
                        width: `${shape.width}px`,
                        height: `${shape.height}px`
                    }}
                >
                    <div className="highlighted-side" style={{ width: '100%', height: '10px' }}></div>
                </div>

                {/* Interactive Ruler will be rendered here */}
                <Ruler />

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