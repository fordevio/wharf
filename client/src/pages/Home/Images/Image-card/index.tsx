import React from 'react';
import './index.css';
import { Image } from '../../../../models/image';
import { deleteImagge } from '../../../../api/image';

interface Props {
  image: Image;
  images: Image[];
  setImages: (newImages: Image[]) => void;
}

const ImageCard: React.FC<Props> = ({ image, images, setImages }) => {
    const [force, setForce] = React.useState<boolean>(false);
    const [pruneChildren, setPruneChildren] = React.useState<boolean>(false);
    const deleteIm = async () => {
        try {
        const token = localStorage.getItem('token') as string;
        const res = await deleteImagge(token, image.Id, true, true);
        setImages(images.filter(img => img.Id !== image.Id));
        return res.data;
        } catch (e: any) {
        throw e.response ? e.response.data : { error: 'Request failed' };
        }
    };

    const deleteHandler = async () => {

    }
  return (
    <div className="cont-card">
      <div className="name">{image.RepoTags}</div>
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
       <button className="btn" onClick={deleteHandler}>Delete</button>
    </div>
<div>

</div>
    </div>
  );
};

export default ImageCard;
