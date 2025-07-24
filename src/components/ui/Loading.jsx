import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-surface-200 border-t-accent-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse w-32 mx-auto"></div>
          <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded animate-pulse w-24 mx-auto"></div>
        </div>
        <p className="text-gray-500 text-sm">Loading your business overview...</p>
      </div>
    </div>
  );
};

export default Loading;