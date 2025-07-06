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
import { getAllContainers, pruneContainers } from '../../../api/container';
import { DockerContainer } from '../../../models/container';
import ContainerCard from './Container-card';
import './index.css';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

const Containers = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);

  const fetchContainers = async () => {
    try {
      const res = await getAllContainers(
        localStorage.getItem('token') as string
      );
      setContainers(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const containerRes = await pruneContainers(token);
      return containerRes.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning containers...',
      success: data => {
        fetchContainers();
        return `Successfully pruned ${data.ContainersDeleted ? data.ContainersDeleted.length : 0} containers and reclaimed ${data.SpaceReclaimed} bytes of space.`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useQuery('containers', fetchContainers, {
    retry: false,
  });

  return (
    <>
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Containers
        </button>
        <Link to={'/container/create'} className="btn create-btn">
          Create
        </Link>
      </div>
      <div className="card-container">
        {containers.map((container, index) => {
          return (
            <ContainerCard
              key={index}
              container={container}
              containers={containers}
              setContainers={setContainers}
            />
          );
        })}
      </div>
    </>
  );
};

export default Containers;
