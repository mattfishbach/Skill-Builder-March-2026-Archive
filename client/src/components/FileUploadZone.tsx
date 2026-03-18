import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Upload, FileSpreadsheet, X, CheckCircle, Loader2 } from 'lucide-react';

interface FileUploadZoneProps {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
  uploadedFileName?: string;
  uploadError?: string;
  onClear?: () => void;
  disabled?: boolean;
  compact?: boolean;
}

export function FileUploadZone({ onFileSelected, isUploading = false, uploadedFileName, uploadError, onClear, disabled = false, compact = false }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) setIsDragOver(true);
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        onFileSelected(file);
      }
    }
  }, [disabled, isUploading, onFileSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onFileSelected]);

  if (uploadedFileName) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-2xl rounded-br-sm p-4"
      >
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800 truncate">{uploadedFileName}</p>
          <p className="text-xs text-green-600">File ready for review</p>
        </div>
        {onClear && !disabled && (
          <button
            onClick={onClear}
            className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
            data-testid="button-clear-upload"
          >
            <X className="w-4 h-4 text-green-700" />
          </button>
        )}
      </motion.div>
    );
  }

  if (isUploading) {
    return (
      <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-2xl rounded-br-sm p-6 justify-center">
        <Loader2 className="w-5 h-5 text-[#0a66c2] animate-spin" />
        <span className="text-sm font-medium text-[#0a66c2]">Reading your file...</span>
      </div>
    );
  }

  if (uploadError) {
    return (
      <div className="flex flex-col items-center gap-3 bg-red-50 border-2 border-red-200 rounded-2xl rounded-br-sm p-5">
        <p className="text-sm text-red-700 font-medium">{uploadError}</p>
        <button
          onClick={() => onClear?.()}
          className="text-sm text-red-600 hover:text-red-800 underline"
          data-testid="button-retry-upload"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-2xl rounded-br-sm border-2 border-dashed transition-all duration-200 cursor-pointer ${
        isDragOver
          ? 'border-[#0a66c2] bg-blue-50 scale-[1.01]'
          : 'border-gray-300 bg-gray-50 hover:border-[#0a66c2]/50 hover:bg-blue-50/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && fileInputRef.current?.click()}
      data-testid="file-upload-zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file-upload"
      />
      <div className={`flex flex-col items-center justify-center px-4 ${compact ? 'py-4 gap-2' : 'py-8 gap-3'}`}>
        <AnimatePresence mode="wait">
          {isDragOver ? (
            <motion.div
              key="drop"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} rounded-full bg-[#0a66c2]/10 flex items-center justify-center`}
            >
              <Upload className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-[#0a66c2]`} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`${compact ? 'w-9 h-9' : 'w-12 h-12'} rounded-full bg-gray-100 flex items-center justify-center`}
            >
              <FileSpreadsheet className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-gray-400`} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isDragOver ? 'Drop your file here' : 'Drag & drop your revised Excel file here'}
          </p>
          {!compact && (
            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              or click <Paperclip className="w-3.5 h-3.5 inline text-gray-400" /> to browse
            </p>
          )}
        </div>
        <p className="text-[11px] text-gray-400">.xlsx files only</p>
      </div>
    </div>
  );
}
