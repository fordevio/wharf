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
import { Volume } from '../../../../models/volume';
import { Link } from 'react-router-dom';

interface Props {
  volume: Volume;
}

const VolumeCard: React.FC<Props> = ({ volume }) => {
  return (
    <>
      <div className="cont-card">
        <div className="name">{volume.Name}</div>

        <div className="content">
          <span className="label">Created: </span>{' '}
          <span className="label">
            {volume.CreatedAt && new Date(volume.CreatedAt).toString()}
          </span>
        </div>
        <div className="content">
          <span className="label">Driver: </span>{' '}
          <span className="label">{volume.Driver}</span>
        </div>
        <div className="content">
          <Link className="btn detail" to={'/volume/' + volume.Name}>
            Details
          </Link>
        </div>
      </div>
    </>
  );
};

export default VolumeCard;
