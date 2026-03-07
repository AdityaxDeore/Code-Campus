/**
 * ════════════════════════════════════════════════════════════════
 *  Document Upload & Preview Component
 * ════════════════════════════════════════════════════════════════
 *
 *  Secure file upload with:
 *    - Drag & drop support
 *    - File type validation
 *    - Size limit enforcement
 *    - In-app preview (PDF, images, text)
 *    - Version history tracking
 *    - Split view alongside code editor
 */

import React, { useState, useCallback, useRef } from 'react';
import Icon from './AppIcon';

const MIME_MAP = {
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc': 'application/msword',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.zip': 'application/zip',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const FILE_ICONS = {
  'application/pdf': 'FileText',
  'text/plain': 'FileText',
  'text/csv': 'Table',
  'image/png': 'Image',
  'image/jpeg': 'Image',
  'image/gif': 'Image',
  'image/svg+xml': 'Image',
  'application/zip': 'Archive',
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DocumentUpload = ({
  allowedTypes = ['.pdf', '.docx', '.txt', '.png', '.jpg', '.csv', '.zip'],
  maxSizeMB = 10,
  maxFiles = 5,
  onFilesChange,
  showPreview = true,
  darkMode = false,
  className = '',
}) => {
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const bgColor = darkMode ? 'bg-[#252526]' : 'bg-white';
  const borderColor = darkMode ? 'border-[#3c3c3c]' : 'border-gray-200';
  const textColor = darkMode ? 'text-[#ccc]' : 'text-gray-700';
  const mutedColor = darkMode ? 'text-[#888]' : 'text-gray-500';

  // ── Validate file ──
  const validateFile = useCallback((file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(ext)) {
      return `File type "${ext}" is not allowed. Accepted: ${allowedTypes.join(', ')}`;
    }

    if (file.size > maxSizeBytes) {
      return `File size (${formatFileSize(file.size)}) exceeds ${maxSizeMB} MB limit.`;
    }

    return null;
  }, [allowedTypes, maxSizeBytes, maxSizeMB]);

  // ── Add files ──
  const addFiles = useCallback((newFiles) => {
    setUploadError(null);

    const fileArray = Array.from(newFiles);

    if (files.length + fileArray.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed.`);
      return;
    }

    const validFiles = [];
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
      validFiles.push({
        id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: '.' + file.name.split('.').pop().toLowerCase(),
        uploadedAt: new Date().toISOString(),
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        version: 1,
      });
    }

    setFiles(prev => {
      const updated = [...prev, ...validFiles];
      onFilesChange?.(updated);
      return updated;
    });
  }, [files.length, maxFiles, validateFile, onFilesChange]);

  // ── Remove file ──
  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl);
      const updated = prev.filter(f => f.id !== fileId);
      onFilesChange?.(updated);
      return updated;
    });
    if (previewFile?.id === fileId) {
      setPreviewFile(null);
      setPreviewContent(null);
    }
  }, [previewFile, onFilesChange]);

  // ── Preview file ──
  const openPreview = useCallback(async (fileEntry) => {
    setPreviewFile(fileEntry);

    if (fileEntry.file.type.startsWith('image/')) {
      setPreviewContent({ type: 'image', url: fileEntry.previewUrl || URL.createObjectURL(fileEntry.file) });
    } else if (fileEntry.file.type === 'text/plain' || fileEntry.file.type === 'text/csv') {
      try {
        const text = await fileEntry.file.text();
        setPreviewContent({ type: 'text', content: text });
      } catch {
        setPreviewContent({ type: 'error', content: 'Cannot read file contents.' });
      }
    } else if (fileEntry.file.type === 'application/pdf') {
      const url = URL.createObjectURL(fileEntry.file);
      setPreviewContent({ type: 'pdf', url });
    } else {
      setPreviewContent({ type: 'unsupported', content: `Preview not available for ${fileEntry.extension} files.` });
    }
  }, []);

  // ── Drag handlers ──
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* ── Upload Zone ── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : `${borderColor} hover:border-blue-400 ${bgColor}`
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={allowedTypes.map(t => MIME_MAP[t] || t).join(',')}
          onChange={e => e.target.files.length && addFiles(e.target.files)}
          className="hidden"
        />
        <Icon name="Upload" size={28} className={isDragOver ? 'text-blue-500 mx-auto mb-2' : `${mutedColor} mx-auto mb-2`} />
        <p className={`text-sm ${isDragOver ? 'text-blue-600' : mutedColor}`}>
          {isDragOver ? 'Drop files here' : 'Click or drag files to upload'}
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-[#666]' : 'text-gray-400'}`}>
          {allowedTypes.join(', ')} • Max {maxSizeMB} MB each • Up to {maxFiles} files
        </p>
      </div>

      {/* ── Error ── */}
      {uploadError && (
        <div className="mt-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <Icon name="AlertTriangle" size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>
          <button onClick={() => setUploadError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <Icon name="X" size={12} />
          </button>
        </div>
      )}

      {/* ── File List ── */}
      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className={`text-xs font-medium ${mutedColor} uppercase tracking-wider`}>
            Uploaded ({files.length}/{maxFiles})
          </p>
          {files.map(f => (
            <div
              key={f.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors group ${
                previewFile?.id === f.id
                  ? darkMode ? 'bg-[#37373d] border-blue-500' : 'bg-blue-50 border-blue-300'
                  : `${bgColor} ${borderColor} hover:border-blue-300`
              }`}
            >
              {/* Icon or Thumbnail */}
              {f.previewUrl ? (
                <img src={f.previewUrl} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
              ) : (
                <Icon
                  name={FILE_ICONS[f.type] || 'File'}
                  size={20}
                  className={`flex-shrink-0 ${darkMode ? 'text-[#888]' : 'text-gray-400'}`}
                />
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${textColor}`}>{f.name}</p>
                <p className={`text-xs ${mutedColor}`}>
                  {formatFileSize(f.size)} • v{f.version}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {showPreview && (
                  <button
                    onClick={(e) => { e.stopPropagation(); openPreview(f); }}
                    className={`p-1 rounded ${darkMode ? 'hover:bg-[#3c3c3c] text-[#888] hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'} transition-colors`}
                    title="Preview"
                  >
                    <Icon name="Eye" size={14} />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                  className={`p-1 rounded ${darkMode ? 'hover:bg-[#3c3c3c] text-[#888] hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'} transition-colors`}
                  title="Remove"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Preview Panel ── */}
      {showPreview && previewFile && previewContent && (
        <div className={`mt-3 border rounded-lg overflow-hidden ${borderColor}`}>
          {/* Preview Header */}
          <div className={`px-3 py-2 flex items-center justify-between ${darkMode ? 'bg-[#2d2d2d]' : 'bg-gray-50'} border-b ${borderColor}`}>
            <div className="flex items-center gap-2">
              <Icon name="Eye" size={14} className={mutedColor} />
              <span className={`text-xs font-medium ${textColor}`}>{previewFile.name}</span>
            </div>
            <button
              onClick={() => { setPreviewFile(null); setPreviewContent(null); }}
              className={`${mutedColor} hover:${textColor} transition-colors`}
            >
              <Icon name="X" size={14} />
            </button>
          </div>

          {/* Preview Content */}
          <div className={`${bgColor}`} style={{ maxHeight: 400 }}>
            {previewContent.type === 'image' && (
              <div className="p-4 flex items-center justify-center">
                <img src={previewContent.url} alt={previewFile.name} className="max-h-[350px] max-w-full object-contain rounded" />
              </div>
            )}
            {previewContent.type === 'text' && (
              <pre className={`p-4 text-xs font-mono overflow-auto ${textColor}`} style={{ maxHeight: 350 }}>
                {previewContent.content}
              </pre>
            )}
            {previewContent.type === 'pdf' && (
              <iframe
                src={previewContent.url}
                title={previewFile.name}
                className="w-full border-0"
                style={{ height: 400 }}
              />
            )}
            {previewContent.type === 'unsupported' && (
              <div className="p-8 text-center">
                <Icon name="FileQuestion" size={32} className={`mx-auto mb-2 ${mutedColor}`} />
                <p className={`text-sm ${mutedColor}`}>{previewContent.content}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-[#666]' : 'text-gray-400'}`}>Download the file to view it</p>
              </div>
            )}
            {previewContent.type === 'error' && (
              <div className="p-8 text-center">
                <Icon name="AlertTriangle" size={24} className="text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-500">{previewContent.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
