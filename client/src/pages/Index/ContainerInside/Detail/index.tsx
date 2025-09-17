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
import containerIcon from '../../../../assets/common/container.png';
import { DockerContainer } from '../../../../models/container';
import { useState } from 'react';
import {
  getContainer,
  pauseContainer,
  removeContainer,
  startContainer,
  stopContainer,
  unpauseContainer,
} from '../../../../api/container';
import { useQuery } from 'react-query';
import { convertToIndianDateTime } from '../../../../utils/util';
import toast from 'react-hot-toast';
import { Trash, Pencil, Pause, Play, LogOut } from 'lucide-react';

const ContainerDetail = () => {
  const [container, setContainer] = useState<DockerContainer | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [openDl, setOpenDl] = useState(false);
  const [force, setForce] = useState(true);
  const [volumesRemoved, setVolumesRemoved] = useState(true);

  const fetchContainer = async () => {
    try {
      const res = await getContainer(
        localStorage.getItem('token') as string,
        id as string
      );
      setContainer(res.data);
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchContainer, {
    retry: false,
  });

  if (id === undefined) {
    return <></>;
  }

  const stopStartFunc = async () => {
    const token = localStorage.getItem('token') as string;

    try {
      if (container == null) {
        return { message: 'Container not found' };
      }
      let res;
      if (container.State === 'exited') {
        res = await startContainer(token, container.Id);
      } else {
        res = await stopContainer(token, container.Id);
      }
      fetchContainer();
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const pauseUnpauseFunc = async () => {
    const token = localStorage.getItem('token') as string;
    try {
      if (container == null) {
        return { message: 'Container not found' };
      }

      let res;
      if (container.State === 'paused') {
        res = await unpauseContainer(token, container.Id);
      } else {
        res = await pauseContainer(token, container.Id);
      }
      fetchContainer();

      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const StartStopHandler = async () => {
    if (container == null) {
      return;
    }
    toast.promise(stopStartFunc(), {
      loading: 'Processing...',
      success: data => `${data.message.replace(container.Id, '').trim()}`,
      error: data => `${data.error}`,
    });
  };

  const PauseUnpauseHandler = async () => {
    if (container == null) {
      return;
    }
    toast.promise(pauseUnpauseFunc(), {
      loading: 'Processing...',
      success: data => `${data.message.replace(container.Id, '').trim()}`,
      error: data => `${data.error}`,
    });
  };

  const delete_func = async () => {
    try {
      const res = await removeContainer(
        localStorage.getItem('token') as string,
        id,
        force,
        volumesRemoved
      );
      setForce(true);
      setVolumesRemoved(true);
      setOpenDl(false);
      navigate('/');
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const DeleteHandler = async () => {
    toast.promise(delete_func(), {
      loading: 'Deleting container...',
      success: data => `${data.message.replace(id, '').trim()}`,
      error: data => `${data.error}`,
    });
  };

  if (container === null) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="container-det">
        <div className="con-det-h">
          <img src={containerIcon} alt="" className="con-det-hd-img" />{' '}
          <span className="con-det-hd">Container Details</span>
          <div className="con-det-buts">
            <button className="det-btn" onClick={StartStopHandler}>
              {' '}
              {container.State === 'exited' ? (
                <Play className="btn-logo" size={20} />
              ) : (
                <LogOut className="btn-logo" size={20} />
              )}
              {container.State === 'exited' ? 'Start' : 'Stop'}
            </button>
            <button className="det-btn" onClick={PauseUnpauseHandler}>
              {container.State !== 'paused' ? (
                <Pause className="btn-logo" size={20} />
              ) : (
                <Play className="btn-logo" size={20} />
              )}
              {container.State === 'paused' ? 'Unpause' : 'Pause'}
            </button>
            <button
              className="det-btn"
              onClick={() => navigate('/container/update/' + id)}
            >
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
          <div className="cont-key">Name </div>
          <div className="cont-val">
            {' '}
            {container.Names[0].replace(/^\//, '')}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Image </div>
          <div className="cont-val"> {container.Image.split('@')[0]}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Status </div>
          <div className="cont-val"> {container.Status}</div>
        </div>
        <div className="cont-div ">
          <div className="cont-key">State </div>
          <div
            className="cont-val"
            style={
              container.State === 'running'
                ? { color: 'green' }
                : { color: 'red' }
            }
          >
            {container.State}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Created At </div>
          <div className="cont-val">
            {convertToIndianDateTime(container.Created)}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Command </div>
          <div className="cont-val"> {container.Command}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Labels </div>
          <div className="cont-val">
            {(container.Labels instanceof Map
              ? Array.from(container.Labels.entries())
              : Object.entries(container.Labels ?? {})
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
                  checked={volumesRemoved}
                  onChange={() => setVolumesRemoved(!volumesRemoved)}
                />
                Remove Volumes
              </label>
            </div>

            <button className="submit" onClick={DeleteHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerDetail;
