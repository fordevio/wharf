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
import { containerStats } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerStats = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stats, setStats] = useState<string | null>(null);
  const fetchStats = async () => {
    try {
      const res = await containerStats(
        localStorage.getItem('token') as string,
        id as string
      );
      setStats(res.data);
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchStats, {
    retry: false,
  });

  if (id === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="con-stats-det">
        <div className="stats">
          <div className="title">Stats</div>
          <div className="stats-container">
            {stats ? (
              <div className="stats-data">{stats}</div>
            ) : (
              <div className="loading">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerStats;
