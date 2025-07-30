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
    <div className="page" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '10px' }}>
        <button onClick={pruneHandler} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>
          Prune Image
        </button>
        <button style={{ backgroundColor: 'blue', color: 'white', padding: '8px 16px', borderRadius: '4px' }}>
          Build a new Image
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>Size</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ccc' }}>CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{image.RepoTags?.[0] || 'untagged'}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{(image.Size / (1024 * 1024)).toFixed(2)} MB</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(image.Created * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Images;
