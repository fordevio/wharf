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
import { hostUrl } from '../utils/util';
import {
  ContainerCreateRequest,
  ContainersPruneReport,
  CreateResponse,
  DockerContainer,
  LabelsUpdateResponse,
} from '../models/container';
import { MessageRes } from '../models/common';

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

export const pruneContainers = async (
  token: string
): Promise<AxiosResponse<ContainersPruneReport>> => {
  const url = URL + '/api/protected/container/prune';
  const res = await axios.delete<ContainersPruneReport>(url, {
    headers: { Token: token },
  });
  return res;
};

export const containerStats = async (
  token: string,
  id: string
): Promise<AxiosResponse<string>> => {
  const url = URL + '/api/protected/container/stats/' + id;

  const res = await axios.get<string>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const containerLogs = async (
  token: string,
  id: string
): Promise<AxiosResponse<string>> => {
  const url = URL + '/api/protected/container/logs/' + id;

  const res = await axios.get<string>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const containerCreate = async (
  token: string,
  containerCreateRequest: ContainerCreateRequest
): Promise<AxiosResponse<CreateResponse>> => {
  const url = URL + '/api/protected/container/create';
  const res = await axios.post<CreateResponse>(url, containerCreateRequest, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const containerLabelsUpdate = async (
  token: string, 
  id: string,
  labels: Record<string, string>
): Promise<AxiosResponse<LabelsUpdateResponse>> => {
  const url = URL + '/api/protected/container/updateLabels/' + id;
  const res = await axios.put<LabelsUpdateResponse>(url, { labels }, {
    headers: {
      Token: token,
    },
  });
  return res;
}