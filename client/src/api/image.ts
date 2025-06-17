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
import { DeleteResponse, Image, ImagesPruneReport } from '../models/image';
import { hostUrl } from '../utils/util';
import { MessageRes } from '../models/common';

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
  const url = URL + '/api/protected/image/remove/' + id;
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
