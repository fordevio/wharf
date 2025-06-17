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

import React, { useState } from 'react';
import { Volume } from '../../../../models/volume';
import { Link } from 'react-router-dom';
import { deleteVolume } from '../../../../api/volume';
import toast from 'react-hot-toast';

interface Props {
  volume: Volume;
  volumes: Volume[];
  setVolumes: (newVolumes: Volume[]) => void;
}

const VolumeCard: React.FC<Props> = ({ volume, volumes, setVolumes }) => {
  const [force, setForce] = useState(false);
  const [openDl, setOpenDl] = useState(false);
  const delVolume = async () => {
    try {
      const res = await deleteVolume(
        localStorage.getItem('token') as string,
        volume.Name,
        force
      );
      setOpenDl(false);
      setVolumes(volumes.filter(vol => vol.Name !== volume.Name));
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const deleteHandler = async () => {
    toast.promise(delVolume(), {
      loading: 'Deleting volume...',
      success: data => {
        return `Volume deleted successfully!`;
      },
      error: err => {
        return err.error;
      },
    });
  };
  return (
    <>
      <div className="cont-card">
        <div className="name">{volume.Name}</div>

        <div className="content">
          <span className="label">Created: </span>{' '}
          <span className="label">
            {volume.CreatedAt && new Date(volume.CreatedAt).toString()}
          </span>
        </div>
        <div className="content">
          <span className="label">Driver: </span>{' '}
          <span className="label">{volume.Driver}</span>
        </div>
        <div className="content">
          <button className="btn detail" onClick={() => setOpenDl(true)}>
            Delete
          </button>
          <Link className="btn detail" to={'/volume/' + volume.Name}>
            Details
          </Link>
        </div>
      </div>
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={openDl ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpenDl(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={force}
                  onChange={() => setForce(!force)}
                />
                force Delete
              </label>
            </div>

            <button className="submit" onClick={deleteHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolumeCard;
