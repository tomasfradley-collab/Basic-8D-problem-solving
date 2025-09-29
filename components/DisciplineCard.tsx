import React from 'react';
import { Discipline } from '../types';

interface DisciplineCardProps {
  discipline: Discipline;
  reportCreatedAt: string;
  onUpdate: (field: keyof Discipline, value: string | boolean) => void;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({ discipline, reportCreatedAt, onUpdate }) => {
  const getRevisionDate = (days: number): Date | null => {
    if (!reportCreatedAt) return null;
    const date = new Date(reportCreatedAt);
    date.setDate(date.getDate() + days);
    return date;
  };

  let revisionDate: Date | null = null;
  if (discipline.id === 'D3') revisionDate = getRevisionDate(1);
  if (discipline.id === 'D6') revisionDate = getRevisionDate(7);
  if (discipline.id === 'D8') revisionDate = getRevisionDate(30);

  const isPastDue = revisionDate && new Date(revisionDate) < new Date() && !discipline.completed;
  
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 transition-all duration-300 print-container print-break-avoid ${discipline.completed ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-brand-primary dark:text-sky-400">{discipline.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{discipline.description}</p>
          {revisionDate && (
            <p className={`text-sm mt-2 font-semibold ${isPastDue ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
              Revision Due: {formatDate(revisionDate)}
            </p>
          )}
        </div>
        <div className="flex items-center ml-4">
          <div className="no-print">
            <label htmlFor={`completed-${discipline.id}`} className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">Done</label>
            <input
              id={`completed-${discipline.id}`}
              type="checkbox"
              checked={discipline.completed}
              onChange={(e) => onUpdate('completed', e.target.checked)}
              className="w-5 h-5 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-brand-primary dark:focus:ring-brand-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <p className="only-print text-sm font-semibold">
              Status: {discipline.completed ? 'Completed' : 'In Progress'}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <textarea
          value={discipline.content}
          onChange={(e) => onUpdate('content', e.target.value)}
          placeholder="Enter details here..."
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          disabled={discipline.completed}
        />
      </div>
    </div>
  );
};