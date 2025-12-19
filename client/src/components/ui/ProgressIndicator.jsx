const ProgressIndicator = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#0d9488"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Percentage text in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
      </div>
      
      {/* Stats below */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-teal-600">{completed}</span> of{" "}
          <span className="font-semibold">{total}</span> tasks completed
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {total - completed} remaining
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;