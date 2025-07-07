// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useState, useRef, useEffect } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { containerLogs } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerLogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [logs, setLogs] = useState<string | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });
  };

  const fetchLogs = async () => {
    try {
      const res = await containerLogs(
        localStorage.getItem('token') as string,
        id as string
      );
      setLogs(res.data);
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchLogs, {
    retry: false,
  });

  useEffect(() => {
    if (editorRef.current && logs) {
      const model = editorRef.current.getModel();
      model?.setValue(logs);
      editorRef.current.revealLine(model?.getLineCount() || 1);
    }
  }, [logs]);

  if (id === undefined) {
    return <></>;
  }

  return (
    <div className="con-stats-det">
      <div className="stats">
        <div className="title">Logs</div>
        <div className="stats-container">
          {logs ? (
            <MonacoEditor
              height="400px"
              defaultLanguage="shell"
              value={logs || ''}
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
          ) : (
            <div className="loading">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContainerLogs;
