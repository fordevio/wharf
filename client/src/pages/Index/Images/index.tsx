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
import ImageCard from './Image-card';
import { useQuery } from 'react-query';

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
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Images
        </button>
      </div>
      <div className="card-container">
        {images.map((image, index) => {
          return <ImageCard key={index} image={image} />;
        })}
      </div>
    </div>
  );
};

export default Images;
