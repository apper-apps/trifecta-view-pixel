import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ 
  progress = 0, 
  size = "md", 
  showPercentage = true, 
  className = "",
  color = "primary" 
}) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600", 
    accent: "from-accent-500 to-accent-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600"
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`space-y-1 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-semibold text-gray-700">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;