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
import {
  ContainerCreateRequest,
  RestartPolicyMode,
} from '../../models/container';
import { containerCreate, startContainer } from '../../api/container';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ContainerCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ContainerCreateRequest>({
    name: '',
    image: '',
    env: [],
    exposedPorts: [],
    cmd: [],
    entryPoint: [],
    bind: [],
    portBindings: {},
    restartPolicy: {
      name: 'no',
      maximumRetryCount: 0,
    },
  });

  const [envInput, setEnvInput] = useState('');
  const [portInput, setPortInput] = useState('');
  const [bindInput, setBindInput] = useState('');
  const [cmdInput, setCmdInput] = useState('');
  const [entryPointInput, setEntryPointInput] = useState('');
  const [portBindingKey, setPortBindingKey] = useState('');
  const [portBindingValue, setPortBindingValue] = useState('');

  const handleInputChange = (
    field: keyof ContainerCreateRequest,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addArrayItem = (
    field: 'env' | 'exposedPorts' | 'cmd' | 'entryPoint' | 'bind',
    value: string
  ) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
    }
  };

  const removeArrayItem = (
    field: 'env' | 'exposedPorts' | 'cmd' | 'entryPoint' | 'bind',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || [],
    }));
  };

  const addPortBinding = () => {
    if (portBindingKey.trim() && portBindingValue.trim()) {
      setFormData(prev => ({
        ...prev,
        portBindings: {
          ...prev.portBindings,
          [portBindingKey.trim()]: portBindingValue.trim(),
        },
      }));
      setPortBindingKey('');
      setPortBindingValue('');
    }
  };

  const removePortBinding = (key: string) => {
    setFormData(prev => {
      const newBindings = { ...prev.portBindings };
      delete newBindings[key];
      return {
        ...prev,
        portBindings: newBindings,
      };
    });
  };

  const create = async () => {
    try {
      const res = await containerCreate(
        localStorage.getItem('token') as string,
        formData
      );

      await startContainer(
        localStorage.getItem('token') as string,
        res.data.Id
      );
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const handleSubmit = async () => {
    toast.promise(create(), {
      loading: 'Creating container...',
      success: data => {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Docker Container
                </h1>
                <p className="text-blue-100">
                  Configure your container settings
                </p>
              </div>

              <div className="p-8 space-y-8">
                {/* Basic Information */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Container Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.name}
                        onChange={e =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder="my-container"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Docker Image *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.image}
                        onChange={e =>
                          handleInputChange('image', e.target.value)
                        }
                        placeholder="nginx:latest"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        User
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.user || ''}
                        onChange={e =>
                          handleInputChange('user', e.target.value)
                        }
                        placeholder="root"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Domain Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.domainName || ''}
                        onChange={e =>
                          handleInputChange('domainName', e.target.value)
                        }
                        placeholder="example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Working Directory
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.workingDir || ''}
                        onChange={e =>
                          handleInputChange('workingDir', e.target.value)
                        }
                        placeholder="/app"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Network Mode
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={formData.networkMode || ''}
                        onChange={e =>
                          handleInputChange('networkMode', e.target.value)
                        }
                      >
                        <option value="">Select network mode</option>
                        <option value="bridge">Bridge</option>
                        <option value="host">Host</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Environment Variables */}
                <div className="bg-sky-50 rounded-xl p-6 border border-sky-200">
                  <h2 className="text-xl font-semibold text-sky-800 mb-4">
                    Environment Variables
                  </h2>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      value={envInput}
                      onChange={e => setEnvInput(e.target.value)}
                      placeholder="KEY=value"
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('env', envInput);
                          setEnvInput('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addArrayItem('env', envInput);
                        setEnvInput('');
                      }}
                      className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.env?.map((env, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-sky-200"
                      >
                        <code className="text-sky-700">{env}</code>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('env', index)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Port Configuration */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Port Configuration
                  </h2>

                  {/* Exposed Ports */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-blue-700 mb-3">
                      Exposed Ports
                    </h3>
                    <div className="flex gap-3 mb-4">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={portInput}
                        onChange={e => setPortInput(e.target.value)}
                        placeholder="8080/tcp"
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('exposedPorts', portInput);
                            setPortInput('');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addArrayItem('exposedPorts', portInput);
                          setPortInput('');
                        }}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.exposedPorts?.map((port, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200"
                        >
                          <code className="text-blue-700">{port}</code>
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem('exposedPorts', index)
                            }
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Port Bindings */}
                  <div>
                    <h3 className="text-lg font-medium text-blue-700 mb-3">
                      Port Bindings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <input
                        type="text"
                        className="px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={portBindingKey}
                        onChange={e => setPortBindingKey(e.target.value)}
                        placeholder="Container port (8080/tcp)"
                      />
                      <input
                        type="text"
                        className="px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={portBindingValue}
                        onChange={e => setPortBindingValue(e.target.value)}
                        placeholder="Host port (80)"
                      />
                      <button
                        type="button"
                        onClick={addPortBinding}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      >
                        Bind
                      </button>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(formData.portBindings || {}).map(
                        ([containerPort, hostPort]) => (
                          <div
                            key={containerPort}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200"
                          >
                            <code className="text-blue-700">
                              {containerPort} → {hostPort}
                            </code>
                            <button
                              type="button"
                              onClick={() => removePortBinding(containerPort)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Commands and Entry Points */}
                <div className="bg-sky-50 rounded-xl p-6 border border-sky-200">
                  <h2 className="text-xl font-semibold text-sky-800 mb-4">
                    Commands & Entry Points
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Command */}
                    <div>
                      <h3 className="text-lg font-medium text-sky-700 mb-3">
                        Command
                      </h3>
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          value={cmdInput}
                          onChange={e => setCmdInput(e.target.value)}
                          placeholder="ls -la"
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem('cmd', cmdInput);
                              setCmdInput('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            addArrayItem('cmd', cmdInput);
                            setCmdInput('');
                          }}
                          className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.cmd?.map((cmd, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-sky-200"
                          >
                            <code className="text-sky-700">{cmd}</code>
                            <button
                              type="button"
                              onClick={() => removeArrayItem('cmd', index)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Entry Point */}
                    <div>
                      <h3 className="text-lg font-medium text-sky-700 mb-3">
                        Entry Point
                      </h3>
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          value={entryPointInput}
                          onChange={e => setEntryPointInput(e.target.value)}
                          placeholder="/bin/bash"
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem('entryPoint', entryPointInput);
                              setEntryPointInput('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            addArrayItem('entryPoint', entryPointInput);
                            setEntryPointInput('');
                          }}
                          className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.entryPoint?.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-sky-200"
                          >
                            <code className="text-sky-700">{entry}</code>
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem('entryPoint', index)
                              }
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volume Binds */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Volume Binds
                  </h2>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={bindInput}
                      onChange={e => setBindInput(e.target.value)}
                      placeholder="/host/path:/container/path or volume_name:/container/path"
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('bind', bindInput);
                          setBindInput('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addArrayItem('bind', bindInput);
                        setBindInput('');
                      }}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.bind?.map((bind, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200"
                      >
                        <code className="text-blue-700">{bind}</code>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('bind', index)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Restart Policy */}
                <div className="bg-sky-50 rounded-xl p-6 border border-sky-200">
                  <h2 className="text-xl font-semibold text-sky-800 mb-4">
                    Restart Policy
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-sky-700 mb-2">
                        Policy Mode
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        value={formData.restartPolicy?.name || 'no'}
                        onChange={e =>
                          handleInputChange('restartPolicy', {
                            ...formData.restartPolicy,
                            name: e.target.value as RestartPolicyMode,
                          })
                        }
                      >
                        <option value="no">No</option>
                        <option value="always">Always</option>
                        <option value="on-failure">On Failure</option>
                        <option value="unless-stopped">Unless Stopped</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sky-700 mb-2">
                        Maximum Retry Count
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        value={formData.restartPolicy?.maximumRetryCount || 0}
                        onChange={e =>
                          handleInputChange('restartPolicy', {
                            ...formData.restartPolicy,
                            maximumRetryCount: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={formData.restartPolicy?.name !== 'on-failure'}
                      />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Additional Options
                  </h2>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                      checked={formData.autoRemove || false}
                      onChange={e =>
                        handleInputChange('autoRemove', e.target.checked)
                      }
                    />
                    <span className="text-blue-700 font-medium">
                      Auto Remove (remove container after it exits)
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-12 py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Container
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerCreate;
