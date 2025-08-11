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
        <div className="cont-div">
          <span className="cont sp">Name: </span>{' '}
          <span className="cont"> {container.Names[0].replace(/^\//, '')}</span>
        </div>
        <div className="cont-div">
          <span className="cont sp cont-span">Image: </span>{' '}
          <span className="cont"> {container.Image.split('@')[0]}</span>
        </div>
        <div className="cont-div pad">
          <span className="cont-l sp">Status: </span>{' '}
          <span className="cont-l"> {container.Status}</span>
        </div>
        <div className="cont-div ">
          <span className="cont-l sp">State: </span>{' '}
          <span
            className="cont-l"
            style={
              container.State === 'running'
                ? { color: 'green' }
                : { color: 'red' }
            }
          >
            {' '}
            {container.State}
          </span>
        </div>
        <div className="cont-div pad">
          <span className="cont-l sp">Created At: </span>{' '}
          <span className="cont-l">
            {' '}
            {convertToIndianDateTime(container.Created)}
          </span>
        </div>
        <div className="cont-div pad">
          <span className="cont-l sp">Command: </span>{' '}
          <span className="cont-l"> {container.Command}</span>
        </div>
        <div className="cont-div pad">
          <span className="cont-l sp">Labels: </span>
          <div className="lab">
            {Object.entries(container.Labels).map(([key, value]) => {
              return (
                <p key={key} className="cont-l">
                  {' '}
                  {key} : {value}
                </p>
              );
            })}
          </div>
        </div>
        <div className="">
          <button className="btn del-btn" onClick={() => setOpenDl(true)}>
            Delete
          </button>
          <button
            className="btn"
            onClick={() => navigate('/container/update/' + id)}
          >
            Edit
          </button>
          <button className="btn" onClick={StartStopHandler}>
            {' '}
            {container.State === 'exited' ? 'Start' : 'Stop'}
          </button>
          <button className="btn" onClick={PauseUnpauseHandler}>
            {container.State === 'paused' ? 'Unpause' : 'Pause'}
          </button>
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
