import { useEffect, useState } from 'react';
import './index.css';
import toast from 'react-hot-toast';
import { getAllImages, pruneImages } from '../../../api/image';
import { Image } from '../../../models/image';
import ImageCard from './Image-card';

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

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      <div className="prune-btn">
        <button onClick={pruneHandler} className="btn">
          Prune Images
        </button>
      </div>
      <div className="card-container">
        {images.map((image, index) => {
          return (
            <ImageCard
              key={index}
              image={image}
              images={images}
              setImages={setImages}
            />
          );
        })}
      </div>
    </>
  );
};

export default Images;
