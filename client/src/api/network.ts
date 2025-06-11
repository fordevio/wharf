import axios, { AxiosResponse } from 'axios';
import {
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
