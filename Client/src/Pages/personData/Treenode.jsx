import React from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TreeNodeWithProgress = ({
  label,
  progress,
  onClick,
  icon,
  labelStyle = {},
  circleRatio = 0.75,
  trailColor = "#C8D1D8",
  pathColor = "#122E50",
  iconSize = { width: 18, height: 20 },
  size = 60, // Add a size prop for flexibility
}) => {
  return (
    <div className="tree-node" onClick={onClick} style={{ cursor: "pointer" }}>
      <div
        className="progress-container"
        style={{
          width: `${size}px`, // Set the width of the progress bar
          height: `${size}px`, // Set the height of the progress bar
        }}
      >
        <CircularProgressbarWithChildren
          value={progress}
          circleRatio={circleRatio}
          styles={buildStyles({
            rotation: 1 / 2 + 1 / 8,
            strokeLinecap: "butt",
            trailColor: trailColor,
            pathColor: progress > 0 ? pathColor : "transparent",
          })}
        >
          <div className="icon-container" style={{ textAlign: "center" }}>
            {icon && (
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={iconSize.width}
                height={iconSize.height}
                fill="none"
                style={{ display: "block", margin: "0 auto" }}
              >
                {icon}
              </svg>
            )}
            <h6 style={{ fontSize: "10px", margin: "5px 0", ...labelStyle }}>
              {label}
            </h6>
          </div>
        </CircularProgressbarWithChildren>
      </div>
    </div>
  );
};

export default TreeNodeWithProgress;
