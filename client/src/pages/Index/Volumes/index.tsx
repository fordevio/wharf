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
import toast from 'react-hot-toast';
import VolumeCard from './Volume-card';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

const Volumes = () => {
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
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Volumes
        </button>
        <Link to="/volume/create" className="btn create-btn">
          Create
        </Link>
      </div>
      <div className="card-container">
        {volumes.map((vol, index) => {
          return (
            <VolumeCard
              key={index}
              volume={vol}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Volumes;
