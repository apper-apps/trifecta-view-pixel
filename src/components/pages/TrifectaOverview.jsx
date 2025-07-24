import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getTrifectaSections } from "@/services/api/trifectaService";
import ApperIcon from "@/components/ApperIcon";
import TrifectaTriangle from "@/components/organisms/TrifectaTriangle";
import SectionDetailPanel from "@/components/molecules/SectionDetailPanel";
import MetricCard from "@/components/molecules/MetricCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const TrifectaOverview = () => {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSections = async () => {
    try {
      setError("");
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
      const data = await getTrifectaSections();
      setSections(data);
    } catch (err) {
      setError("Failed to load business structure data. Please try again.");
      console.error("Error loading sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
  };

  const handleClosePanel = () => {
    setSelectedSection(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSections} />;
  if (!sections || sections.length === 0) {
    return <Empty 
      title="No Business Structure Data" 
      description="Configure your Trifecta structure to get started with strategic visualization."
      actionLabel="Configure Structure"
    />;
  }

  const summaryMetrics = [
    { label: "Total Assets", value: "$2.4M", unit: "", trend: "up" },
    { label: "Active Operations", value: "12", unit: "processes", trend: "up" },
    { label: "Holdings Value", value: "$1.8M", unit: "", trend: "stable" },
    { label: "Foundation Score", value: "94", unit: "%", trend: "up" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
            Business Trifecta Overview
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visualize your organizational structure through the three foundational pillars. 
            Click any section to explore detailed insights and metrics.
          </p>
        </div>
      </motion.div>

      {/* Summary Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
>
        {summaryMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} />
        ))}
      </motion.div>

      {/* Status Widget */}
      <motion.div
        className="bg-gradient-to-br from-white to-surface-50 rounded-xl p-6 border border-surface-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Shield" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Setup Status Overview</h3>
              <p className="text-sm text-gray-600">Critical business structure completion indicators</p>
            </div>
          </div>
          
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(sections || []).map((section, index) => (
              <motion.div
key={section.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-surface-100 hover:border-surface-200 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                  section.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <ApperIcon 
                    name={section.status === 'completed' ? "Check" : "X"} 
                    className="w-3 h-3" 
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${
                    section.status === 'completed' ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {section.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div 
        className="flex flex-col items-center space-y-8 py-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <TrifectaTriangle 
          sections={sections}
          onSectionSelect={handleSectionSelect}
          selectedSection={selectedSection}
        />
        
        {/* Interaction Hint */}
        <motion.div 
          className="flex items-center space-x-2 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <ApperIcon name="MousePointer" className="w-4 h-4" />
          <span>Click any section to explore detailed insights</span>
        </motion.div>
      </motion.div>

      {/* Section Descriptions */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            className="bg-gradient-to-br from-white to-surface-50 rounded-xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => handleSectionSelect(section)}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-accent-600 transition-colors">
                  {section.name}
                </h3>
                <div className={`w-3 h-3 rounded-full ${
                  section.id === "foundation" ? "bg-gradient-to-r from-primary-500 to-primary-600" :
                  section.id === "operations" ? "bg-gradient-to-r from-secondary-500 to-secondary-600" :
                  "bg-gradient-to-r from-accent-500 to-accent-600"
                }`}></div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
              <div className="flex items-center text-accent-600 text-sm font-medium group-hover:text-accent-700 transition-colors">
                <span>Explore Details</span>
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Detail Panel */}
      <SectionDetailPanel 
        section={selectedSection}
        isVisible={!!selectedSection}
        onClose={handleClosePanel}
      />

      {/* Overlay for mobile */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrifectaOverview;