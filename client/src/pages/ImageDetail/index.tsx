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
import { formatBytes, convertToIndianDateTime } from '../../utils/util';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';

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
    if (!image) {
      return;
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
    if (!image) {
      return;
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
    if (!image) {
      return;
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
        fetchImage();
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
      <Navbar />
      <div className="page">
        <div className="table-container">
          <div className="con-table-header">
            <div className="con-table-title">
              <span className="con-table-title-name">Image Details</span>
            </div>
          </div>
          <hr className="white-line" />

          <table className="container-table">
            <tbody className="con-tbody">
              <tr className="con-tr">
                <td className="detail-label">Id</td>
                <td className="detail-value">{image.Id}</td>
              </tr>
              <tr className="con-tr">
                <td className="detail-label">CreatedAt</td>
                <td className="detail-value">
                  {convertToIndianDateTime(image.Created)}
                </td>
              </tr>
              <tr className="con-tr">
                <td className="detail-label">Size</td>
                <td className="detail-value">{formatBytes(image.Size)}</td>
              </tr>
              <tr className="con-tr">
                <td className="detail-label">Repo Tags</td>
                <td className="detail-value">
                  {image.RepoTags && image.RepoTags.length > 0
                    ? image.RepoTags.join(', ')
                    : 'No tags'}
                </td>
              </tr>
              <tr className="con-tr">
                <td className="detail-label">Repo Tags</td>
                <td className="detail-value">
                  {image.RepoDigests && image.RepoDigests.length > 0
                    ? image.RepoDigests.join(', ')
                    : 'No digests'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
