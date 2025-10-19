interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 4 | 6 | 8;
  className?: string;
}

export default function Grid({ children, cols = 1, gap = 6, className = '' }: GridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
    6: 'md:grid-cols-3 lg:grid-cols-6'
  };

  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid grid-cols-1 ${colsClass[cols]} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}
