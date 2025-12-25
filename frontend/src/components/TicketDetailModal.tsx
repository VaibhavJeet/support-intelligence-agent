'use client';

import { X, User, Clock, Tag, MessageSquare } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { clsx } from 'clsx';
import type { Ticket } from '@/lib/types';

interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export function TicketDetailModal({ ticket, onClose }: TicketDetailModalProps) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {ticket.subject}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  'badge',
                  ticket.status === 'resolved' || ticket.status === 'closed'
                    ? 'badge-success'
                    : ticket.status === 'in_progress'
                    ? 'badge-warning'
                    : 'badge-primary'
                )}
              >
                {ticket.status.replace('_', ' ')}
              </span>
              <span
                className={clsx(
                  'badge',
                  ticket.priority === 'urgent'
                    ? 'badge-danger'
                    : ticket.priority === 'high'
                    ? 'badge-warning'
                    : 'badge-primary'
                )}
              >
                {ticket.priority}
              </span>
              {ticket.category && (
                <span className="badge bg-gray-100 text-gray-600">
                  {ticket.category}
                </span>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {ticket.customer_name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{ticket.customer_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                Created{' '}
                {formatDistanceToNow(new Date(ticket.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {ticket.analysis && (
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-primary-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Analysis
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-primary-700 mb-1">Sentiment</p>
                  <span
                    className={clsx(
                      'inline-block px-2 py-1 rounded text-sm font-medium',
                      getSentimentColor(ticket.analysis.sentiment)
                    )}
                  >
                    {ticket.analysis.sentiment}
                    ({Math.round(ticket.analysis.sentiment_score * 100)}%)
                  </span>
                </div>
                <div>
                  <p className="text-xs text-primary-700 mb-1">Urgency Score</p>
                  <span className="text-lg font-bold text-primary-900">
                    {Math.round(ticket.analysis.urgency_score * 100)}%
                  </span>
                </div>
              </div>

              {ticket.analysis.key_entities.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-primary-700 mb-2">Key Entities</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.analysis.key_entities.map((entity) => (
                      <span
                        key={entity}
                        className="badge bg-white text-primary-700"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {ticket.analysis.resolution_suggestion && (
                <div>
                  <p className="text-xs text-primary-700 mb-2">
                    Resolution Suggestion
                  </p>
                  <p className="text-sm text-primary-900">
                    {ticket.analysis.resolution_suggestion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
