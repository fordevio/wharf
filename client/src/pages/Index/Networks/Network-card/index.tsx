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
import { NetworkResource } from '../../../../models/network';
import './index.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  network: NetworkResource;
}

const NetworkCard: React.FC<Props> = ({ network }) => {
  const navigate = useNavigate();

  // Skip default networks
  if (
    network.Name === 'bridge' ||
    network.Name === 'host' ||
    network.Name === 'none'
  ) {
    return null;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  };

  return (
    <tr className="con-tr">
      <td>
        <span
          className="td-sp-nm"
          onClick={() => navigate(`/network/${network.Id}`)}
        >
          {network.Name}
        </span>
      </td>
      <td>
        <span>{formatDate(network.Created)}</span>
      </td>
      <td>
        <span>{network.Driver}</span>
      </td>
    </tr>
  );
};

export default NetworkCard;
