import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CryptoJS from 'crypto-js';
import './Login.css';
import Popup from './Popup';
import axios from 'axios';
const Login = () => {
  const [uname, setuname] = useState();
  const [pass, setpass] = useState('');
  const [warning, setWarning] = useState();
  const [passwarning, setPassWarning] = useState();
  const [popup, setPopup] = useState(false);
  const [errorPopupMsg, setErrorPopupMsg] = useState("");
  const [successPopupMsg, setSuccessPopupMsg] = useState("");
  const [result, setResult] = useState(null);

  const key = 'mySecretKey';
  const iv = 'mySecretIV';
  const encryptedPass = CryptoJS.DES.encrypt(pass, key, {iv}).toString()
  const decryptedPass = CryptoJS.DES.decrypt(encryptedPass, key, {iv}).toString()
  const encryptedUname = CryptoJS.DES.encrypt(uname, key, {iv}).toString()
  const decryptedUname = CryptoJS.DES.decrypt(encryptedUname, key, {iv}).toString()

  const loginUser = async () => {
    try {
      let res = await axios.get("http://127.0.0.1:8000/users");
      console.log("res",res);
      let result = res.data;
      setResult(result);
      console.log("result:",result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loginUser();
  }, []);
  const navigate = useNavigate();
  
  const login = (details) => {
    console.log("details",details);
    console.log("result", result);
    
    result.map((item) => {      
      const decryptedPassword = CryptoJS.DES.decrypt(item.password, key, {iv}).toString();
      const decryptedUsername = CryptoJS.DES.decrypt(item.username, key, {iv}).toString();
      if (decryptedUname == decryptedUsername && decryptedPass == decryptedPassword) {
        console.log("logged in");
        navigate('/dashboard');
        setuname('');
        setpass('');
        setPopup(true)
        setSuccessPopupMsg("Login Successfull!")
        setTimeout(() => {
          setPopup(false);
          setSuccessPopupMsg("")
        }, 3000);
        
        
      }else{
        setPopup(true);
        setErrorPopupMsg("Login Error")
        
        setTimeout(() => {
          setPopup(false);
          setErrorPopupMsg("")
      }, 3000);
      setuname('');
      setpass('');
      }
    });
  };

  useEffect(() => {
    if (uname === `'` && `"`) {
      setWarning('Lenght must be 2 or more characters');
    } else {
      setWarning(' ');
    }
  }, [uname]);
  useEffect(() => {
    if (pass === `'`) {
      setPassWarning('Lenght must be 2 or more characters');
    } else {
      setPassWarning(' ');
    }
  }, [pass]);

  return (
    <div className='loginFormHolder'>
      {popup && <Popup errorPopupMsg={errorPopupMsg} successPopupMsg={successPopupMsg} />}
      <div className='loginForm'>
        <h1>Login</h1>
        <input
          onChange={(e) => setuname(e.target.value)}
          value={uname}
          className={uname === `'` ? 'err' : 'noerr'}
          placeholder='Username'
          type='text'
        />
        {warning && <p>{warning}</p>}
        <input
          onChange={(e) => setpass(e.target.value)}
          value={pass}
          className={pass === `'` ? 'err' : 'noerr'}
          placeholder='password'
          type='password'
        />
        {passwarning && <p>{passwarning}</p>}
        <button onClick={login} className='login'>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
