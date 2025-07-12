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

import './index.css';
import wharfLogo from '../../assets/wharf.png';
import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

interface Props {
  id: string;
}

const ContainerNavbar: React.FC<Props> = ({ id }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="con-nav">
      <img src={wharfLogo} className="logo" alt="wharf" />

      <div
        className={`menu ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <Link
            to="/"
            className="link"
            style={currentPath === '/' ? { color: 'blue' } : {}}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to={`/container/${id}`}
            className="link"
            style={currentPath === `/container/${id}` ? { color: 'blue' } : {}}
          >
            Container-Details
          </Link>
        </li>
        <li>
          <Link
            to={`/container/${id}/networks`}
            className="link"
            style={
              currentPath === `/container/${id}/networks`
                ? { color: 'blue' }
                : {}
            }
          >
            Network-Details
          </Link>
        </li>
        <li>
          <Link
            to={`/container/${id}/volumes`}
            className="link"
            style={
              currentPath === `/container/${id}/volumes`
                ? { color: 'blue' }
                : {}
            }
          >
            Volume-Details
          </Link>
        </li>
        <li>
          <Link
            to={`/container/${id}/stats`}
            className="link"
            style={
              currentPath === `/container/${id}/stats` ? { color: 'blue' } : {}
            }
          >
            Stats
          </Link>
        </li>
        <li>
          <Link
            to={`/container/${id}/logs`}
            className="link"
            style={
              currentPath === `/container/${id}/logs` ? { color: 'blue' } : {}
            }
          >
            Logs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ContainerNavbar;
