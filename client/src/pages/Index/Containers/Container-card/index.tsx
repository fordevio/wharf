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
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  container: DockerContainer;
}

const ContainerCard: React.FC<Props> = ({
  container,
}) => {
  const navigate = useNavigate();

  if (container == null) {
    return <></>;
  }

  return (
    <tr className='con-tr'>
      <td>
        <span style={{color: "#0099FF", cursor: "pointer"}} onClick={()=> navigate(`/container/${container.Id}`)}>
          {container.Names[0].replace(/^\//, '').slice(0, 10) + '...'}
        </span>
      </td>
      <td>
        <span>{container.Image.slice(0, 20) + '...'}</span>
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
