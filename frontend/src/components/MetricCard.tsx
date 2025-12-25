'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down';
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  change = 0,
  trend = 'up',
  loading = false,
}: MetricCardProps) {
  const isPositive = trend === 'up' ? change >= 0 : change < 0;

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="card">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change !== 0 && (
          <span
            className={clsx(
              'flex items-center text-sm font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}
