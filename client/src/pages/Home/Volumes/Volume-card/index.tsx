import React, { useState } from 'react';
import { Volume } from '../../../../models/volume';

interface Props {
  volume: Volume;
  volumes: Volume[];
  setVolumes: (newVolumes: Volume[]) => void;
}

const VolumeCard: React.FC<Props> = ({ volume, volumes, setVolumes }) => {
  useState(() => {
    console.log('VolumeCard mounted with volume:', volume);
  });
  return (
    <div className="cont-card">
      <div className="name">{volume.Name}</div>

      <div className="content">
        <span className="label">Created: </span>{' '}
        <span className="label">
          {volume.CreatedAt && new Date(volume.CreatedAt).toString()}
        </span>
      </div>
      <div className="content">
        <span className="label">Driver: </span>{' '}
        <span className="label">{volume.Driver}</span>
      </div>
      <div className="content">
        <span className="label">Mounts: </span>{' '}
        <span className="label">{volume.Mountpoint}</span>
      </div>
    </div>
  );
};

export default VolumeCard;
