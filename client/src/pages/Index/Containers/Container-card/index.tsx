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

import React from 'react';
import { DockerContainer } from '../../../../models/container';
import './index.css';
import {
  pauseContainer,
  startContainer,
  stopContainer,
  unpauseContainer,
} from '../../../../api/container';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface Props {
  container: DockerContainer;
  containers: DockerContainer[];
  setContainers: (newContainers: DockerContainer[]) => void;
}

const ContainerCard: React.FC<Props> = ({
  container,
  setContainers,
  containers,
}) => {
  const stopStartFunc = async () => {
    const token = localStorage.getItem('token') as string;

    try {
      if (container == null) {
        return { message: 'Container not found' };
      }
      let res;
      if (container.State === 'exited') {
        res = await startContainer(token, container.Id);
        const newContainers = containers.map(c => {
          if (c.Id === container.Id) {
            const newContainer = {
              ...c,
              State: 'running',
              Status: 'Up 1 second',
            };
            return newContainer;
          }
          return c;
        });
        setContainers(newContainers);
      } else {
        res = await stopContainer(token, container.Id);
        const newContainers = containers.map(c => {
          if (c.Id === container.Id) {
            const newContainer = {
              ...c,
              State: 'exited',
              Status: 'Exited 1 second',
            };
            return newContainer;
          }
          return c;
        });
        setContainers(newContainers);
      }
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pauseUnpauseFunc = async () => {
    const token = localStorage.getItem('token') as string;
    try {
      if (container == null) {
        return { message: 'Container not found' };
      }

      let res;
      if (container.State === 'paused') {
        res = await unpauseContainer(token, container.Id);
        const newContainers = containers.map(c => {
          if (c.Id === container.Id) {
            const newContainer = {
              ...c,
              State: 'running',
              Status: 'Up 1 second',
            };
            return newContainer;
          }
          return c;
        });
        setContainers(newContainers);
      } else {
        res = await pauseContainer(token, container.Id);
        const newContainers = containers.map(c => {
          if (c.Id === container.Id) {
            const newContainer = {
              ...c,
              State: 'paused',
              Status: 'Paused 1 second',
            };
            return newContainer;
          }
          return c;
        });
        setContainers(newContainers);
      }

      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const StartStopHandler = async () => {
    if (container == null) {
      return;
    }
    toast.promise(stopStartFunc(), {
      loading: 'Processing...',
      success: data => `${data.message.replace(container.Id, '').trim()}`,
      error: data => `${data.error}`,
    });
  };

  const PauseUnpauseHandler = async () => {
    if (container == null) {
      return;
    }
    toast.promise(pauseUnpauseFunc(), {
      loading: 'Processing...',
      success: data => `${data.message.replace(container.Id, '').trim()}`,
      error: data => `${data.error}`,
    });
  };

  if (container == null) {
    return <></>;
  }

  return (
    <tr>
      <td>
        <span>
          {container.Names[0].replace(/^\//, '').slice(0, 10) + '...'}
        </span>
      </td>
      <td>
        <span className="container-image">
          {container.Image.slice(0, 20) + '...'}
        </span>
      </td>
      <td>
        <span
          style={{ color: container.State === 'running' ? 'green' : 'red' }}
        >
          {container.State}
        </span>
      </td>
      <td>
        <span>{container.Created}</span>
      </td>
      <td>
        <span>{container.Status}</span>
      </td>
    </tr>
  );
};

export default ContainerCard;

