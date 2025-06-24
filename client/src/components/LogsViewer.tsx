import React, { useEffect, useRef } from 'react';
import MonacoEditor, { OnMount, useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface LogsViewerProps {
  logs: string;
}

export default function LogsViewer({ logs }: LogsViewerProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });
  };

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      model?.setValue(logs);
      editorRef.current.revealLine(model?.getLineCount() || 1);
    }
  }, [logs]);

  return (
    <MonacoEditor
      height="400px"
      defaultLanguage="shell"
      value={logs}
      theme="vs-dark"
      onMount={handleEditorDidMount}
      options={{
        readOnly: true,
        fontSize: 14,
        tabSize: 2,
        minimap: { enabled: true },
        lineNumbers: 'on',
      }}
    />
  );
}
