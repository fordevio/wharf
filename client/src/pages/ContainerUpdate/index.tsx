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

import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { useState } from 'react';
import { DockerContainer } from '../../models/container';
import { getContainer } from '../../api/container';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

const ContainerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [container, setContainer] = useState<DockerContainer | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [labelKey, setLabelKey] = useState<string>('');
  const [labelValue, setLabelValue] = useState<string>('');

  const addLabel = () => {
    if (!labelKey.trim()) {
      toast.error('Label key is required');
      return;
    }

    if (!labelValue.trim()) {
      toast.error('Label value is required');
      return;
    }

    if (labels.hasOwnProperty(labelKey)) {
      toast.error('Label key already exists');
      return;
    }

    setLabels(prev => ({
      ...prev,
      [labelKey.trim()]: labelValue.trim(),
    }));

    setLabelKey('');
    setLabelValue('');
  };

  const removeLabel = (keyToRemove: string) => {
    setLabels(prev => {
      const { [keyToRemove]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addLabel();
    }
  };

  const fetchContainer = async () => {
    if (id === undefined || id === null) {
      return;
    }
    try {
      const res = await getContainer(
        localStorage.getItem('token') as string,
        id as string
      );
      setContainer(res.data);
      setLabels(Object.fromEntries(res.data.Labels.entries()));
      setName(res.data.Names[0]);
    } catch (e) {
      console.log(e);
      return navigate('/containers');
    }
  };

  useQuery('container' + id, fetchContainer, {
    retry: false,
  });

  if (id === undefined || id === null) {
    return <></>;
  }

  return (
    <>
      <div className="container-update">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
        <div>
          <div>
            <input
              type="text"
              placeholder="Container Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <h3>Labels</h3>

            <div>
              <input
                type="text"
                value={labelKey}
                onChange={e => setLabelKey(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Label key (environment)"
              />
              <input
                type="text"
                value={labelValue}
                onChange={e => setLabelValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Label value (production)"
              />
              <button type="button" onClick={addLabel}>
                Add
              </button>
            </div>

            <div>
              {Object.entries(labels).map(([key, value]) => (
                <div key={key}>
                  <span>
                    {key}: {value}
                  </span>
                  <button type="button" onClick={() => removeLabel(key)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="button">Submit</button>
        </div>
      </div>
    </>
  );
};

export default ContainerUpdate;
