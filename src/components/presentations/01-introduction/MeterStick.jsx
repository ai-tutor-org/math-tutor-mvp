import React, { useEffect } from 'react';
import './MeterStick.css';

const MeterStick = ({ startAnimation, onAnimationComplete }) => {
    useEffect(() => {
        if (startAnimation && onAnimationComplete) {
            onAnimationComplete();
        }
    }, [startAnimation, onAnimationComplete]);

    const markings = Array.from({ length: 11 }, (_, i) => {
        const cmValue = i * 20;
        const position = i * 40 + 1; // 400px height / 10 intervals = 40px per interval + 1px offset
        return (
            <div key={i} className="meter-mark-container" style={{ bottom: `${position}px` }}>
                <div className="meter-mark-line"></div>
                <span className="meter-mark-number">{cmValue}</span>
            </div>
        );
    });

    return (
        <div className="meter-stick-container">
            <div className="visuals-container">
                <div className="door-container">
                    <img src="/images/door.svg" alt="Door" className="door-icon" />
                </div>
                <div className="meter-stick-visuals">
                    <img src="/images/meter-ruler.svg" alt="Meter Ruler" className="meter-ruler" />
                    <div className="meter-stick">
                        {markings}
                    </div>
                </div>
            </div>
            <div className="measurement-label-container">
                <span className="measurement-label-meter-stick">2m = 200cm</span>
            </div>
        </div>
    );
};

export default MeterStick;