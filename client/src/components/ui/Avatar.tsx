interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  gradient?: string;
}

export default function Avatar({ 
  src, 
  alt = 'User', 
  initials = 'U', 
  size = 'md',
  gradient = 'from-cyan-500 to-teal-500'
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
}
