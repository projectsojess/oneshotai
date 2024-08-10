
const GradientIcon = ({ Icon, isGold = false }) => (
    <svg width="32" height="32" className="stroke-current">
    <defs>
      <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
      <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <Icon
      stroke={isGold ? "url(#gold-gradient)" : "url(#blue-gradient)"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
  );


  export default GradientIcon;