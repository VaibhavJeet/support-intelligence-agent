'use client';

import { TrendingUp, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import type { Pattern } from '@/lib/types';

interface PatternCardProps {
  pattern: Pattern;
}

export function PatternCard({ pattern }: PatternCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-primary';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'badge-success';
      case 'monitoring':
        return 'badge-warning';
      default:
        return 'badge-danger';
    }
  };

  return (
    <div
      className={clsx(
        'card hover:shadow-md transition-shadow',
        pattern.status === 'resolved' && 'opacity-75'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={clsx(
                'p-2 rounded-lg',
                pattern.severity === 'critical'
                  ? 'bg-red-100'
                  : pattern.severity === 'high'
                  ? 'bg-orange-100'
                  : 'bg-purple-100'
              )}
            >
              <TrendingUp
                className={clsx(
                  'w-5 h-5',
                  pattern.severity === 'critical'
                    ? 'text-red-600'
                    : pattern.severity === 'high'
                    ? 'text-orange-600'
                    : 'text-purple-600'
                )}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {pattern.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`badge ${getStatusColor(pattern.status)}`}>
                  {pattern.status}
                </span>
                <span className={`badge ${getSeverityColor(pattern.severity)}`}>
                  {pattern.severity}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{pattern.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <strong>{pattern.ticket_count}</strong> tickets
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              First detected{' '}
              {formatDistanceToNow(new Date(pattern.first_detected), {
                addSuffix: true,
              })}
            </span>
          </div>

          {pattern.root_cause && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Root Cause:</strong> {pattern.root_cause}
              </p>
            </div>
          )}

          {pattern.suggested_actions && pattern.suggested_actions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Suggested Actions:
              </p>
              <ul className="space-y-1">
                {pattern.suggested_actions.map((action, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <ChevronRight className="w-4 h-4 mt-0.5 text-primary-500" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
