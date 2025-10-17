import React from "react";
import "./Loader.css";
import { CircularProgress, Typography } from "@mui/material";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-box">
        <CircularProgress size={70} thickness={5} color="primary" />
        <Typography className="loader-text">
         Welcome to ustav-aura Loading, please wait...
        </Typography>
      </div>
    </div>
  );
};

export default Loader;
