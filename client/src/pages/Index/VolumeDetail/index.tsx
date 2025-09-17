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
import { useNavigate, useParams } from 'react-router-dom';
import { Volume } from '../../../models/volume';
import { deleteVolume, getAllVolumes } from '../../../api/volume';
import { formatBytes } from '../../../utils/util';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { Trash } from 'lucide-react';
import volumeIcon from '../../../assets/common/volume.png';

const VolumeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [volume, setVolume] = useState<Volume | null>(null);
  const [force, setForce] = useState(false);
  const [openDl, setOpenDl] = useState(false);
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

  const delVolume = async () => {
    if (!volume) {
      return;
    }
    try {
      const res = await deleteVolume(
        localStorage.getItem('token') as string,
        volume.Name,
        force
      );
      setOpenDl(false);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const deleteHandler = async () => {
    toast.promise(delVolume(), {
      loading: 'Deleting volume...',
      success: () => {
        navigate('/volumes');
        return `Volume deleted successfully!`;
      },
      error: err => {
        return err.error;
      },
    });
  };

  useQuery('volume' + id, fetchVolume, {
    retry: false,
  });

  if (volume === null) {
    return <></>;
  }

  return (
    <div className="page">
      <div className="vol-det">
        <div className="vol-det-h">
          <img src={volumeIcon} alt="" className="vol-det-hd-img" />{' '}
          <span className="vol-det-hd">Volume Details</span>
          <div className="vol-det-buts">
            <button
              className="det-btn del-btn"
              style={{ background: '#B11010' }}
              onClick={() => setOpenDl(true)}
            >
              <Trash className="btn-logo" size={20} />
              Delete
            </button>
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Name </div>
          <div className="cont-val"> {volume.Name}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Driver </div>
          <div className="cont-val"> {volume.Driver}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Mountpoint </div>
          <div className="cont-val"> {volume.Mountpoint}</div>
        </div>
        <div className="cont-div ">
          <div className="cont-key">Scope </div>
          <div className="cont-val">{volume.Scope}</div>
        </div>
        {volume.UsageData && (
          <div className="cont-div ">
            <div className="cont-key">Size </div>
            <div className="cont-val">{formatBytes(volume.UsageData.Size)}</div>
          </div>
        )}
        {volume.UsageData && (
          <div className="cont-div ">
            <div className="cont-key">Ref Count </div>
            <div className="cont-val">
              {volume.UsageData.RefCount === -1
                ? 'N/A'
                : volume.UsageData.RefCount}
            </div>
          </div>
        )}
        <div className="cont-div">
          <div className="cont-key">Created At </div>
          <div className="cont-val">
            {volume.CreatedAt
              ? new Date(volume.CreatedAt).toLocaleString()
              : 'N/A'}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Labels </div>
          <div className="cont-val">
            {(volume.Labels instanceof Map
              ? Array.from(volume.Labels.entries())
              : Object.entries(volume.Labels ?? {})
            )
              .slice(0, 2)
              .map(([key, value]) => (
                <p key={key} className="cont-l">
                  {` ${key} : ${value}`}
                </p>
              ))}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Options </div>
          <div className="cont-val">
            {(volume.Options instanceof Map
              ? Array.from(volume.Options.entries())
              : Object.entries(volume.Options ?? {})
            )
              .slice(0, 2)
              .map(([key, value]) => (
                <p key={key} className="cont-l">
                  {` ${key} : ${value}`}
                </p>
              ))}
          </div>
        </div>
        {volume.Status && (
          <div className="cont-div">
            <div className="cont-key">Status </div>
            <div className="cont-val">
              {(volume.Status instanceof Map
                ? Array.from(volume.Status.entries())
                : Object.entries(volume.Status ?? {})
              )
                .slice(0, 4)
                .map(([key, value]) => (
                  <p key={key} className="cont-l">
                    {` ${key} : ${value}`}
                  </p>
                ))}
            </div>
          </div>
        )}
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
    </div>
  );
};

export default VolumeDetail;
