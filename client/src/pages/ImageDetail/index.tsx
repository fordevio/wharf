import { useParams } from 'react-router-dom';
import './index.css';
import { getAllImages } from '../../api/image';
import { Image } from '../../models/image';
import { useEffect, useState } from 'react';
import { formatBytes } from '../../utils/util';

const ImageDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState<Image | null>(null);
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

  useEffect(() => {
    fetchImage();
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
      </div>
    </>
  );
};

export default ImageDetail;
