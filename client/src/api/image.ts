import axios, { AxiosResponse } from 'axios';
import { DeleteResponse, Image, ImagesPruneReport } from '../models/image';
import { hostUrl } from '../utils/util';
import { MessageRes } from '../models/container';

const URL = hostUrl();

export const getAllImages = async (
  token: string
): Promise<AxiosResponse<Image[]>> => {
  const url = URL + '/api/protected/image/getAll';
  const res = await axios.get<Image[]>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const pruneImages = async (
  token: string
): Promise<AxiosResponse<ImagesPruneReport>> => {
  const url = URL + '/api/protected/image/prune';
  const res = await axios.delete<ImagesPruneReport>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const deleteImagge = async (
  token: string,
  id: string,
  force: boolean,
  pruneChildren: boolean
): Promise<AxiosResponse<DeleteResponse[]>> => {
  const url = URL + '/api/protected/image/delete/' + id;
  const res = await axios.delete<DeleteResponse[]>(url, {
    headers: {
      Token: token,
    },
    data: {
      force: force,
      pruneChildren: pruneChildren,
    },
  });
  return res;
};

export const tagImage = async (
  token: string,
  id: string,
  tag: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/image/tag/' + id;
  const res = await axios.put<MessageRes>(
    url,
    {
      tag: tag,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};
