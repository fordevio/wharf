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
import { Link } from 'react-router-dom';
import { formatBytes } from '../../../../utils/util';

interface Props {
  image: Image;
}

const ImageCard: React.FC<Props> = ({ image }) => {
  return (
    <>
      <div className="cont-card">
        <div className="name">{image.RepoTags[0]}</div>

        <div className="content">
          <span className="label">Created: </span>{' '}
          <span className="label">
            {new Date(image.Created * 1000).toString()}
          </span>
        </div>
        <div className="content">
          <span className="label">Size: </span>{' '}
          <span className="label">{formatBytes(image.Size)}</span>
        </div>
        <div>
          <Link className="btn detail" to={'/image/' + image.Id}>
            Details
          </Link>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default ImageCard;
