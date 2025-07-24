import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ metric, index }) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return "TrendingUp";
      case "down": return "TrendingDown";
      default: return "Minus";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="metric-card p-6 bg-gradient-to-br from-white to-surface-50">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{metric.label}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                {metric.value}
              </span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
          </div>
          <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
            <ApperIcon name={getTrendIcon(metric.trend)} className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;