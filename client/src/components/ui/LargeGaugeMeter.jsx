const LargeGaugeMeter = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative" style={{ width: 200, height: 200 }}>
        <svg
          width={200}
          height={200}
          className="transform -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx={100}
            cy={100}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
            className="opacity-30"
          />
          
          {/* Progress circle */}
          <circle
            cx={100}
            cy={100}
            r={radius}
            stroke="url(#largeGradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1500 ease-out"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="largeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">{percentage}%</div>
            <div className="text-sm text-gray-500 font-medium">Complete</div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-6 text-center space-y-2">
        <div className="text-lg text-gray-700 font-semibold">
          <span className="text-teal-600">{completed}</span> of{" "}
          <span className="text-gray-800">{total}</span> tasks completed
        </div>
        <div className="text-sm text-gray-500">
          {total - completed} tasks remaining
        </div>
      </div>
    </div>
  );
};

export default LargeGaugeMeter;