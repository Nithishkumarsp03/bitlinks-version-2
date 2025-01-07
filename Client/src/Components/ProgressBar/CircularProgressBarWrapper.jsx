// CircularProgressBarWrapper.js
import React from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CircularProgressBarWrapper = ({ children, progress, pathColor, trailColor, size }) => {
  return (
    <div style={{ width: `${size}%`, height: `${size}%` }}>
      <CircularProgressbarWithChildren
        value={progress}
        circleRatio={0.75}
        styles={buildStyles({
          rotation: 1 / 2 + 1 / 8,
          pathColor: pathColor || '#4caf50', // Default color is green
          trailColor: trailColor || '#d6d6d6', // Default trail color
          strokeLinecap: 'butt',
          pathTransitionDuration: 0.5,
        })}
      >
        {children}
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default CircularProgressBarWrapper;
