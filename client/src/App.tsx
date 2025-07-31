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

import Login from './pages/Login';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { getUser } from './api/user';
import Containers from './pages/Index/Containers';
import Imges from './pages/Index/Images';
import Volumes from './pages/Index/Volumes';
import Networks from './pages/Index/Networks';
import Users from './pages/Index/Users';

import { useQuery } from 'react-query';
import ContainerInside from './pages/ContainerInside';
import ContainerDetail from './pages/ContainerInside/Detail';
import ContainerVolumes from './pages/ContainerInside/Volume';
import ContainerNetworks from './pages/ContainerInside/Network';
import ContainerStats from './pages/ContainerInside/Stats';
import ContainerLogs from './pages/ContainerInside/Logs';
import ContainerCreate from './pages/ContainerCreate';
import VolumeCreate from './pages/VolumeCreate';
import ImageDetail from './pages/ImageDetail';
import VolumeDetail from './pages/VolumeDetail';
import NetworkDetail from './pages/NetworkDetail';
import NetworkCreate from './pages/NetworkCreate';
import ContainerUpdate from './pages/ContainerUpdate';
import NetworkUpdate from './pages/NetworkUpdate';
import Index from './pages/Index';
import Home from './pages/Index/Home';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const isLogin = async () => {
    const token = localStorage.getItem('token');
    if (token == null) {
      if (currentPath !== '/login') {
        navigate('/login');
      }
      return;
    }
    try {
      await getUser(token);
      if (currentPath === '/login') {
        navigate('/');
      }
    } catch (e) {
      if (currentPath !== '/login') {
        navigate('/login');
      }
    }
  };

  useQuery('user', isLogin, {
    retry: false,
  });

  return (
    <>
      <Toaster />
      
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<Home />} />
          <Route path="images" element={<Imges />} />
          <Route path="volumes" element={<Volumes />} />
          <Route path="networks" element={<Networks />} />
          <Route path="containers" element={<Containers />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/container/:id" element={<ContainerInside />}>
          <Route index element={<ContainerDetail />} />
          <Route path="volumes" element={<ContainerVolumes />} />
          <Route path="networks" element={<ContainerNetworks />} />
          <Route path="stats" element={<ContainerStats />} />
          <Route path="logs" element={<ContainerLogs />} />
        </Route>
        <Route path="/container/create" element={<ContainerCreate />} />
        <Route path="/container/update/:id" element={<ContainerUpdate />} />
        <Route path="/volume/create" element={<VolumeCreate />} />
        <Route path="/network/create" element={<NetworkCreate />} />
        <Route path="/image/:id" element={<ImageDetail />} />
        <Route path="/volume/:id" element={<VolumeDetail />} />
        <Route path="/network/:id" element={<NetworkDetail />} />
        <Route path="/network/edit/:id" element={<NetworkUpdate />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
