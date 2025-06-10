import axios, { AxiosResponse } from 'axios';
import { hostUrl } from '../utils/util';
import { Volume, VolumesPruneReport } from '../models/volume';
import { MessageRes } from '../models/common';

const URL = hostUrl();

export const getAllVolumes = async (
  token: string
): Promise<AxiosResponse<Volume[]>> => {
  const url = URL + '/api/protected/volume/getAll';
  const res = await axios.get<Volume[]>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const deleteVolume = async (
  token: string,
  id: string,
  force: boolean
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/volume/delete/' + id;
  const res = await axios.delete<MessageRes>(url, {
    data: {
      force: force,
    },
    headers: {
      Token: token,
    },
  });
  return res;
};

export const pruneVolumes = async (
  token: string
): Promise<AxiosResponse<VolumesPruneReport>> => {
  const url = URL + '/api/protected/volume/prune';
  const res = await axios.delete<VolumesPruneReport>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const createVolume = async (
  token: string,
  name: string,
  labels?: Record<string, string>
): Promise<AxiosResponse<Volume>> => {
  const url = URL + '/api/protected/volume/create';
  const res = await axios.post<Volume>(
    url,
    {
      name: name,
      labels: labels,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};
