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

import { User, Eye, EyeOff, Crosshair } from 'lucide-react';
import { useState } from 'react';
import wharfLogo from '../../assets/wharf.svg';
import userIcon from '../../assets/login/user.png';
import vectorImage from '../../assets/login/vector.png';
import './index.css';
import {
  forgotAdmin,
  isAdminAvailable,
  login,
  registerAdmin,
} from '../../api/login';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  useQuery('isAdmin', findIsAdmin, { retry: false });

  const adminReg = async () => {
    try {
      await registerAdmin(username, password, initPassword);
      navigate('/');
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
    if (username === '' || password === '') {
      toast.error('Please fill all fields');
      return;
    }
    if (!isAdmin && (initPassword === '' || confirmPassword === '')) {
      toast.error('Please fill all fields');
      return;
    }

    if (password.length < 8 || password.length > 20) {
      toast.error('Password must be between 8 and 20 characters');
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!(hasLetter && hasNumber)) {
      toast.error('Password must contain at least one letter and one number');
      return;
    }

    if (!isAdmin && password !== confirmPassword) {
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
        loading: 'Logging in...',
        success: 'Login successful',
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
    <div className="login-body">
      <div>
        <div className="logoDiv">
          <img src={wharfLogo} alt="Wharf Logo" className="wharfLogo" />
          <div className="wharf-text">Wharf</div>
        </div>
        <div className="container">
          <div className="wel-text">
            <p>
              Welcome
              <br />
              to wharf.
            </p>
          </div>
          <div className="input-container">
            {isAdmin ? (
              <div className="user-icon-container">
                <img className="user-icon" src={userIcon} alt="user" />
              </div>
            ) : (
              <div className="reg">Register</div>
            )}
            {!forgotPass && (
              <div className="loginDiv">
                <div className="iDiv">
                  {!isAdmin && (
                    <>
                      <div className="inputDiv" tabIndex={0}>
                        <input
                          onChange={e => setInitPassword(e.target.value)}
                          value={initPassword}
                          placeholder="Init-Password"
                        />
                        <Crosshair className="input-icon" />
                      </div>
                      <p className="p">
                        Init-Password can be found in /var/lib/wharf/wharf.txt
                      </p>
                    </>
                  )}
                  <div className="inputDiv" tabIndex={0}>
                    <input
                      onChange={e => setUsername(e.target.value)}
                      value={username}
                      placeholder="Username"
                    />
                    <User className="input-icon" />
                  </div>

                  <div className="inputDiv" tabIndex={0}>
                    <input
                      type={showPassword ? '' : 'password'}
                      onChange={e => setPassword(e.target.value)}
                      value={password}
                      placeholder="Password"
                    />
                    {showPassword ? (
                      <EyeOff
                        className="input-icon eye-icon"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="input-icon eye-icon"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>

                  {!isAdmin && (
                    <div className="inputDiv" tabIndex={0}>
                      <input
                        type="password"
                        onChange={e => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        placeholder="Confirm Password"
                      />
                    </div>
                  )}

                  <button onClick={SubmitHandler} className="login-btn">
                    Submit
                  </button>
                  {isAdmin && (
                    <p className="forPas" onClick={() => setForgotPass(true)}>
                      Forgot Password
                    </p>
                  )}
                </div>
              </div>
            )}
            {forgotPass && (
              <div className="loginDiv">
                <div className="iDiv">
                  {adminUname !== '' && (
                    <p>
                      <span className="label">Username: </span>
                      <span className="label">{adminUname}</span> {' | '}
                      {adminPass !== '' && (
                        <>
                          <span className="label">Password: </span>
                          <span className="label">{adminPass}</span>
                        </>
                      )}
                    </p>
                  )}

                  <div className="inputDiv">
                    <input
                      onChange={e => setInitPassword(e.target.value)}
                      value={initPassword}
                      placeholder="Init-Password"
                      tabIndex={0}
                    />
                    <Crosshair className="input-icon" />
                  </div>
                  <p className="p">
                    Init-Password can be found in /var/lib/wharf/wharf.txt
                  </p>

                  <button onClick={ForgotHandler} className="login-btn">
                    Submit
                  </button>
                  {isAdmin && (
                    <p className="forPas" onClick={() => setForgotPass(false)}>
                      Login
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <img src={vectorImage} className="vector-image" alt="vector" />
    </div>
  );
};

export default Login;
