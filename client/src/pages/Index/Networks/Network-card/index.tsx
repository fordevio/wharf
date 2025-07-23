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
import { Link } from 'react-router-dom';
import { NetworkResource } from '../../../../models/network';

interface Props {
  network: NetworkResource;
}

const NetworkCard: React.FC<Props> = ({ network}) => {

  if (
    network.Name === 'bridge' ||
    network.Name === 'host' ||
    network.Name === 'none'
  ) {
    return <></>;
  }
  return (
    <>
      <div className="cont-card">
        <div className="name">{network.Name}</div>

        <div className="content">
          <span className="label">Created: </span>{' '}
          <span className="label">
            {network.Created && new Date(network.Created).toString()}
          </span>
        </div>
        <div className="content">
          <span className="label">Driver: </span>{' '}
          <span className="label">{network.Driver}</span>
        </div>
        <div className="content">
          <Link className="btn detail" to={'/network/' + network.Id}>
            Details
          </Link>
        </div>
      </div>
    </>
  );
};

export default NetworkCard;
