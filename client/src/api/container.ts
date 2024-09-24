import axios, { AxiosResponse } from 'axios';
import { hostUrl } from '../utils/util';
import { DockerContainer, MessageRes } from '../models/container';

const URL = hostUrl();

export const getAllContainers = async (
  token: string
): Promise<AxiosResponse<DockerContainer[]>> => {
  const url = URL + '/api/protected/container/getAll';
  const res = await axios.get<DockerContainer[]>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const stopContainer = async (
  token: string,
  id: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/container/stop/' + id;
  const res = await axios.put<MessageRes>(
    url,
    {},
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const startContainer = async (
  token: string,
  id: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/container/start/' + id;
  const res = await axios.put<MessageRes>(
    url,
    {},
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const pauseContainer = async (
  token: string,
  id: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/container/pause/' + id;
  const res = await axios.put<MessageRes>(
    url,
    {},
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const unpauseContainer = async (
  token: string,
  id: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/container/unpause/' + id;
  const res = await axios.put<MessageRes>(
    url,
    {},
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};
