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
import { DockerContainer } from '../../../models/container';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllContainers } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerVolumes = () => {
  const [container, setContainer] = useState<DockerContainer | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchContainer = async () => {
    try {
      const containers = await getAllContainers(
        localStorage.getItem('token') as string
      );
      let s = 0;
      containers.data.forEach(cont => {
        if (cont.Id === id) {
          console.log(cont);
          setContainer(cont);
          s = 1;
          return;
        }
      });
      if (s === 0) {
        navigate('/');
      }
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchContainer, {
    retry: false,
  });

  if (id === undefined) {
    return <></>;
  }
  return (
    <>
      <div className="con-vol-det">
        <div className="volumes">
          <div className="title">Mounts</div>
          <div className="volume-container">
            {container?.Mounts.map((volume, index) => (
              <div key={index} className="volume">
                <div className="vol-name">Type: {volume.Type}</div>
                <div className="volume-name">Name: {volume.Name?.trim()}</div>
                <div className="volume-name">Driver: {volume.Driver}</div>
                <div className="volume-name">Source: {volume.Source}</div>
                <div className="volume-name">
                  Destination: {volume.Destination}
                </div>
                <div className="volume-name">Mode: {volume.Mode}</div>
                <div className="volume-name">
                  RW: {volume.RW ? 'true' : 'false'}
                </div>
                <div className="volume-name">
                  Propagation: {volume.Propagation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerVolumes;
