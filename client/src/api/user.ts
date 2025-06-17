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
import { GetUserRes, User } from '../models/user';

const URL = hostUrl();

export const getUser = async (
  token: string
): Promise<AxiosResponse<GetUserRes>> => {
  const url = URL + '/api/protected/user/get';
  const res = await axios.get<GetUserRes>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const getAllUser = async (
  token: string
): Promise<AxiosResponse<User[]>> => {
  const url = URL + '/api/protected/user/getAll';
  const res = await axios.get<User[]>(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};

export const createUser = async (
  token: string,
  username: string,
  permission: string,
  password: string
): Promise<AxiosResponse<User>> => {
  const url = URL + '/api/protected/user/create';
  const res = await axios.post<User>(
    url,
    {
      username: username,
      permission: permission,
      password: password,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const updateUser = async (
  token: string,
  userId: number,
  username: string,
  permission: string,
  password: string
): Promise<AxiosResponse<User>> => {
  const url = `${URL}/api/protected/user/update/${userId}`;
  const res = await axios.put<User>(
    url,
    {
      username: username,
      permission: permission,
      password: password,
    },
    {
      headers: {
        Token: token,
      },
    }
  );
  return res;
};

export const deleteUser = async (token: string, userId: number) => {
  const url = `${URL}/api/protected/user/delete/${userId}`;
  const res = await axios.delete(url, {
    headers: {
      Token: token,
    },
  });
  return res;
};
