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

import { useState } from 'react';
import './index.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createVolume } from '../../api/volume';

const VolumeCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [labels, setLabels] = useState<Record<string, string>>({});

  const create = async () => {
    try {
      const res = await createVolume(
        localStorage.getItem('token') as string,
        name,
        labels
      );
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(create(), {
      loading: 'Creating container...',
      success: data => {
        navigate(`/volume/${data.Name}`);
        return `Volume created successfully!`;
      },
      error: data => `Error creating volume: ${data.error}`,
    });
  };

  const handleLabelAdd = () => {
    const newKey = `label-${Date.now()}`;
    setLabels(prev => ({ ...prev, [newKey]: '' }));
  };

  const handleLabelKeyChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return; // Prevent unnecessary updates

    setLabels(prev => {
      const newLabels = { ...prev };
      const value = newLabels[oldKey];
      delete newLabels[oldKey];
      newLabels[newKey] = value;
      return newLabels;
    });
  };

  const handleLabelValueChange = (key: string, value: string) => {
    setLabels(prev => ({ ...prev, [key]: value }));
  };

  const handleLabelDelete = (keyToDelete: string) => {
    setLabels(prev => {
      const newLabels = { ...prev };
      delete newLabels[keyToDelete];
      return newLabels;
    });
  };

  return (
    <>
      <div className="volume-create-container">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
        <div className="volume-create-wrapper">
          <form className="volume-create-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Create Volume</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="volume-name">
                Volume Name*
              </label>
              <input
                id="volume-name"
                className="form-input"
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter volume name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Labels</label>
              <div className="labels-container">
                {Object.keys(labels).length === 0 ? (
                  <p className="labels-empty">No labels added yet</p>
                ) : (
                  Object.entries(labels).map(([key, value], index) => (
                    <div className="label-row" key={index}>
                      <input
                        className="label-input label-key"
                        type="text"
                        placeholder="Key"
                        value={key}
                        onChange={e =>
                          handleLabelKeyChange(key, e.target.value)
                        }
                      />
                      <input
                        className="label-input label-value"
                        type="text"
                        placeholder="Value"
                        value={value}
                        onChange={e =>
                          handleLabelValueChange(key, e.target.value)
                        }
                      />
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => handleLabelDelete(key)}
                        aria-label={`Delete label ${key}`}
                      >
                        <span className="delete-icon">🗑️</span>
                        Delete
                      </button>
                    </div>
                  ))
                )}

                <button
                  className="add-label-button"
                  type="button"
                  onClick={handleLabelAdd}
                >
                  <span className="add-icon">+</span>
                  Add Label
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button className="submit-button" type="submit">
                {
                  <>
                    <span className="submit-icon">📁</span>
                    Create Volume
                  </>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VolumeCreate;
