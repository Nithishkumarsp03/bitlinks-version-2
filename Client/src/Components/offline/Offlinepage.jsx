import React from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import noInternetAnimation from "../../Assets/lottie/Animation - 1741923660623.json"; // Add your Lottie JSON file here

const NoInternetPage = ({ onRetry }) => {
  return (
    <div className="no-internet-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Lottie animationData={noInternetAnimation} className="animation" />
      </motion.div>
      <motion.h1
        className="title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        No Internet Connection
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Please check your connection and try again.
      </motion.p>
      <motion.button
        className="retry-button"
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
      >
        Retry
      </motion.button>
    </div>
  );
};

export default NoInternetPage;
