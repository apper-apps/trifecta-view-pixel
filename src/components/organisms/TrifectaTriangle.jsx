import React, { useState } from "react";
import { motion } from "framer-motion";

const TrifectaTriangle = ({ sections, onSectionSelect, selectedSection }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const getSectionColor = (sectionId) => {
    switch (sectionId) {
      case "foundation":
        return {
          fill: "url(#foundationGradient)",
          hover: "url(#foundationHoverGradient)"
        };
      case "operations":
        return {
          fill: "url(#operationsGradient)",
          hover: "url(#operationsHoverGradient)"
        };
      case "holdings":
        return {
          fill: "url(#holdingsGradient)",
          hover: "url(#holdingsHoverGradient)"
        };
      default:
        return {
          fill: "url(#foundationGradient)",
          hover: "url(#foundationHoverGradient)"
        };
    }
  };

  const handleSectionClick = (section) => {
    onSectionSelect(section);
  };

  const handleSectionHover = (sectionId) => {
    setHoveredSection(sectionId);
  };

  const handleSectionLeave = () => {
    setHoveredSection(null);
  };

  return (
    <div className="flex items-center justify-center w-full max-w-4xl mx-auto">
      <motion.svg
        viewBox="0 0 600 520"
        className="w-full h-auto max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          {/* Foundation Gradients */}
          <linearGradient id="foundationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="foundationHoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          
          {/* Operations Gradients */}
          <linearGradient id="operationsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="operationsHoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          
          {/* Holdings Gradients */}
          <linearGradient id="holdingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="holdingsHoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Foundation Section (Base) */}
        <motion.path
          d="M 300 450 L 100 450 L 200 250 Z"
          fill={hoveredSection === "foundation" || selectedSection?.id === "foundation" 
            ? getSectionColor("foundation").hover 
            : getSectionColor("foundation").fill}
          className="triangle-section"
          onClick={() => handleSectionClick(sections.find(s => s.id === "foundation"))}
          onMouseEnter={() => handleSectionHover("foundation")}
          onMouseLeave={handleSectionLeave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            filter: selectedSection?.id === "foundation" 
              ? "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))"
              : "none"
          }}
        />

        {/* Operations Section (Left) */}
        <motion.path
          d="M 200 250 L 100 450 L 50 150 Z"
          fill={hoveredSection === "operations" || selectedSection?.id === "operations" 
            ? getSectionColor("operations").hover 
            : getSectionColor("operations").fill}
          className="triangle-section"
          onClick={() => handleSectionClick(sections.find(s => s.id === "operations"))}
          onMouseEnter={() => handleSectionHover("operations")}
          onMouseLeave={handleSectionLeave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            filter: selectedSection?.id === "operations" 
              ? "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))"
              : "none"
          }}
        />

        {/* Holdings Section (Right) */}
        <motion.path
          d="M 400 250 L 300 450 L 550 150 Z"
          fill={hoveredSection === "holdings" || selectedSection?.id === "holdings" 
            ? getSectionColor("holdings").hover 
            : getSectionColor("holdings").fill}
          className="triangle-section"
          onClick={() => handleSectionClick(sections.find(s => s.id === "holdings"))}
          onMouseEnter={() => handleSectionHover("holdings")}
          onMouseLeave={handleSectionLeave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            filter: selectedSection?.id === "holdings" 
              ? "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))"
              : "none"
          }}
        />

        {/* Section Labels */}
        <text x="200" y="370" textAnchor="middle" className="fill-white font-semibold text-lg pointer-events-none">
          Foundation
        </text>
        <text x="125" y="300" textAnchor="middle" className="fill-white font-semibold text-lg pointer-events-none">
          Operations
        </text>
        <text x="475" y="300" textAnchor="middle" className="fill-white font-semibold text-lg pointer-events-none">
          Holdings
        </text>

        {/* Center Circle */}
        <circle 
          cx="300" 
          cy="300" 
          r="40" 
          fill="rgba(255, 255, 255, 0.95)" 
          stroke="rgba(99, 102, 241, 0.3)" 
          strokeWidth="2"
          className="pointer-events-none"
        />
        <text x="300" y="308" textAnchor="middle" className="fill-gray-700 font-bold text-sm pointer-events-none">
          TRIFECTA
        </text>
      </motion.svg>
    </div>
  );
};

export default TrifectaTriangle;