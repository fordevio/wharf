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
import './index.css';
import { useNavigate } from 'react-router-dom';
import { convertToIndianDateTime } from '../../../../utils/util';

interface Props {
  volume: Volume;
}

const VolumeCard: React.FC<Props> = ({ volume }) => {
  const navigate = useNavigate();

  return (
    <tr className="con-tr">
      <td>
        <span
          className="td-sp-nm"
          onClick={() => navigate(`/volume/${volume.Name}`)}
        >
          {volume.Name}
        </span>
      </td>
      <td>
        <span>
          {volume.CreatedAt &&
            convertToIndianDateTime(
              Math.floor(new Date(volume.CreatedAt).getTime() / 1000)
            )}
        </span>
      </td>
      <td>
        <span>{volume.Driver}</span>
      </td>
    </tr>
  );
};

export default VolumeCard;
