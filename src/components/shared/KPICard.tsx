/**
 * Freelance OS - KPI Card Component
 */

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
};

const iconBgClasses = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
  purple: 'bg-purple-100',
  gray: 'bg-gray-100',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  color = 'blue',
}: KPICardProps) {
  return (
    <Card className={cn('border', colorClasses[color], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="mt-2 flex items-center gap-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend === 'up' && 'text-green-600',
                    trend === 'down' && 'text-red-600',
                    trend === 'neutral' && 'text-gray-600'
                  )}
                >
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {trend === 'neutral' && '→'} {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', iconBgClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
