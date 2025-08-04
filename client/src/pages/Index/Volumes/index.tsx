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
import { Volume } from '../../../models/volume';
import { getAllVolumes, pruneVolumes } from '../../../api/volume';
import volumeIcon from '../../../assets/common/volume.png';
import toast from 'react-hot-toast';
import VolumeCard from './Volume-card';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Plus } from 'lucide-react';

const Volumes = () => {
  const navigate = useNavigate();
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const fetchVolumes = async () => {
    try {
      const res = await getAllVolumes(localStorage.getItem('token') as string);
      setVolumes(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await pruneVolumes(token);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning Volumes...',
      success: data => {
        fetchVolumes();
        return `Successfully pruned ${data.VolumesDeleted ? data.VolumesDeleted.length : 0} volumes and reclaimed ${data.SpaceReclaimed} bytes of space.`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useQuery('volumes', fetchVolumes, {
    retry: false,
  });

  return (
    <div className="page">
      <div className="table-container">
        <div className="con-table-header">
          <div className="con-table-title">
            <img src={volumeIcon} alt="" className="con-table-title-icon" />
            <span className="con-table-title-name">Volume</span>
          </div>
          <div className="con-table-header-but">
            <button
              onClick={pruneHandler}
              style={{ backgroundColor: '#B11010' }}
              className="con-btn"
            >
              Prune volume
            </button>
            <button
              onClick={() => navigate('/volume/create')}
              className="con-btn"
            >
              <Plus size={18} /> Create
            </button>
          </div>
        </div>
        <hr className="white-line" />

        <table className="container-table">
          <thead>
            <tr className="con-tr">
              <th>Name</th>
              <th>CreatedAt</th>
              <th>Driver</th>
            </tr>
          </thead>

          <tbody className="con-tbody">
            {volumes.map(volume => (
              <VolumeCard key={volume.Name} volume={volume} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Volumes;
