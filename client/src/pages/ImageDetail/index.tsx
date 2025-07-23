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

import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { deleteImagge, getAllImages, tagImage } from '../../api/image';
import { Image } from '../../models/image';
import { useState } from 'react';
import { formatBytes } from '../../utils/util';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

const ImageDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState<Image | null>(null);
   const [openDl, setOpenDl] = useState<boolean>(false);
    const [openTg, setOpenTg] = useState<boolean>(false);
    const [force, setForce] = useState<boolean>(false);
      const [pruneChildren, setPruneChildren] = useState<boolean>(false);
    const [tag, setTag] = useState<string>('');
  
    const navigate = useNavigate();
  const fetchImage = async () => {
    try {
      const res = await getAllImages(localStorage.getItem('token') as string);
      for (const image of res.data) {
        if (image.Id === id) {
          setImage(image);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const deleteIm = async () => {
    if(!image) {
      return
    }
    try {
      const token = localStorage.getItem('token') as string;
      const res = await deleteImagge(token, image.Id, force, pruneChildren);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const tagIm = async () => {
     if(!image) {
      return
    }
    try {
      const token = localStorage.getItem('token') as string;
      const res = await tagImage(token, image.Id, tag);
      setTag('');
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const tagHandler = async () => {
    if(!image) {
      return
    }
    if (tag.trim() === '') {
      toast.error('Tag cannot be empty');
      return;
    }
    if (tag === image.RepoTags[0]) {
      toast.error('Tag already exists');
      return;
    }
    toast.promise(tagIm(), {
      loading: 'Tagging Image...',
      success: () => {
        setOpenTg(false);
        fetchImage()
        return `Successfully tagged image with tag ${tag}.`;
      },
      error: error => {
        setOpenTg(false);
        return `${error.message}`;
      },
    });
  };
  const deleteHandler = async () => {
    toast.promise(deleteIm(), {
      loading: 'Deleting Image...',
      success: () => {
        setOpenDl(false);
        navigate('/images');
        return `Successfully deleted image.`;
      },
      error: error => {
        setOpenDl(false);
        return `${error.message}`;
      },
    });
  };

  useQuery('image' + id, fetchImage, {
    retry: false,
  });
  if (image === null) {
    return <></>;
  }

  return (
    <>
      <div className="image-detail-container">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
        <div className="image-details">
          <h2>Image Details</h2>

          <p>
            <strong>ID:</strong> {image.Id}
          </p>
          <p>
            <strong>Parent ID:</strong> {image.ParentId}
          </p>
          <p>
            <strong>Created:</strong>{' '}
            {new Date(image.Created * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Containers:</strong>{' '}
            {image.Containers === -1 ? 'Not calculated' : image.Containers}
          </p>
          <p>
            <strong>Size:</strong> {formatBytes(image.Size)}
          </p>
          <p>
            <strong>Shared Size:</strong> {formatBytes(image.SharedSize)}
          </p>
          {image.VirtualSize !== undefined && (
            <p>
              <strong>Virtual Size:</strong> {formatBytes(image.VirtualSize)}
            </p>
          )}

          <h3>Repo Tags</h3>
          <ul>
            {image.RepoTags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>

          <h3>Repo Digests</h3>
          <ul>
            {image.RepoDigests.map((digest, index) => (
              <li key={index}>{digest}</li>
            ))}
          </ul>

          <h3>Labels</h3>
          {image.Labels ? (
            Object.keys(image.Labels).length > 0 ? (
              <ul>
                {Object.entries(image.Labels).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No labels</p>
            )
          ) : (
            <p>No labels</p>
          )}
        </div>
        <button className="btn" onClick={() => setOpenDl(true)}>
            Delete
          </button>
          <button className="btn" onClick={() => setOpenTg(true)}>
            New Tag
          </button>
      </div>
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={openTg ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpenTg(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <input
              type="text"
              placeholder="New tag"
              value={tag}
              onChange={e => setTag(e.target.value)}
            />

            <button className="submit" onClick={tagHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={openDl ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpenDl(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={force}
                  onChange={() => setForce(!force)}
                />
                force Delete
              </label>
            </div>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={pruneChildren}
                  onChange={() => setPruneChildren(!pruneChildren)}
                />
                Prune Children
              </label>
            </div>

            <button className="submit" onClick={deleteHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageDetail;
