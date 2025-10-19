interface TimelineItemProps {
  color: string;
  title: string;
  subtitle?: string;
  showBorder?: boolean;
}

export default function TimelineItem({ color, title, subtitle, showBorder = true }: TimelineItemProps) {
  const borderClass = showBorder ? 'border-b border-gray-100' : '';
  
  return (
    <div className={`flex items-start space-x-3 pb-4 ${borderClass} last:border-0 last:pb-0`}>
      <div className={`w-2 h-2 rounded-full ${color} mt-2`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
