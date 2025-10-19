interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function IconButton({ icon, onClick, className = '', ariaLabel }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-gray-700 hover:text-cyan-600 transition ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
}
