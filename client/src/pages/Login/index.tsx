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

import { useEffect, useState } from 'react';
import wharfLogo from '../../assets/wharf.png';
import './index.css';
import {
  forgotAdmin,
  isAdminAvailable,
  login,
  registerAdmin,
} from '../../api/login';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [initPassword, setInitPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [adminPass, setAdminPass] = useState<string>('');
  const [adminUname, setAdminUname] = useState<string>('');
  const [forgotPass, setForgotPass] = useState<boolean>(false);
  const navigate = useNavigate();

  const findIsAdmin = async () => {
    try {
      const res = await isAdminAvailable();
      if (res.data.username) {
        setIsAdmin(true);
        return;
      }
    } catch (e) {
      console.log(e);
    }
    setIsAdmin(false);
  };

  useEffect(() => {
    findIsAdmin();
  }, []);

  const adminReg = async () => {
    try {
      await registerAdmin(username, password, initPassword);
      navigate('/');
      return;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const logIn = async () => {
    try {
      const res = await login(username, password);

      localStorage.setItem('token', res.data.token);
      navigate('/');
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const SubmitHandler = async () => {
    if (username === '' || password === '' || confirmPassword === '') {
      if (!isAdmin && initPassword === '') {
        toast.error('Please fill all fields');
        return;
      }

      toast.error('Please fill all fields');
      return;
    }

    if (password.length < 8 || password.length > 20) {
      toast.error('Password must be between 8 and 20 characters');
      return;
    }

    // Check if it contains at least one letter and one number
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;

    const hasLetter = letterRegex.test(password);
    const hasNumber = numberRegex.test(password);

    if (!(hasLetter && hasNumber)) {
      toast.error('Password must contain at least one letter and one number');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match confirm password');
      return;
    }

    if (!isAdmin) {
      toast.promise(adminReg(), {
        loading: 'Registering',
        success: 'Admin Registered',
        error: data => `${data.error}`,
      });
      setIsAdmin(true);
    } else {
      toast.promise(logIn(), {
        loading: 'Loging...',
        success: 'Login successfull',
        error: data => `${data.error}`,
      });
    }
  };

  const forgotFunc = async () => {
    try {
      const res = await forgotAdmin(initPassword);
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const ForgotHandler = async () => {
    if (initPassword === '') {
      toast.error('Please fill all fields');
      return;
    }
    toast.promise(forgotFunc(), {
      loading: 'Loading...',
      success: data => {
        setAdminPass(data.password);
        setAdminUname(data.username);
        return 'Username Password loaded';
      },
      error: data => `${data.error}`,
    });
  };

  return (
    <div className="form-container">
      <div className="logoDiv">
        <img src={wharfLogo} alt="Wharf Logo" className="wharfLogo" />
      </div>
      {!forgotPass && (
        <div className="loginDiv">
          <div className="iDiv">
            <p className="loginH">{isAdmin ? 'Login' : 'Register'}</p>
            {!isAdmin && (
              <div className="inputDiv">
                <span className="label">Init-Password</span>
                <input
                  type="text"
                  onChange={e => setInitPassword(e.target.value)}
                  value={initPassword}
                />
                <p className="p">
                  Init-Password can be found in /var/lib/wharf/wharf.txt
                </p>
              </div>
            )}
            <div className="inputDiv">
              <span className="label">Username</span>
              <input
                onChange={e => setUsername(e.target.value)}
                type="text"
                value={username}
              />
            </div>

            <div className="inputDiv">
              <span className="label">Password</span>
              <input
                type="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="inputDiv">
              <span className="label">Confirm Password</span>
              <input
                type="password"
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            {isAdmin && (
              <p className="forPas" onClick={() => setForgotPass(true)}>
                Forgot Password
              </p>
            )}
            <button onClick={SubmitHandler}>Submit</button>
          </div>
        </div>
      )}
      {forgotPass && (
        <div className="loginDiv">
          <div className="iDiv">
            <p className="loginH"></p>
            <div className="inputDiv">
              <span className="label">Init-Password</span>
              <input
                type="text"
                onChange={e => setInitPassword(e.target.value)}
                value={initPassword}
              />
              <p className="p">
                Init-Password can be found in /var/lib/wharf/wharf.txt
              </p>
            </div>
            {adminUname !== '' && (
              <p>
                <span className="label">Username: </span>{' '}
                <span className="label">{adminUname}</span>
              </p>
            )}
            {adminPass !== '' && (
              <p>
                <span className="label">Password: </span>{' '}
                <span className="label">{adminPass}</span>
              </p>
            )}

            {isAdmin && (
              <p className="forPas" onClick={() => setForgotPass(false)}>
                Login
              </p>
            )}
            <button onClick={ForgotHandler}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
