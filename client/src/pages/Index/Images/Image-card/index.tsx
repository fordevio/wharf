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
import './index.css';
import { Image } from '../../../../models/image';
import { useNavigate } from 'react-router-dom';
import { convertToDateTime, formatBytes } from '../../../../utils/util';

interface Props {
  image: Image;
}

const ImageCard: React.FC<Props> = ({ image }) => {
  const navigate = useNavigate();
  const displayName =
    image.RepoTags && image.RepoTags.length > 0
      ? image.RepoTags[0]
      : '<none>:<none>';

  return (
    <tr className="con-tr">
      <td>
        <span
          className="td-sp-nm"
          onClick={() => navigate(`/image/${image.Id}`)}
        >
          {displayName}
        </span>
      </td>
      <td>
        <span>{formatBytes(image.Size || 0)}</span>
      </td>
      <td>
        <span>{convertToDateTime(image.Created)}</span>
      </td>
    </tr>
  );
};

export default ImageCard;
