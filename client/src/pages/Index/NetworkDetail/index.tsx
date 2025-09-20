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
import { useState } from 'react';
import { NetworkResource } from '../../../models/network';
import { deleteNetwork, getAllNetworks } from '../../../api/network';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { Trash, Pencil } from 'lucide-react';
import netIcon from '../../../assets/common/network.png';
import { convertToDateTime } from '../../../utils/util';

const NetworkDetail = () => {
  const navigate = useNavigate();
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

  const delNet = async () => {
    if (!network) {
      return;
    }
    try {
      const res = await deleteNetwork(
        localStorage.getItem('token') as string,
        network.Id
      );

      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const deleteHandler = async () => {
    toast.promise(delNet(), {
      loading: 'Deleting network...',
      success: () => {
        navigate('/networks');
        return `network deleted successfully!`;
      },
      error: err => {
        return err.error;
      },
    });
  };

  useQuery('network' + id, fetchNetwork, {
    retry: false,
  });

  if (network === null) {
    return <></>;
  }
  return (
    <div className="page">
      <div className="net-det">
        <div className="net-det-h">
          <img src={netIcon} alt="" className="net-det-hd-img" />{' '}
          <span className="net-det-hd">Network Details</span>
          <div className="net-det-buts">
            <button
              className="det-btn del-btn"
              onClick={() => navigate('/network/edit/' + network.Id)}
            >
              <Pencil className="btn-logo" size={20} />
              Edit
            </button>
            <button
              className="det-btn del-btn"
              style={{ background: '#B11010' }}
              onClick={deleteHandler}
            >
              <Trash className="btn-logo" size={20} />
              Delete
            </button>
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Name </div>
          <div className="cont-val"> {network.Name}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Id </div>
          <div className="cont-val"> {network.Id}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Created </div>
          <div className="cont-val">
            {' '}
            {convertToDateTime(new Date(network.Created).getTime() / 1000)}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Scope </div>
          <div className="cont-val"> {network.Scope}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Driver </div>
          <div className="cont-val"> {network.Driver}</div>
        </div>
        <div className="cont-div">
          <div className="cont-key">IPAM Config</div>
          <div className="cont-val">
            {(network.IPAM?.Config ?? []).map((cfg, i) =>
              Object.entries(cfg).map(([key, value]) => (
                <p key={`${i}-${key}`} className="cont-l">
                  {`${key} : ${value},`}
                </p>
              ))
            )}
          </div>
        </div>

        <div className="cont-div">
          <div className="cont-key">Options </div>
          <div className="cont-val">
            {(network.Options instanceof Map
              ? Array.from(network.Options.entries())
              : Object.entries(network.Options ?? {})
            )
              .slice(0, 2)
              .map(([key, value]) => (
                <p key={key} className="cont-l">
                  {` ${key} : ${value}`}
                </p>
              ))}
          </div>
        </div>
        <div className="cont-div">
          <div className="cont-key">Labels </div>
          <div className="cont-val">
            {(network.Labels instanceof Map
              ? Array.from(network.Labels.entries())
              : Object.entries(network.Labels ?? {})
            )
              .slice(0, 2)
              .map(([key, value]) => (
                <p key={key} className="cont-l">
                  {` ${key} : ${value}`}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDetail;
