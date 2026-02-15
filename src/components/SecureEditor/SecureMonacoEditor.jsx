/**
 * ════════════════════════════════════════════════════════════════
 *  Secure Monaco Editor
 * ════════════════════════════════════════════════════════════════
 *
 *  A security-hardened wrapper around @monaco-editor/react with:
 *    - Paste interception & logging
 *    - Copy protection in exam mode
 *    - Context menu blocking
 *    - Large insertion detection
 *    - Typing pattern recording
 *    - Internal clipboard integration
 */

import React, { useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import integrityLogger from '../../lib/integrity';

const LANG_MAP = {
  python: 'python',
  java: 'java',
  javascript: 'javascript',
  sql: 'sql',
  cpp: 'cpp',
  c: 'c',
  markdown: 'markdown',
  html: 'html',
  css: 'css',
};

const SecureMonacoEditor = ({
  value = '',
  language = 'python',
  onChange,
  onMount,
  height = '100%',
  path = '',
  examMode = false,
  readOnly = false,
  internalClipboard = null,
  onInternalCopy = null,
  onInternalPaste = null,
  pastePolicy = 'warn',     // 'allow' | 'warn' | 'block'
  onPasteDetected = null,
  fontSize = 14,
  minimap = true,
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const lastContentLength = useRef(value?.length || 0);
  const lastChangeTime = useRef(Date.now());

  // ── Editor mount ──
  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // ── Disable default context menu in exam mode ──
    if (examMode) {
      editor.updateOptions({ contextmenu: false });

      // Override paste command in exam mode with block policy
      if (pastePolicy === 'block') {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
          integrityLogger.log('paste_blocked', { source: 'keyboard_shortcut' });
        });
      }
    }

    // ── Track keystrokes for typing pattern analysis ──
    editor.onKeyDown(() => {
      integrityLogger.recordKeystroke();
    });

    // ── Intercept paste in editor ──
    editor.onDidPaste((range) => {
      const model = editor.getModel();
      if (!model) return;

      const pastedText = model.getValueInRange(range);
      const charCount = pastedText.length;
      const wordCount = pastedText.trim().split(/\s+/).filter(Boolean).length;

      if (wordCount > 10 || charCount > 100) {
        integrityLogger.logPaste({
          content: pastedText,
          charCount,
          cursorPosition: `${range.startLineNumber}:${range.startColumn}`,
          blocked: false,
        });

        onPasteDetected?.({
          charCount,
          wordCount,
          snippet: pastedText.slice(0, 80),
          position: `Line ${range.startLineNumber}`,
        });
      }
    });

    onMount?.(editor, monaco);
  }, [examMode, pastePolicy, onMount, onPasteDetected]);

  // ── Handle editor change ──
  const handleChange = useCallback((newValue) => {
    const now = Date.now();
    const timeDelta = now - lastChangeTime.current;
    const charDelta = (newValue?.length || 0) - lastContentLength.current;

    // Detect large insertions (possible paste via non-standard means)
    if (charDelta > 50 && timeDelta < 200) {
      integrityLogger.logLargeInsertion({
        charCount: charDelta,
        cursorPosition: null,
        timeDeltaMs: timeDelta,
      });
    }

    lastContentLength.current = newValue?.length || 0;
    lastChangeTime.current = now;

    onChange?.(newValue);
  }, [onChange]);

  // ── Block copy in strict exam mode ──
  useEffect(() => {
    if (!examMode || pastePolicy !== 'block') return;

    const blockCopy = (e) => {
      if (editorRef.current?.hasTextFocus()) {
        e.preventDefault();
        integrityLogger.log('clipboard_copy_blocked', { source: 'system_clipboard' });
      }
    };

    document.addEventListener('copy', blockCopy, true);
    document.addEventListener('cut', blockCopy, true);

    return () => {
      document.removeEventListener('copy', blockCopy, true);
      document.removeEventListener('cut', blockCopy, true);
    };
  }, [examMode, pastePolicy]);

  // ── Internal clipboard integration ──
  useEffect(() => {
    if (!examMode || !editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    // Override Ctrl+C to use internal clipboard
    const copyDisposable = editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC,
      () => {
        const selection = editor.getSelection();
        const model = editor.getModel();
        if (selection && model) {
          const text = model.getValueInRange(selection);
          if (text) {
            onInternalCopy?.(text);
            integrityLogger.log('internal_clipboard_copy', {
              char_count: text.length,
            });
          }
        }
      }
    );

    // Override Ctrl+V to use internal clipboard
    const pasteDisposable = editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
      () => {
        if (internalClipboard) {
          const selection = editor.getSelection();
          if (selection) {
            editor.executeEdits('internal-paste', [{
              range: selection,
              text: internalClipboard,
            }]);
            onInternalPaste?.(internalClipboard);
            integrityLogger.log('internal_clipboard_paste', {
              char_count: internalClipboard.length,
            });
          }
        }
      }
    );

    return () => {
      // Monaco disposables are cleaned up automatically
    };
  }, [examMode, internalClipboard, onInternalCopy, onInternalPaste]);

  return (
    <Editor
      height={height}
      language={LANG_MAP[language] || 'python'}
      value={value}
      onChange={handleChange}
      onMount={handleEditorMount}
      theme="vs-dark"
      path={path}
      options={{
        fontSize,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        minimap: { enabled: minimap, maxColumn: 80, scale: 1 },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 4,
        automaticLayout: true,
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        bracketPairColorization: { enabled: true },
        guides: { indentation: true, bracketPairs: true },
        readOnly,
        contextmenu: !examMode,
        // Disable paste suggestions in exam mode
        suggest: examMode ? { showSnippets: false } : undefined,
      }}
    />
  );
};

export default SecureMonacoEditor;
