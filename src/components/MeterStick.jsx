import React, { useEffect } from 'react';
import './MeterStick.css';

const MeterStick = ({ startAnimation, onAnimationComplete }) => {
    useEffect(() => {
        if (startAnimation && onAnimationComplete) {
            onAnimationComplete();
        }
    }, [startAnimation, onAnimationComplete]);

    const markings = Array.from({ length: 11 }, (_, i) => {
        const position = i * 10;
        return (
            <div key={i} className="meter-mark-container" style={{ bottom: `${position}%` }}>
                <div className="meter-mark-line"></div>
                <span className="meter-mark-number">{position}</span>
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
                <span className="measurement-label-meter-stick">1m = 100cm</span>
            </div>
        </div>
    );
};

export default MeterStick;