'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, AlertCircle, Calendar, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import { PatternCard } from '@/components/PatternCard';

export default function PatternsPage() {
  const { data: patterns, isLoading } = useQuery({
    queryKey: ['patterns'],
    queryFn: () => api.getPatterns(),
  });

  const activePatterns = patterns?.filter((p) => p.status === 'active') ?? [];
  const resolvedPatterns = patterns?.filter((p) => p.status === 'resolved') ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patterns</h1>
        <p className="mt-1 text-gray-600">
          Recurring issues and trends detected across support tickets
        </p>
      </div>

      {/* Pattern Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Patterns</p>
              <p className="text-2xl font-bold text-gray-900">
                {activePatterns.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {resolvedPatterns.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Tickets per Pattern</p>
              <p className="text-2xl font-bold text-gray-900">
                {patterns && patterns.length > 0
                  ? Math.round(
                      patterns.reduce((acc, p) => acc + p.ticket_count, 0) /
                        patterns.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Patterns */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Active Patterns
        </h2>
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : activePatterns.length > 0 ? (
          <div className="grid gap-4">
            {activePatterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-500">No active patterns detected</p>
          </div>
        )}
      </div>

      {/* Resolved Patterns */}
      {resolvedPatterns.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Resolved Patterns
          </h2>
          <div className="grid gap-4">
            {resolvedPatterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
