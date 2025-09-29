
import React, { useState } from 'react';
import { Report } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MainMenu } from './components/MainMenu';
import { ReportView } from './components/ReportView';

const App: React.FC = () => {
  const [reports, setReports] = useLocalStorage<Report[]>('8d-reports', []);
  const [currentView, setCurrentView] = useState<'menu' | 'report'>('menu');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setSelectedReportId(null);
    setCurrentView('report');
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentView('report');
  };
  
  const getRevisionDate = (createdAt: string, days: number): Date => {
      const date = new Date(createdAt);
      date.setDate(date.getDate() + days);
      return date;
  };

  const handleSaveReport = (updatedReport: Report) => {
    // Calculate the next upcoming revision date
    const findNextRevision = (report: Report): string | null => {
        const potentialDates: Date[] = [];
        
        const d3 = report.disciplines.find(d => d.id === 'D3');
        if (d3 && !d3.completed) {
            potentialDates.push(getRevisionDate(report.createdAt, 1));
        }
        const d6 = report.disciplines.find(d => d.id === 'D6');
        if (d6 && !d6.completed) {
            potentialDates.push(getRevisionDate(report.createdAt, 7));
        }
        const d8 = report.disciplines.find(d => d.id === 'D8');
        if (d8 && !d8.completed) {
            potentialDates.push(getRevisionDate(report.createdAt, 30));
        }

        if (potentialDates.length === 0) return null;

        const earliestDate = new Date(Math.min(...potentialDates.map(d => d.getTime())));
        return earliestDate.toISOString();
    };
    
    updatedReport.nextRevisionDate = findNextRevision(updatedReport);

    setReports(prevReports => {
      const index = prevReports.findIndex(r => r.id === updatedReport.id);
      if (index > -1) {
        const newReports = [...prevReports];
        newReports[index] = updatedReport;
        return newReports;
      }
      return [...prevReports, updatedReport];
    });

    setCurrentView('menu');
    setSelectedReportId(null);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedReportId(null);
  };

  const selectedReport = reports.find(r => r.id === selectedReportId) || null;

  return (
    <div className="App">
      {currentView === 'menu' && (
        <MainMenu
          reports={reports}
          onCreateNew={handleCreateNew}
          onSelectReport={handleSelectReport}
        />
      )}
      {currentView === 'report' && (
        <ReportView
          reportData={selectedReport}
          onSave={handleSaveReport}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default App;
