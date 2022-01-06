import React, { FC } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const LoadingScreen: FC = () => {
  return (
    <ProgressBar
      className="mt-5 mx-9"
      animated
      label={"טוען נתונים ..."}
      max={1}
      now={1}
    />
  );
};
export default LoadingScreen;
