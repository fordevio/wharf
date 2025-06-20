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

import { useState } from 'react';
import { User } from '../../../../models/user';
import './index.css';
import { deleteUser, updateUser } from '../../../../api/user';
import toast from 'react-hot-toast';

interface Prop {
  user: User;
  users: User[];
  setUsers: (newUsers: User[]) => void;
}

const ContainerCard: React.FC<Prop> = ({ user, setUsers, users }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(user.username);
  const [password, setPassword] = useState<string>(user.password);
  const [permissions, setPermissions] = useState<string>(user.permissions);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const permissionRename = () => {
    if (user.permissions === 'x') {
      return 'execute';
    } else if (user.permissions === 'w') {
      return 'write';
    }
    return 'read';
  };

  const deleteFunc = async () => {
    try {
      await deleteUser(localStorage.getItem('token') as string, user.id);
      const newUsers = users.filter(u => u.id !== user.id);
      setUsers(newUsers);
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const delete_handler = async () => {
    toast.promise(deleteFunc(), {
      loading: 'Deleting...',
      success: 'User deleted',
      error: data => data.error,
    });
  };

  const editFunc = async () => {
    try {
      const res = await updateUser(
        localStorage.getItem('token') as string,
        user.id,
        username,
        permissions,
        password
      );
      const newUsers = users.map(u => {
        if (u.id === user.id) {
          return res.data;
        }
        return u;
      });
      setUsers(newUsers);
      setOpen(false);
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const edit_user = async () => {
    if (username === '' || password === '' || permissions === '') {
      toast.error('All fields are required');
      return;
    }
    if (permissions !== 'x' && permissions !== 'w' && permissions !== 'r') {
      toast.error('Invalid permission');
      return;
    }
    toast.promise(editFunc(), {
      loading: 'Updating...',
      success: 'User updated',
      error: data => data.error,
    });
  };

  return (
    <>
      <div className="user-card">
        <div className="content">
          <span className="label">Username: </span>{' '}
          <span className="label">{user.username}</span>
        </div>
        <div className="content">
          <span className="label">Password: </span>{' '}
          <span className="label" style={{ display: "inline-flex", alignItems: "center" }}>
            {showPassword ? user.password : "•".repeat(user.password.length || 8)}
            <span
              className="eye-icon"
              onClick={() => setShowPassword(v => !v)}
              style={{ marginLeft: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? (
                // Eye-slash SVG (Hide)
                <svg width="1em" height="1em" viewBox="0 0 576 512" fill="currentColor">
                  <path d="M320,256a64,64,0,1,1-64-64A64.07,64.07,0,0,1,320,256Zm189.81,9.42C460.86,364.89,363.6,426.67,256,426.67S51.14,364.89,2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.14,147.11,148.4,85.33,256,85.33s204.86,61.78,253.81,161.25A21.33,21.33,0,0,1,509.81,265.42ZM362.67,256A106.67,106.67,0,1,0,256,362.67,106.79,106.79,0,0,0,362.67,256Z"/>                
                </svg>
              ) : (
                // Eye SVG (Show)
                <svg width="1em" height="1em" viewBox="0 0 576 512" fill="currentColor">
                  <path d="M409.84,132.33l95.91-95.91A21.33,21.33,0,1,0,475.58,6.25L6.25,475.58a21.33,21.33,0,1,0,30.17,30.17L140.77,401.4A275.84,275.84,0,0,0,256,426.67c107.6,0,204.85-61.78,253.81-161.25a21.33,21.33,0,0,0,0-18.83A291,291,0,0,0,409.84,132.33ZM256,362.67a105.78,105.78,0,0,1-58.7-17.8l31.21-31.21A63.29,63.29,0,0,0,256,320a64.07,64.07,0,0,0,64-64,63.28,63.28,0,0,0-6.34-27.49l31.21-31.21A106.45,106.45,0,0,1,256,362.67ZM2.19,265.42a21.33,21.33,0,0,1,0-18.83C51.15,147.11,148.4,85.33,256,85.33a277,277,0,0,1,70.4,9.22l-55.88,55.88A105.9,105.9,0,0,0,150.44,270.52L67.88,353.08A295.2,295.2,0,0,1,2.19,265.42Z"/>
                </svg>
              )}
            </span>
          </span>
        </div>
        <div className="content">
          <span className="label">Permission: </span>{' '}
          <span className="label">{permissionRename()}</span>
        </div>
        <div className="content">
          <span className="label">Admin: </span>{' '}
          <span className="label">{user.isAdmin ? 'true' : 'false'}</span>
        </div>
        <div className="content">
          <button className="btn" onClick={() => setOpen(true)}>
            Edit
          </button>
          {!user.isAdmin && (
            <button className="btn" onClick={delete_handler}>
              Delete
            </button>
          )}
        </div>
      </div>
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={open ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpen(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Permission"
              value={permissions}
              onChange={e => setPermissions(e.target.value)}
            /> 
            <p>x -execute | w -write | r -read</p>
            <button className="submit" onClick={edit_user}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerCard;