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
import { deleteImagge, getAllImages, tagImage } from '../../../api/image';
import { Image } from '../../../models/image';
import { useState } from 'react';
import { formatBytes } from '../../../utils/util';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { Trash, Pencil } from 'lucide-react';
import imgIcon from '../../../assets/common/image.png';
import { convertToDateTime } from '../../../utils/util';

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
    <div className="page">
      <div className="img-det">
        <div className="img-det-h">
          <img src={imgIcon} alt="" className="img-det-hd-img" />{' '}
          <span className="img-det-hd">Image Details</span>
          <div className="img-det-buts">
            <button className="det-btn del-btn" onClick={() => setOpenTg(true)}>
              <Pencil className="btn-logo" size={20} />
              Edit
            </button>
            <button
              className="det-btn del-btn"
              style={{ background: '#B11010' }}
              onClick={() => setOpenDl(true)}
            >
              <Trash className="btn-logo" size={20} />
              Delete
            </button>
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Tag </div>
          <div className="cont-val"> {image.RepoTags[0]}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Id </div>
          <div className="cont-val"> {image.Id}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Parent Id </div>
          <div className="cont-val"> {image.ParentId}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Created </div>
          <div className="cont-val"> {convertToDateTime(image.Created)}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Containers </div>
          <div className="cont-val">
            {' '}
            {image.Containers === -1 ? 'N/A' : image.Containers}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Size </div>
          <div className="cont-val"> {formatBytes(image.Size)}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Shared Size </div>
          <div className="cont-val"> {formatBytes(image.SharedSize)}</div>
        </div>
        {image.VirtualSize !== undefined && (
          <div className="cont-div">
            <div className="cont-key">Virtual Size </div>
            <div className="cont-val"> {formatBytes(image.VirtualSize)}</div>
          </div>
        )}
        <div className="cont-div">
          <div className="cont-key">Labels </div>
          <div className="cont-val">
            {(image.Labels instanceof Map
              ? Array.from(image.Labels.entries())
              : Object.entries(image.Labels ?? {})
            )
              .slice(0, 2)
              .map(([key, value]) => (
                <p key={key} className="cont-l">
                  {` ${key} : ${value}`}
                </p>
              ))}
          </div>
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
    </div>
  );
};

export default ImageDetail;
