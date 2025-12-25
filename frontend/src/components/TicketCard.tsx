'use client';

import { MessageSquare, Clock, User, Loader2, Eye, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import type { Ticket } from '@/lib/types';

interface TicketCardProps {
  ticket: Ticket;
  onAnalyze: () => void;
  onView: () => void;
  analyzing?: boolean;
}

export function TicketCard({
  ticket,
  onAnalyze,
  onView,
  analyzing = false,
}: TicketCardProps) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'badge-success';
      case 'in_progress':
        return 'badge-warning';
      default:
        return 'badge-primary';
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {ticket.subject}
            </h3>
            <span className={`badge ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`badge ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>

          <p className="text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {ticket.customer_name && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {ticket.customer_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(new Date(ticket.created_at), {
                addSuffix: true,
              })}
            </span>
            {ticket.category && (
              <span className="badge bg-gray-100 text-gray-600">
                {ticket.category}
              </span>
            )}
          </div>

          {/* Analysis Results */}
          {ticket.analysis && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <span
                  className={clsx(
                    'px-2 py-1 rounded font-medium',
                    getSentimentColor(ticket.analysis.sentiment)
                  )}
                >
                  {ticket.analysis.sentiment} sentiment
                </span>
                <span className="text-gray-500">
                  Urgency: {Math.round(ticket.analysis.urgency_score * 100)}%
                </span>
                {ticket.analysis.key_entities.length > 0 && (
                  <div className="flex items-center gap-1">
                    {ticket.analysis.key_entities.slice(0, 3).map((entity) => (
                      <span
                        key={entity}
                        className="badge bg-primary-50 text-primary-600"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onView}
            className="btn btn-secondary text-sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          {!ticket.analysis && (
            <button
              onClick={onAnalyze}
              disabled={analyzing}
              className="btn btn-primary text-sm"
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-1" />
              )}
              Analyze
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
