import React, { useState, useEffect } from 'react';

const PremiumProgress = ({ value = 0, className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(Math.min(100, Math.max(0, value)));
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default PremiumProgress;