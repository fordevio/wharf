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
import toast from 'react-hot-toast';
import { getAllImages, pruneImages } from '../../../api/image';
import { Image } from '../../../models/image';
import imageIcon from '../../../assets/common/image.png';
import ImageCard from './Image-card';

import { useQuery } from 'react-query';
import { Plus } from 'lucide-react';

const Images = () => {
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async () => {
    try {
      const res = await getAllImages(localStorage.getItem('token') as string);
      setImages(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const prune = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await pruneImages(token);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pruneHandler = async () => {
    toast.promise(prune(), {
      loading: 'Pruning Images...',
      success: data => {
        fetchImages();
        return `Successfully pruned ${data.ImagesDeleted ? data.ImagesDeleted.length : 0} images and reclaimed ${data.SpaceReclaimed} bytes of space.`;
      },
      error: error => {
        return `${error.message}`;
      },
    });
  };

  useQuery('images', fetchImages, {
    retry: false,
  });

  return (
    <div className="page">
      <div className="table-container">
        <div className="con-table-header">
          <div className="con-table-title">
            <img src={imageIcon} alt="" className="con-table-title-icon" />
            <span className="con-table-title-name">Image</span>
          </div>
          <div className="con-table-header-but">
            <button
              onClick={pruneHandler}
              style={{ backgroundColor: '#B11010' }}
              className="con-btn"
            >
              Prune Image
            </button>
            <button
              onClick={() => {
                /* TODO: Implement image build functionality */
              }}
              className="con-btn"
            >
              <Plus size={18} /> Build a new Image
            </button>
          </div>
        </div>
        <hr className="white-line" />

        <table className="container-table">
          <thead>
            <tr className="con-tr">
              <th>Name</th>
              <th>Size</th>
              <th>CreatedAt</th>
            </tr>
          </thead>

          <tbody className="con-tbody">
            {images.map(image => (
              <ImageCard key={image.Id} image={image} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Images;
