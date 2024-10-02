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

export const renameContainer = async (
  token: string,
  id: string,
  name: string
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/container/rename/' + id;
  const res = await axios.put<MessageRes>(
    url,
    {
      newName: name,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const removeContainer = async (
  token: string,
  id: string,
  force: boolean,
  removeVolumes: boolean
): Promise<AxiosResponse<MessageRes>> => {
  const url = URL + '/api/protected/container/remove/' + id;
  const res = await axios.delete<MessageRes>(url, {
    data: {
      force: force,
      removeVolumes: removeVolumes,
    },
    headers: {
      Token: token,
    },
  });
  return res;
};
