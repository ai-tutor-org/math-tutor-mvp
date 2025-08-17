import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './RulerMeasurement.css';

const RulerMeasurement = ({
    length = 3,
    unit = 'cm',
    showAnimation = false,
    startAnimation = false,
    onAnimationComplete
}) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (showAnimation) {
            // If showAnimation is true, start animation immediately
            setStep(0);
            const timers = [
                setTimeout(() => setStep(1), 500),      // Ruler appears
                setTimeout(() => setStep(2), 2000),     // Zoom in
                setTimeout(() => setStep(3), 4000),     // Paperclip appears
                setTimeout(() => setStep(4), 5000),     // Text appears
                setTimeout(() => {
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                }, 6500) // End of animation
            ];
            return () => timers.forEach(clearTimeout);
        } else if (startAnimation) {
            // If startAnimation is triggered (after TTS), start animation
            setStep(0);
            const timers = [
                setTimeout(() => setStep(1), 500),      // Ruler appears
                setTimeout(() => setStep(2), 2000),     // Zoom in
                setTimeout(() => setStep(3), 4000),     // Paperclip appears
                setTimeout(() => setStep(4), 5000),     // Text appears
                setTimeout(() => {
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                }, 6500) // End of animation
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [showAnimation, startAnimation, onAnimationComplete]);

    const rulerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const zoomVariants = {
        initial: { scale: 1, x: 0, y: 0 },
        // S=2.5, Rw=502. Shift = (S-1)*Rw/2 = 1.5*502/2 = 376.5px
        zoomed: { scale: 2.5, x: '376.5px', y: '-60px', transition: { duration: 1.5, ease: 'easeInOut' } },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    };

    const markings = Array.from({ length: 11 }, (_, i) => {
        const isFiveMark = i % 5 === 0;
        const isWholeMark = i % 1 === 0;

        let height = '10px';
        if (isFiveMark) height = '30px';
        else if (isWholeMark) height = '20px';

        return (
            <div key={i} className="ruler-mark-element" style={{ left: `${i * 50}px` }}>
                <div className="ruler-mark-line" style={{ height }}></div>
                {isWholeMark && i < 10 && <span className="ruler-number">{i}</span>}
            </div>
        );
    });

    return (
        <div className="ruler-measurement-container">
            <div className="ruler-zoom-container">
                <div className="ruler-container">
                    <img src="/math-tutor-mvp/images/ruler.svg" alt="Ruler" className="ruler-svg" />
                    <div className="paperclip-container">
                        <svg className="paperclip-icon" xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
                            <g clipPath="url(#clip0_6108_36821)">
                                <path d="M7.69457 44.3576C7.51437 44.859 7.36593 45.378 7.24925 45.9147C6.31896 50.2012 7.25711 54.2976 9.89107 57.4486C13.1791 61.3821 18.723 63.4175 25.5034 63.1814L65.681 62.6911C66.2915 62.7283 70.089 62.9047 74.4728 61.8849C80.8774 60.3949 85.4488 57.051 87.6926 52.2143C90.1556 46.9032 89.0561 42.9486 87.6988 40.5679C85.0834 35.9808 78.8424 32.6676 71.4114 31.9214C71.3622 31.9165 71.3128 31.9135 71.2634 31.913L33.4611 31.3798C32.509 31.3663 31.7266 32.1288 31.713 33.0792C31.6997 34.0312 32.4605 34.8139 33.4126 34.8274L71.1395 35.3593C77.446 36.0087 82.6393 38.6554 84.7032 42.2755C86.0932 44.7128 86.0478 47.5669 84.5645 50.7631C80.2103 60.1496 65.9931 59.2571 65.8499 59.2469C65.8025 59.2435 65.753 59.2419 65.7054 59.2426L25.4412 59.7339C25.4279 59.7339 25.4145 59.7343 25.4012 59.7349C19.6989 59.9371 15.13 58.3398 12.5366 55.237C10.6002 52.9208 9.9192 49.8696 10.619 46.6458C12.2464 39.1376 22.3118 38.7717 22.7936 38.759L62.1816 39.2559C65.9848 39.3202 68.8183 40.5038 70.1532 42.588C71.2877 44.3596 71.2774 46.6799 70.1232 49.303C67.6251 54.9776 59.7271 54.4348 59.6477 54.4288C59.5948 54.4245 59.5418 54.4228 59.4887 54.4237L32.3689 54.8366C31.4168 54.8512 30.6568 55.6352 30.6712 56.5866C30.6858 57.5387 31.4694 58.2985 32.4212 58.2843L59.4729 57.8723C59.9596 57.9007 62.2631 57.9873 64.9012 57.315C68.9259 56.2895 71.8228 53.9993 73.2787 50.6922C74.8969 47.0166 74.8178 43.4789 73.0566 40.7284C71.0788 37.6403 67.2347 35.8928 62.2323 35.8079L22.8087 35.3109C22.7935 35.3108 22.7784 35.3107 22.7632 35.311C22.63 35.3129 19.46 35.3704 16.0077 36.6326C11.8109 38.1669 8.96629 40.8199 7.69457 44.3576Z" fill="#FBB216"/>
                                <path d="M86.7604 51.531C86.7604 51.531 84.1104 57.8756 76.1296 60.5491C76.1296 60.5491 72.3845 61.974 67.7654 61.9763C63.1462 61.9786 23.87 62.548 23.87 62.548C23.87 62.548 17.1636 62.4467 13.7011 60.0014C13.7011 60.0014 19.4629 61.7027 23.2053 61.5701C26.9476 61.4375 68.0134 60.7723 68.0134 60.7723C68.0134 60.7723 74.2593 60.1451 78.1045 58.3956C82.3007 56.4862 84.3177 53.7012 86.7604 51.531Z" fill="#97A945"/>
                                <path d="M72.4714 50.4039C71.8829 50.8637 72.4066 50.5797 72.3562 50.6604C72.3273 50.7066 72.29 50.765 72.2448 50.8341C71.5676 51.8679 69.0774 55.3005 65.286 56.2821C60.8049 57.4426 33.5804 57.633 33.5804 57.633C33.5804 57.633 32.2588 57.7121 32.1603 57.215C32.062 56.7178 61.2293 55.7479 61.2293 55.7479C61.2293 55.7479 67.6895 55.6982 71.2566 50.2075C74.2595 45.5854 73.1553 49.8696 72.4714 50.4039Z" fill="#97A945"/>
                                <path d="M67.5757 39.3945C67.5736 39.396 67.571 39.3974 67.5688 39.3989C65.263 38.8812 62.815 38.8536 62.815 38.8536C62.815 38.8536 24.1809 36.9112 17.3547 39.1314C10.5285 41.3517 9.70443 47.0736 9.46173 48.411C9.21903 49.7483 8.52018 48.5191 8.52018 48.5191C7.5163 44.0211 12.1044 40.1399 12.1044 40.1399C16.8917 36.4386 24.1007 36.5991 24.1007 36.5991C24.1007 36.5991 63.1767 37.3838 66.3609 37.8631C66.9885 37.9576 67.5648 38.161 68.087 38.425C68.2529 38.8266 67.8792 39.1892 67.5757 39.3945Z" fill="#DD8D1A"/>
                                <path d="M32.8104 32.6514C32.8104 32.6514 33.9029 31.8414 35.999 32.057C38.0951 32.2726 71.9711 32.6743 71.9711 32.6743C71.9711 32.6743 81.2787 34.25 84.5824 38.0698C84.5824 38.0698 84.4833 40.1464 83.0827 38.1064C81.9689 36.4843 75.5472 33.3873 70.6266 33.4962C65.706 33.6051 34.6226 33.4485 34.6226 33.4485C34.6226 33.4485 31.7179 33.4613 32.8104 32.6514Z" fill="#DD8D1A"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_6108_36821">
                                    <rect width="67.4363" height="68.2506" fill="white" transform="matrix(0.670005 -0.742357 -0.742357 -0.670005 50.666 95.79)"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div className="measurement-arrows">
                        <div className="arrow-left"></div>
                        <div className="measurement-label">{length}cm</div>
                        <div className="arrow-right"></div>
                    </div>
                </div>
            </div>

            <p className="measurement-text">
                This paperclip is {length} {unit} long.
            </p>
        </div>
    );
};

export default RulerMeasurement; 