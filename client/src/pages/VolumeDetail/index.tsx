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

import { useEffect, useState } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';
import { Volume } from '../../models/volume';
import { getAllVolumes } from '../../api/volume';
import { formatBytes } from '../../utils/util';

const VolumeDetail = () => {
  const { id } = useParams();
  const [volume, setVolume] = useState<Volume | null>(null);
  const fetchVolume = async () => {
    try {
      const res = await getAllVolumes(localStorage.getItem('token') as string);
      for (const vol of res.data) {
        if (vol.Name === id) {
          setVolume(vol);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  useEffect(() => {
    fetchVolume();
  });
  if (volume === null) {
    return <></>;
  }
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
      <div className="volume-detail">
        <h2>Volume Detail</h2>
        <p>
          <strong>Name:</strong> {volume.Name}
        </p>
        <p>
          <strong>Driver:</strong> {volume.Driver}
        </p>
        <p>
          <strong>Mountpoint:</strong> {volume.Mountpoint}
        </p>
        <p>
          <strong>Scope:</strong> {volume.Scope}
        </p>
        {volume.CreatedAt && (
          <p>
            <strong>Created At:</strong>{' '}
            {new Date(volume.CreatedAt).toLocaleString()}
          </p>
        )}

        <h3>Labels</h3>
        {Object.keys(volume.Labels ?? {}).length > 0 ? (
          <ul>
            {Object.entries(volume.Labels ?? {}).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        ) : (
          <p>No labels</p>
        )}

        <h3>Options</h3>
        {Object.keys(volume.Options ?? {}).length > 0 ? (
          <ul>
            {Object.entries(volume.Options ?? {}).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        ) : (
          <p>No options</p>
        )}

        {volume.Status && (
          <>
            <h3>Status</h3>
            <ul>
              {Object.entries(volume.Status).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {String(v)}
                </li>
              ))}
            </ul>
          </>
        )}

        {volume.UsageData && (
          <>
            <h3>Usage Data</h3>
            <p>
              <strong>Ref Count:</strong>{' '}
              {volume.UsageData.RefCount === -1
                ? 'N/A'
                : volume.UsageData.RefCount}
            </p>
            <p>
              <strong>Size:</strong> {formatBytes(volume.UsageData.Size)}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default VolumeDetail;
