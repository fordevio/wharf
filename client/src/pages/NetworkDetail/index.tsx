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

import { Link, useParams } from 'react-router-dom';
import './index.css';
import { useState } from 'react';
import { NetworkResource } from '../../models/network';
import { getAllNetworks } from '../../api/network';
import { useQuery } from 'react-query';

const NetworkDetail = () => {
  const { id } = useParams();
  const [network, setNetwork] = useState<NetworkResource | null>(null);
  const fetchNetwork = async () => {
    try {
      const res = await getAllNetworks(localStorage.getItem('token') as string);
      for (const net of res.data) {
        if (net.Id === id) {
          setNetwork(net);
          return;
        }
      }
    } catch (e) {
      console.log(e);
      return;
    }
  };

  useQuery('network' + id, fetchNetwork, {
      retry: false,
    });
 
  if (network === null) {
    return <></>;
  }
  return (
    <>
      <div className="back-button-container">
        <button
          className="btn back-button"
          onClick={() => window.history.back()}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>
      <div className="network-detail">
        <h2>Network Detail</h2>
        <p>
          <strong>ID:</strong> {network.Id}
        </p>
        <p>
          <strong>Name:</strong> {network.Name}
        </p>
        <p>
          <strong>Created:</strong> {new Date(network.Created).toLocaleString()}
        </p>
        <p>
          <strong>Scope:</strong> {network.Scope}
        </p>
        <p>
          <strong>Driver:</strong> {network.Driver}
        </p>
        <p>
          <strong>Enable IPv6:</strong> {network.EnableIPv6 ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Internal:</strong> {network.Internal ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Attachable:</strong> {network.Attachable ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Ingress:</strong> {network.Ingress ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Config Only:</strong> {network.ConfigOnly ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Config From:</strong> {network.ConfigFrom?.Network}
        </p>

        <h3>Labels</h3>
        {Object.keys(network.Labels ?? {}).length > 0 ? (
          <ul>
            {Object.entries(network.Labels).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        ) : (
          <p>No labels</p>
        )}

        <h3>Options</h3>
        {Object.keys(network.Options ?? {}).length > 0 ? (
          <ul>
            {Object.entries(network.Options).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        ) : (
          <p>No options</p>
        )}

        <h3>IPAM</h3>
        <p>
          <strong>Driver:</strong> {network.IPAM.Driver}
        </p>
        <h4>IPAM Options</h4>
        <ul>
          {Object.entries(network.IPAM.Options ?? {}).map(([k, v]) => (
            <li key={k}>
              <strong>{k}:</strong> {v}
            </li>
          ))}
        </ul>
        <h4>IPAM Config</h4>
        <ul>
          {network.IPAM.Config.map((cfg, i) => (
            <li key={i}>{JSON.stringify(cfg)}</li>
          ))}
        </ul>

        <h3>Containers</h3>
        <ul>
          {Object.entries(network.Containers ?? {}).map(([id, container]) => (
            <li key={id}>
              <p>
                <strong>{container.Name}</strong> ({id})
              </p>
              <p>EndpointID: {container.EndpointID}</p>
              <p>MAC: {container.MacAddress}</p>
              <p>IPv4: {container.IPv4Address}</p>
              <p>IPv6: {container.IPv6Address}</p>
            </li>
          ))}
        </ul>

        {network.Peers && (
          <>
            <h3>Peers</h3>
            <ul>
              {network.Peers.map((peer, index) => (
                <li key={index}>
                  <strong>{peer.Name}</strong>: {peer.IP}
                </li>
              ))}
            </ul>
          </>
        )}

        {network.Services && (
          <>
            <h3>Services</h3>
            {Object.entries(network.Services).map(([serviceName, svc]) => (
              <div key={serviceName}>
                <p>
                  <strong>{serviceName}</strong>
                </p>
                <p>VIP: {svc.VIP}</p>
                <p>Ports: {svc.Ports.join(', ')}</p>
                <p>LB Index: {svc.LocalLBIndex}</p>
                <p>Tasks: {svc.Tasks.length}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <div className='network-actions'>
        <Link className="btn detail" to={'/network/edit/' + network.Id}>
          Edit
        </Link>
      </div>
    </>
  );
};

export default NetworkDetail;
