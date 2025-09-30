import React, { useState, useEffect, useRef } from 'react';
import { Report, Discipline, FileAttachment } from '../types';
import { DisciplineCard } from './DisciplineCard';
import { FileUpload } from './FileUpload';
import { INITIAL_DISCIPLINES } from '../constants';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, FileIcon, TrashIcon, PrinterIcon } from './icons';

interface ReportViewProps {
  reportData: Report | null;
  onSave: (report: Report) => void;
  onBack: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ reportData, onSave, onBack }) => {
  const [report, setReport] = useState<Report>(() => {
    if (reportData) return reportData;
    return {
      id: crypto.randomUUID(),
      title: '',
      createdAt: new Date().toISOString(),
      disciplines: JSON.parse(JSON.stringify(INITIAL_DISCIPLINES)), // Deep copy
      okSample: undefined,
      nokSample: undefined,
      evidences: [],
      nextRevisionDate: null,
    };
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    // On initial mount, don't save. On subsequent changes, auto-save.
    if (isMounted.current) {
      setIsSaving(true);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        onSave(report);
        setIsSaving(false);
      }, 1000); // Debounce with 1s delay
    } else {
      isMounted.current = true;
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [report, onSave]);


  const handleDisciplineUpdate = (index: number, field: keyof Discipline, value: string | boolean) => {
    const newDisciplines = [...report.disciplines];
    (newDisciplines[index] as any)[field] = value;
    setReport({ ...report, disciplines: newDisciplines });
  };

  const handleFileUpload = (file: FileAttachment, index: number) => {
      const newEvidences = [...report.evidences];
      newEvidences[index] = file;
      setReport({ ...report, evidences: newEvidences});
  }

  const handleAddEvidence = () => {
      setReport({ ...report, evidences: [...report.evidences, {name: '', type: '', dataUrl: ''}]});
  }
  
  const handleRemoveEvidence = (index: number) => {
      const newEvidences = report.evidences.filter((_, i) => i !== index);
      setReport({ ...report, evidences: newEvidences });
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center flex-grow">
            <button onClick={onBack} className="no-print p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-4">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </button>
            <input
              type="text"
              value={report.title}
              onChange={(e) => setReport({ ...report, title: e.target.value })}
              placeholder="Enter Report Title"
              className="text-3xl font-bold bg-transparent text-brand-dark dark:text-white w-full focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-brand-primary"
            />
          </div>
           <div className="no-print flex items-center">
            <span className={`text-sm text-gray-500 dark:text-gray-400 mr-4 transition-opacity duration-300 ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
                Saving...
            </span>
            <button
                onClick={handlePrint}
                className="flex items-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
            >
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print
            </button>
           </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 print-container print-break-avoid">
          <h3 className="text-xl font-bold text-brand-primary dark:text-sky-400 mb-4">Problem Samples (D2)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload 
              label="OK Sample" 
              onFileUpload={(file) => setReport({...report, okSample: file || undefined})}
              accept="image/*"
              existingFile={report.okSample}
              icon={<CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />}
            />
            <FileUpload 
              label="NOK Sample" 
              onFileUpload={(file) => setReport({...report, nokSample: file || undefined})}
              accept="image/*"
              existingFile={report.nokSample}
              icon={<XCircleIcon className="mx-auto h-12 w-12 text-red-400" />}
            />
          </div>
        </div>

        {report.disciplines.map((d, index) => (
          <DisciplineCard
            key={d.id}
            discipline={d}
            reportTitle={report.title}
            reportCreatedAt={report.createdAt}
            onUpdate={(field, value) => handleDisciplineUpdate(index, field, value)}
          />
        ))}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 print-container print-break-avoid">
            <h3 className="text-xl font-bold text-brand-primary dark:text-sky-400 mb-4">Evidence Files</h3>
            <div className="space-y-4">
                {report.evidences.map((evidence, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="flex-grow">
                             <FileUpload 
                                label={`Evidence ${index + 1}`}
                                onFileUpload={(file) => file && handleFileUpload(file, index)}
                                existingFile={evidence.name ? evidence : null}
                                icon={<FileIcon className="mx-auto h-12 w-12 text-gray-400" />}
                            />
                        </div>
                        <button 
                            onClick={() => handleRemoveEvidence(index)} 
                            className="no-print mt-7 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 self-start"
                            aria-label={`Remove Evidence ${index + 1}`}
                        >
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleAddEvidence} className="no-print mt-4 text-brand-primary dark:text-sky-400 font-semibold hover:underline">
                + Add Evidence
            </button>
        </div>
      </div>
    </div>
  );
};
