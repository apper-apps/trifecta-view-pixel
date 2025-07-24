import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import MetricCard from "@/components/molecules/MetricCard";
import ApperIcon from "@/components/ApperIcon";

const SectionDetailPanel = ({ section, isVisible, onClose }) => {
  if (!section) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6 border-b border-surface-200 bg-gradient-to-r from-surface-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{section.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{section.position} Pillar</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Overview</h3>
              <p className="text-gray-600 leading-relaxed">{section.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {section.metrics.map((metric, index) => (
                  <MetricCard key={index} metric={metric} index={index} />
                ))}
              </div>
            </div>

            {section.subComponents && section.subComponents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Components</h3>
                <div className="space-y-3">
                  {section.subComponents.map((component, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg border border-surface-200">
                      <h4 className="font-medium text-gray-800">{component.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionDetailPanel;