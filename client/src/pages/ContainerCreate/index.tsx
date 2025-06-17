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
import { ContainerCreateRequest } from '../../models/container';
import { containerCreate } from '../../api/container';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ContainerCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ContainerCreateRequest>({
    name: '',
    image: '',
    restartPolicy: { name: 'no', maximumRetryCount: 0 },
    autoRemove: false,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (
    field: keyof ContainerCreateRequest,
    index: number,
    value: string
  ) => {
    const updated = [...(form[field] as string[])];
    updated[index] = value;
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleArrayAdd = (field: keyof ContainerCreateRequest) => {
    const updated = [...(form[field] as string[]), ''];
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleArrayRemove = (
    field: keyof ContainerCreateRequest,
    index: number
  ) => {
    const updated = [...(form[field] as string[])];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleRecordChange = (
    field: 'portBindings' | 'volumes',
    key: string,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [key]: value,
      },
    }));
  };

  const handleRecordKeyChange = (
    field: 'portBindings' | 'volumes',
    oldKey: string,
    newKey: string
  ) => {
    const record = { ...(form[field] || {}) };
    if (oldKey in record) {
      record[newKey] = record[oldKey];
      delete record[oldKey];
    }
    setForm(prev => ({
      ...prev,
      [field]: record,
    }));
  };

  const handleRestartPolicyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => {
      const currentPolicy = prev.restartPolicy ?? {
        name: 'no',
        maximumRetryCount: 0,
      };
      return {
        ...prev,
        restartPolicy: {
          ...currentPolicy,
          [name]: name === 'maximumRetryCount' ? Number(value) : value,
        },
      };
    });
  };

  const create = async () => {
    try {
      const res = await containerCreate(
        localStorage.getItem('token') as string,
        form
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
        setForm({
          name: '',
          image: '',
          restartPolicy: { name: 'no', maximumRetryCount: 0 },
          autoRemove: false,
        });

        navigate('/container/' + data.Id);
        // Optionally, you can also redirect to the container details page
        return `Container created successfully!`;
      },
      error: data => `Error creating container: ${data.error}`,
    });
  };

  return (
    <>
      <div className="container-create">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

        <div className="">
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-4 max-w-2xl mx-auto"
            >
              <h2 className="text-xl font-bold">Container Create Request</h2>

              <label>Name*</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Image*</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                required
              />

              <label>User</label>
              <input
                type="text"
                name="user"
                value={form.user || ''}
                onChange={handleChange}
              />

              <label>Domain Name</label>
              <input
                type="text"
                name="domainName"
                value={form.domainName || ''}
                onChange={handleChange}
              />

              <label>Working Directory</label>
              <input
                type="text"
                name="workingDir"
                value={form.workingDir || ''}
                onChange={handleChange}
              />

              <label>Network Mode</label>
              <input
                type="text"
                name="networkMode"
                value={form.networkMode || ''}
                onChange={handleChange}
              />

              <label>Auto Remove</label>
              <input
                type="checkbox"
                name="autoRemove"
                checked={form.autoRemove || false}
                onChange={handleChange}
              />

              {/* Array fields */}
              {['env', 'cmd', 'entryPoint', 'bind', 'exposedPorts'].map(
                field => {
                  const values = form[field as keyof ContainerCreateRequest] as
                    | string[]
                    | null;

                  return (
                    <div key={field}>
                      <label>{field}</label>
                      {(values || []).map((val, idx) => (
                        <div key={idx}>
                          <input
                            type="text"
                            value={val}
                            onChange={e =>
                              handleArrayChange(
                                field as keyof ContainerCreateRequest,
                                idx,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleArrayRemove(
                                field as keyof ContainerCreateRequest,
                                idx
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          handleArrayAdd(field as keyof ContainerCreateRequest)
                        }
                      >
                        Add {field}
                      </button>
                    </div>
                  );
                }
              )}

              {/* Records */}
              {(['portBindings', 'volumes'] as const).map(field => {
                const records = form[field] ?? {}; // fallback to empty object

                return (
                  <div key={field}>
                    <label>{field}</label>
                    {Object.entries(records).map(([k, v]) => (
                      <div key={k}>
                        <input
                          type="text"
                          value={k}
                          onChange={e =>
                            handleRecordKeyChange(field, k, e.target.value)
                          }
                        />
                        <input
                          type="text"
                          value={v as string}
                          onChange={e =>
                            handleRecordChange(field, k, e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleRecordChange(field, '', '')}
                    >
                      Add {field}
                    </button>
                  </div>
                );
              })}

              {/* Restart Policy */}
              <div>
                <label>Restart Policy</label>
                <select
                  name="name"
                  value={form.restartPolicy?.name || 'no'}
                  onChange={handleRestartPolicyChange}
                >
                  <option value="no">no</option>
                  <option value="always">always</option>
                  <option value="on-failure">on-failure</option>
                  <option value="unless-stopped">unless-stopped</option>
                </select>

                {form.restartPolicy?.name === 'on-failure' && (
                  <>
                    <label>Max Retry Count</label>
                    <input
                      type="number"
                      name="maximumRetryCount"
                      value={form.restartPolicy.maximumRetryCount}
                      onChange={handleRestartPolicyChange}
                    />
                  </>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerCreate;
