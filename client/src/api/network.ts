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

import axios, { AxiosResponse } from 'axios';
import {
  LabelsUpdateResponse,
  NetworkCreateResponse,
  NetworkResource,
  NetworksPruneReport,
} from '../models/network';
import { hostUrl } from '../utils/util';
import { MessageRes } from '../models/common';

const URL = hostUrl();

export const getAllNetworks = async (
  token: string
): Promise<AxiosResponse<NetworkResource[]>> => {
  const url = URL + '/api/protected/network/getAll';
  const res = await axios.get<NetworkResource[]>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const pruneNetworks = async (
  token: string
): Promise<AxiosResponse<NetworksPruneReport>> => {
  const url = URL + '/api/protected/network/prune';
  const res = await axios.delete<NetworksPruneReport>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const deleteNetwork = async (
  token: string,
  id: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/network/remove/' + id;
  const res = await axios.delete<MessageRes>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const createNetwork = async (
  token: string,
  name: string,
  driver: string
): Promise<AxiosResponse<NetworkCreateResponse>> => {
  const url = URL + '/api/protected/network/create';
  const res = await axios.post<NetworkCreateResponse>(
    url,
    {
      name: name,
      driver: driver,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const connectContainerToNetwork = async (
  token: string,
  networkId: string,
  containerId: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/network/connect/' + networkId;
  const res = await axios.put<MessageRes>(
    url,
    {
      containerId: containerId,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const disconnectContainerFromNetwork = async (
  token: string,
  networkId: string,
  containerId: string,
  force: boolean
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/network/disconnect/' + networkId;
  const res = await axios.put<MessageRes>(
    url,
    {
      containerId: containerId,
      force: force,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const networkLabelsUpdate = async (
  token: string,
  id: string,
  labels: Record<string, string>
): Promise<AxiosResponse<LabelsUpdateResponse>> => {
  const url = URL + '/api/protected/container/updateLabels/' + id;
  const res = await axios.put<LabelsUpdateResponse>(
    url,
    { labels },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};
