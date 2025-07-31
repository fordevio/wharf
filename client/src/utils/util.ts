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

export const hostUrl = () => {
  const envUrl = process.env.REACT_APP_BACKEND_API;
  if (envUrl) {
    return envUrl;
  }
  let url = window.location.origin;
  if (url === 'http://localhost:3000') {
    return 'http://localhost:9001';
  }
  return url;
};

export const convertToIndianDateTime = (unixTimestamp: number): string => {
  // Convert timestamp to milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Define options for formatting the date and time
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24-hour format
  };

  // Format the date and time
  return date.toLocaleString('en-IN', options);
};

export const formatBytes = (bytes: number) => {
  if (bytes < 0) return 'Not calculated';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};
