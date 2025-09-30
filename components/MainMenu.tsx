import React from 'react';
import { Report } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface MainMenuProps {
  reports: Report[];
  onSelectReport: (reportId: string) => void;
  onCreateNew: () => void;
  onDeleteReport: (reportId: string) => void;
}

const ReportCard: React.FC<{ report: Report; onSelect: () => void; onDelete: () => void; }> = ({ report, onSelect, onDelete }) => {
    const nextRevisionDate = report.nextRevisionDate ? new Date(report.nextRevisionDate) : null;
    const isOverdue = nextRevisionDate && nextRevisionDate < new Date();
    
    const formatDate = (date: Date | null) => {
        if (!date) return 'Completed';
        return date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const completedDisciplines = report.disciplines.filter(d => d.completed).length;
    const totalDisciplines = report.disciplines.length;
    const progress = totalDisciplines > 0 ? (completedDisciplines / totalDisciplines) * 100 : 0;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the report "${report.title || 'Untitled Report'}"?`)) {
            onDelete();
        }
    }

    return (
        <div 
            onClick={onSelect}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg hover:ring-2 hover:ring-brand-primary dark:hover:ring-sky-500 transition-all duration-200 flex flex-col justify-between"
        >
            <div className="relative">
                 <button onClick={handleDelete} className="no-print absolute -top-1 -right-1 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Delete report">
                    <TrashIcon className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-brand-secondary dark:text-gray-100 truncate pr-6">{report.title || 'Untitled Report'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created: {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{completedDisciplines} / {totalDisciplines}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-brand-primary'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Next Revision:</p>
                    <p className={`text-sm font-semibold ${isOverdue ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-gray-100'}`}>
                        {formatDate(nextRevisionDate)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const MainMenu: React.FC<MainMenuProps> = ({ reports, onSelectReport, onCreateNew, onDeleteReport }) => {
    
    const sortedReports = [...reports].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    return (
        <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-brand-dark dark:text-white">8D Problem Solving Reports</h1>
                    <button
                        onClick={onCreateNew}
                        className="flex items-center bg-brand-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                        aria-label="Create new report"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create New
                    </button>
                </div>

                {reports.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">No reports yet.</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Click "Create New" to start your first 8D report.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedReports.map(report => (
                            <ReportCard 
                                key={report.id} 
                                report={report} 
                                onSelect={() => onSelectReport(report.id)} 
                                onDelete={() => onDeleteReport(report.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
