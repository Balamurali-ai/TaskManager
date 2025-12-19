const GaugeMeter = ({ completed, total, size = 120 }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
            className="opacity-30"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
            <div className="text-xs text-gray-500 mt-1">Complete</div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 text-center space-y-1">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-teal-600">{completed}</span> of{" "}
          <span className="font-semibold">{total}</span> tasks
        </div>
        <div className="text-xs text-gray-500">
          {total - completed} remaining
        </div>
      </div>
    </div>
  );
};

export default GaugeMeter;