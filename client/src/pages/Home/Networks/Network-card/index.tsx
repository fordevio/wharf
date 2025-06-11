import React, { useState } from 'react';
import { Volume } from '../../../../models/volume';
import { Link } from 'react-router-dom';
import { deleteVolume } from '../../../../api/volume';
import toast from 'react-hot-toast';
import { NetworkResource } from '../../../../models/network';
import { deleteNetwork } from '../../../../api/network';

interface Props {
  network: NetworkResource;
  networks: NetworkResource[];
  setNetworks: (newNets: NetworkResource[]) => void;
}

const NetworkCard: React.FC<Props> = ({ network, networks, setNetworks }) => {
  if (
    network.Name == 'none' ||
    network.Name == 'host' ||
    network.Name == 'bridge'
  ) {
    return <></>;
  }
  const delNet = async () => {
    try {
      const res = await deleteNetwork(
        localStorage.getItem('token') as string,
        network.Id
      );
      setNetworks(networks.filter(net => net.Id !== network.Id));
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const deleteHandler = async () => {
    toast.promise(delNet(), {
      loading: 'Deleting volume...',
      success: data => {
        return `Volume deleted successfully!`;
      },
      error: err => {
        return err.error;
      },
    });
  };
  return (
    <>
      <div className="cont-card">
        <div className="name">{network.Name}</div>

        <div className="content">
          <span className="label">Created: </span>{' '}
          <span className="label">
            {network.Created && new Date(network.Created).toString()}
          </span>
        </div>
        <div className="content">
          <span className="label">Driver: </span>{' '}
          <span className="label">{network.Driver}</span>
        </div>
        <div className="content">
          <button className="btn detail" onClick={deleteHandler}>
            Delete
          </button>
          <Link className="btn detail" to={'/network/' + network.Id}>
            Details
          </Link>
        </div>
      </div>
    </>
  );
};

export default NetworkCard;
