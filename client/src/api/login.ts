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

import axios from 'axios';
import { hostUrl } from '../utils/util';
import { AxiosResponse } from 'axios';
import {
  AdminPasswordRes,
  IsAdminAvailableRes,
  LoginRes,
} from '../models/login';

const URL = hostUrl();

export const isAdminAvailable = async (): Promise<
  AxiosResponse<IsAdminAvailableRes>
> => {
  const url = URL + '/api/auth/isAdmin';
  const res = await axios.get<IsAdminAvailableRes>(url);
  return res;
};

export const registerAdmin = async (
  username: string,
  password: string,
  initPass: string
) => {
  const url = URL + '/api/auth/init';
  const res = await axios.post(url, {
    password: password,
    initPassword: initPass,
    username: username,
  });
  return res;
};

export const login = async (
  username: string,
  password: string
): Promise<AxiosResponse<LoginRes>> => {
  const url = URL + '/api/auth/login';
  const res = await axios.post<LoginRes>(url, {
    username: username,
    password: password,
  });
  return res;
};

export const forgotAdmin = async (
  initPass: string
): Promise<AxiosResponse<AdminPasswordRes>> => {
  const url = URL + '/api/auth/getAdminPassword';
  const res = await axios.post<AdminPasswordRes>(url, {
    initPassword: initPass,
  });
  return res;
};
