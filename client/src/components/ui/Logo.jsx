const Logo = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" fill="#0D9488" />
        <circle cx="50" cy="50" r="35" fill="#14B8A6" />
        <path
          d="M35 45L45 55L65 35"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="70" r="3" fill="white" />
        <circle cx="40" cy="75" r="2" fill="white" opacity="0.7" />
        <circle cx="60" cy="75" r="2" fill="white" opacity="0.7" />
      </svg>
    </div>
  );
};

export default Logo;