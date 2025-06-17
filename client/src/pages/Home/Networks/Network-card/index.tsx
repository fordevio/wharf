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

import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { NetworkResource } from '../../../../models/network';
import { deleteNetwork } from '../../../../api/network';

interface Props {
  network: NetworkResource;
  networks: NetworkResource[];
  setNetworks: (newNets: NetworkResource[]) => void;
}

const NetworkCard: React.FC<Props> = ({ network, networks, setNetworks }) => {
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
