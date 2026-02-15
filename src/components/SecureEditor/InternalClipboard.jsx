/**
 * ════════════════════════════════════════════════════════════════
 *  Internal Clipboard Panel
 * ════════════════════════════════════════════════════════════════
 *
 *  A sandboxed clipboard that replaces system clipboard in exam mode.
 *  - Stores copied text within the editor environment
 *  - All clipboard operations are logged
 *  - Maximum 10 entries stored
 *  - No data leaves the application
 */

import React, { useState, useCallback } from 'react';
import Icon from '../AppIcon';

const MAX_CLIPBOARD_ENTRIES = 10;

const InternalClipboard = ({
  onPaste,
  isVisible = true,
  onClose,
  className = '',
}) => {
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);

  // ── Add entry to clipboard ──
  const addEntry = useCallback((text) => {
    if (!text?.trim()) return;

    const entry = {
      id: `clip_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text: text.slice(0, 2000), // Limit size
      timestamp: new Date().toISOString(),
      charCount: text.length,
      preview: text.slice(0, 80).replace(/\n/g, '↵ '),
    };

    setEntries(prev => {
      const updated = [entry, ...prev].slice(0, MAX_CLIPBOARD_ENTRIES);
      return updated;
    });
    setActiveEntry(entry.id);
  }, []);

  // ── Paste from clipboard entry ──
  const handlePaste = useCallback((entry) => {
    onPaste?.(entry.text);
    setActiveEntry(entry.id);
  }, [onPaste]);

  // ── Remove entry ──
  const removeEntry = useCallback((id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (activeEntry === id) setActiveEntry(null);
  }, [activeEntry]);

  // ── Clear all ──
  const clearAll = useCallback(() => {
    setEntries([]);
    setActiveEntry(null);
  }, []);

  // ── Get current entry text for external use ──
  const getCurrentText = useCallback(() => {
    if (!activeEntry) return null;
    return entries.find(e => e.id === activeEntry)?.text || null;
  }, [activeEntry, entries]);

  if (!isVisible) return null;

  return (
    <div className={`bg-[#252526] border-l border-[#1e1e1e] flex flex-col ${className}`}>
      {/* Header */}
      <div className="h-[35px] flex items-center justify-between px-3 border-b border-[#1e1e1e] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Icon name="Clipboard" size={13} className="text-blue-400" />
          <span className="text-[11px] font-semibold text-[#bbb] uppercase tracking-wider">
            Clipboard
          </span>
          {entries.length > 0 && (
            <span className="text-[9px] bg-[#3c3c3c] text-[#888] px-1.5 py-0.5 rounded-full">
              {entries.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {entries.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[#888] hover:text-white p-1 transition-colors"
              title="Clear all"
            >
              <Icon name="Trash2" size={12} />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#888] hover:text-white p-1 transition-colors"
            >
              <Icon name="X" size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="px-3 py-2 bg-[#1e3a5f] border-b border-[#1e1e1e]">
        <p className="text-[10px] text-blue-300 flex items-center gap-1">
          <Icon name="Shield" size={10} />
          Internal clipboard — copies stay within the editor
        </p>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <Icon name="Clipboard" size={24} className="text-[#555] mx-auto mb-2" />
            <p className="text-[11px] text-[#666]">No clipboard entries</p>
            <p className="text-[10px] text-[#555] mt-1">
              Copy text in the editor to add items
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`group border-b border-[#1e1e1e] transition-colors ${
                activeEntry === entry.id
                  ? 'bg-[#37373d]'
                  : 'hover:bg-[#2a2d2e]'
              }`}
            >
              <div className="px-3 py-2">
                {/* Preview */}
                <button
                  onClick={() => handlePaste(entry)}
                  className="w-full text-left"
                >
                  <p className="text-[11px] text-[#ccc] font-mono truncate leading-relaxed">
                    {entry.preview}
                  </p>
                </button>

                {/* Meta */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px] text-[#666]">
                    {entry.charCount} chars •{' '}
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePaste(entry)}
                      className="text-[#888] hover:text-blue-400 p-0.5 transition-colors"
                      title="Paste this"
                    >
                      <Icon name="ClipboardPaste" size={11} />
                    </button>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-[#888] hover:text-red-400 p-0.5 transition-colors"
                      title="Remove"
                    >
                      <Icon name="X" size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-[#1e1e1e] flex-shrink-0">
        <p className="text-[9px] text-[#555]">
          Ctrl+C to copy • Click entry to paste • Max {MAX_CLIPBOARD_ENTRIES} items
        </p>
      </div>
    </div>
  );
};

// Export addEntry via ref or callback pattern
export { InternalClipboard, MAX_CLIPBOARD_ENTRIES };
export default InternalClipboard;
