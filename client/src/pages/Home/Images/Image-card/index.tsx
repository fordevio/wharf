import React from 'react';
import './index.css';
import { Image } from '../../../../models/image';
import { deleteImagge, tagImage } from '../../../../api/image';
import toast from 'react-hot-toast';

interface Props {
  image: Image;
  images: Image[];
  setImages: (newImages: Image[]) => void;
}

const ImageCard: React.FC<Props> = ({ image, images, setImages }) => {
  const [force, setForce] = React.useState<boolean>(false);
  const [pruneChildren, setPruneChildren] = React.useState<boolean>(false);
  const [openDl, setOpenDl] = React.useState<boolean>(false);
  const [openTg, setOpenTg] = React.useState<boolean>(false);
  const [tag, setTag] = React.useState<string>('');
  const deleteIm = async () => {
    try {
      const token = localStorage.getItem('token') as string;
      const res = await deleteImagge(token, image.Id, force, pruneChildren);
      setImages(images.filter(img => img.Id !== image.Id));
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const tagIm = async () => {
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
      success: data => {
        setOpenTg(false);
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
      success: data => {
        setOpenDl(false);
        return `Successfully deleted image.`;
      },
      error: error => {
        setOpenDl(false);
        return `${error.message}`;
      },
    });
  };
  return (
    <>
      <div className="cont-card">
        <div className="name">{image.RepoTags[0]}</div>
        <div className="content">
          <span className="label">Id: </span>{' '}
          <span className="label">{image.Id.split('@')[0]}</span>
        </div>
        <div className="content">
          <span className="label">Created: </span>{' '}
          <span className="label">
            {new Date(image.Created * 1000).toString()}
          </span>
        </div>
        <div className="content">
          <span className="label">Size: </span>{' '}
          <span className="label">{image.Size} bytes</span>
        </div>
        <div>
          <button className="btn" onClick={() => setOpenDl(true)}>
            Delete
          </button>
          <button className="btn" onClick={() => setOpenTg(true)}>
            New Tag
          </button>
        </div>

        <div></div>
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

export default ImageCard;
