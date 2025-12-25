'use client';

import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/lib/api';
import { clsx } from 'clsx';

export function RecentTickets() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['recent-tickets'],
    queryFn: () => api.getRecentTickets(5),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-primary';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
        <Link href="/tickets" className="text-sm text-primary-600 hover:underline">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets?id=${ticket.id}`}
              className="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div
                className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  ticket.analysis
                    ? getSentimentColor(ticket.analysis.sentiment)
                    : 'bg-gray-100'
                )}
              >
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {ticket.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(ticket.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              {ticket.analysis && (
                <div className="text-right">
                  <span
                    className={clsx(
                      'text-xs font-medium',
                      getSentimentColor(ticket.analysis.sentiment)
                    )}
                  >
                    {ticket.analysis.sentiment}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No recent tickets</p>
      )}
    </div>
  );
}
