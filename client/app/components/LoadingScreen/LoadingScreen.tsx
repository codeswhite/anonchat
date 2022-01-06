import React, { FC } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

interface IProps {
  progressBarText?: string;
}

const LoadingScreen: FC<IProps> = ({ progressBarText }) => {
  return (
    <ProgressBar
      className="mt-5 mx-9"
      animated
      label={progressBarText ? progressBarText : "טוען נתונים ..."}
      max={1}
      now={1}
    />
  );
};
export default LoadingScreen;
