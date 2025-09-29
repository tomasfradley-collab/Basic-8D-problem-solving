import React, { useState, useRef } from 'react';
import { FileAttachment } from '../types';
import { CheckCircleIcon, XCircleIcon, FileIcon, TrashIcon } from './icons';

interface FileUploadProps {
  label: string;
  onFileUpload: (file: FileAttachment | null) => void;
  accept?: string;
  existingFile?: FileAttachment | null;
  icon?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFileUpload, accept = "*/*", existingFile = null, icon }) => {
  const [file, setFile] = useState<FileAttachment | null>(existingFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          name: selectedFile.name,
          type: selectedFile.type,
          dataUrl: e.target?.result as string,
        };
        setFile(newFile);
        onFileUpload(newFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFile(null);
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div
        onClick={triggerFileSelect}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-colors"
      >
        <div className="space-y-1 text-center w-full">
          {file ? (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                {file.type.startsWith('image/') ? (
                    <img src={file.dataUrl} alt="preview" className="w-10 h-10 object-cover rounded mr-2" />
                ) : (
                    <FileIcon className="w-8 h-8 mr-2 text-gray-400" />
                )}
                <span className="font-medium text-brand-primary truncate max-w-xs">{file.name}</span>
              </div>
              <button onClick={handleRemoveFile} className="no-print text-red-500 hover:text-red-700">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              {icon || <FileIcon className="mx-auto h-12 w-12 text-gray-400" />}
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <p className="pl-1">Click to upload a file</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Any file type</p>
            </>
          )}
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </div>
      </div>
    </div>
  );
};