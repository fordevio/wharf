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
import { createNetwork } from '../../api/network';

const NetworkCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [driver, setDriver] = useState('bridge');

  const create = async () => {
    try {
      const res = await createNetwork(
        localStorage.getItem('token') as string,
        name,
        driver
      );
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (
      driver.toLowerCase() !== 'bridge' &&
      driver.toLowerCase() !== 'host' &&
      driver.toLowerCase() !== 'none'
    ) {
      toast.error('Invalid driver specified. Use "bridge", "host", or "none".');
      return;
    }
    e.preventDefault();
    toast.promise(create(), {
      loading: 'Creating network...',
      success: data => {
        navigate(`/network/${data.Id}`);
        return `Network created successfully!`;
      },
      error: data => `Error creating network: ${data.error}`,
    });
  };

  return (
    <>
      <div className="back-button-container">
        <button
          className="btn back-button"
          onClick={() => window.history.back()}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>
      <div className="network-create-container">
        <div className="network-create-wrapper">
          <form className="network-create-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Create network</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="network-name">
                network Name*
              </label>
              <input
                id="network-name"
                className="form-input"
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter network name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="network-name">
                Driver*
              </label>
              <input
                id="network-name"
                className="form-input"
                type="text"
                name="name"
                value={driver}
                onChange={e => setDriver(e.target.value)}
                placeholder="bridge | host | none"
                required
              />
            </div>
            <div className="form-actions">
              <button className="submit-button" type="submit">
                <span className="submit-icon">🌐</span>
                Create network
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NetworkCreate;
