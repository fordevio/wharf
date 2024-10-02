import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { DockerContainer } from '../../../models/container';
import { useState } from 'react';
import {
  getAllContainers,
  removeContainer,
  renameContainer,
} from '../../../api/container';
import { useQuery } from 'react-query';
import { convertToIndianDateTime } from '../../../utils/util';
import toast from 'react-hot-toast';

const ContainerDetail = () => {
  const [container, setContainer] = useState<DockerContainer | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [openRn, setOpenRn] = useState(false);
  const [openDl, setOpenDl] = useState(false);
  const [newName, setNewName] = useState('');
  const [force, setForce] = useState(true);
  const [volumesRemoved, setVolumesRemoved] = useState(true);

  const fetchContainer = async () => {
    try {
      const containers = await getAllContainers(
        localStorage.getItem('token') as string
      );
      let s = 0;
      containers.data.forEach(cont => {
        if (cont.Id === id) {
          setContainer(cont);
          s = 1;
          return;
        }
      });
      if (s === 0) {
        navigate('/');
      }
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
  const edit_func = async () => {
    try {
      const res = await renameContainer(
        localStorage.getItem('token') as string,
        id,
        newName
      );
      setNewName('');
      setOpenRn(false);
      setContainer({ ...container!, Names: [newName] });
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const EditNameHandler = async () => {
    if (newName === '') {
      toast.error('Please fill all fields');
      return;
    }
    if (newName === container?.Names[0].replace(/^\//, '')) {
      toast.error('Name is same as previous');
      return;
    }
    toast.promise(edit_func(), {
      loading: 'Editing name...',
      success: data => `${data.message.replace(id, '').trim()}`,
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
          <span className="cont sp">Image: </span>{' '}
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
          <button className="btn" onClick={() => setOpenRn(true)}>
            Edit Name
          </button>
        </div>
      </div>
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={openRn ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpenRn(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <input
              type="text"
              placeholder="New name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />

            <button className="submit" onClick={EditNameHandler}>
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
