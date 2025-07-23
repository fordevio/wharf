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
import { getAllNetworks, pruneNetworks } from '../../../api/network';
import { NetworkResource } from '../../../models/network';
import toast from 'react-hot-toast';
import NetworkCard from './Network-card';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

const Networks = () => {
  const navigate = useNavigate();
  const [networks, setNetworks] = useState<NetworkResource[]>([]);

  const fetchNetworks = async () => {
    try {
      const res = await getAllNetworks(localStorage.getItem('token') as string);
      setNetworks(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await pruneNetworks(token);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning Networks...',
      success: data => {
        fetchNetworks();
        return `Successfully pruned ${data.NetworksDeleted ? data.NetworksDeleted.length : 0} networks,`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useQuery('networks', fetchNetworks, {
    retry: false,
  });

  return (
    <div className="page">
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Networks
        </button>
        <button onClick={() => navigate('/network/create')} className="btn">
          Create
        </button>
      </div>
      <div className="card-container">
        {networks.map((network, index) => {
          return <NetworkCard key={index} network={network} />;
        })}
      </div>
    </div>
  );
};

export default Networks;
