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
  const url = URL + '/api/protected/volume/remove/' + id;
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
  name: string
): Promise<AxiosResponse<Volume>> => {
  const url = URL + '/api/protected/volume/create';
  const res = await axios.post<Volume>(
    url,
    {
      name: name,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};
