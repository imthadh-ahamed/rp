interface IconBoxProps {
  icon: React.ReactNode;
  gradient: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function IconBox({ icon, gradient, size = 'md' }: IconBoxProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizes[size]} rounded-lg ${gradient} flex items-center justify-center`}>
      {icon}
    </div>
  );
}
