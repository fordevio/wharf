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

import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { useState } from 'react';
import { DockerContainer } from '../../models/container';
import { getContainer } from '../../api/container';
import { useQuery } from 'react-query';

const ContainerUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [container, setContainer] = useState<DockerContainer | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<Record<string, string>>({});


  const fetchContainer = async () => {
    if (id === undefined || id === null) {
    return ;
  }
    try {
      const res = await getContainer(
        localStorage.getItem('token') as string,
        id as string
      );
      setContainer(res.data);
      setLabels(Object.fromEntries(res.data.Labels.entries()));
      setName(res.data.Names[0]);
    } catch (e) {
      console.log(e);
      return navigate('/containers');
    }
  };

  useQuery('container' + id, fetchContainer, {
    retry: false,
  });

  if (id === undefined || id === null) {
    return <></>;
  }

  return (
    <>
      <div className="container-update">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ContainerUpdate;
