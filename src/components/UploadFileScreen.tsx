"use client";
 
import React, { useState, useRef } from 'react';
import MainLayout from "./layout/MainLayout";
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  X,
  Check
} from 'lucide-react';
import { ExchangeRateService } from "@/service/ExchangeRateService";
// Utility function to concatenate class names
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}
 
interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  uploaded: boolean;
}
 
const EXCEL_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv' // .csv
];
 
export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };
 
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };
 
  const handleFile = (file: File) => {
    setError('');
    // Validate file type
    if (!EXCEL_MIME_TYPES.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Please upload only Excel files (.xlsx, .xls) or CSV files');
      return;
    }
 
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
 
    const newFile: UploadedFile = {
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      uploaded: false
    };
    setUploadedFile(newFile);
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFile(prev => 
        prev ? { ...prev, progress: Math.min(prev.progress + 25, 100) } : null
      );
    }, 300);
 
    setTimeout(() => {
      clearInterval(interval);
      setUploadedFile(prev => 
        prev ? { ...prev, progress: 100, uploaded: true } : null
      );
    }, 1200);
  };
 
  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
 
  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel') || type === 'text/csv') {
      return <FileText className="w-4 h-4 text-green-600" />;
    }
    return <FileText className="w-4 h-4" />;
  };
 
  const handleSubmit = async () => {
    if (!uploadedFile || !uploadedFile.uploaded) return;
    setIsSubmitting(true);
    try {
      await ExchangeRateService.insertExchangeRates(uploadedFile.file);
      setUploadedFile(null);
      setError('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError('Failed to upload file.');
    }
    setIsSubmitting(false);
  };
 
  return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-center mb-12"></div>
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Upload File</h1>
            <p className="text-xs text-amber-600 font-medium">{today}</p>
          </div>

        {/* Upload Zone */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              "cursor-pointer",
              isDragOver ? "border-yellow-400 bg-yellow-50" : "border-gray-300 hover:border-yellow-300",
              error ? "border-red-300 bg-red-50" : ""
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">Drop Excel file here or click to browse</p>
            <p className="text-xs text-gray-400">XLSX, XLS, CSV up to 10MB</p>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>

        {/* File Display */}
        {uploadedFile && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
            <h3 className="text-sm font-medium text-amber-800 mb-2">Uploaded File</h3>
            <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-gray-400">
                            {getFileIcon(uploadedFile.file.type)}
            </div>
            <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
                              {uploadedFile.file.name}
            </p>
            <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
                                {uploadedFile.file.name.split('.').pop()?.toUpperCase()} • {(uploadedFile.file.size / 1024).toFixed(1)} KB
            </span>
                              {uploadedFile.uploaded && (
            <Check className="w-3 h-3 text-yellow-600" />
                              )}
            </div>
                            {!uploadedFile.uploaded && (
            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
                                  className="bg-gradient-to-r from-yellow-400 to-amber-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadedFile.progress}%` }}
                                />
            </div>
                            )}
            </div>
            <button
                            onClick={removeFile}
                            className="text-gray-400 hover:text-red-500 transition-colors"
            >
            <X className="w-4 h-4" />
            </button>
            </div>
            </div>
        )}
 
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!uploadedFile || !uploadedFile.uploaded || isSubmitting}
          className={cn(
            "w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
            !uploadedFile || !uploadedFile.uploaded || isSubmitting
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-md"
          )}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <span className="font-medium text-base">Submit File</span>
          )}
        </button>
      </div>
    </div>
  );
}