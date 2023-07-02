import React, { useState, useEffect } from "react";
import CryptoJS from 'crypto-js';
import axios from "axios";
import { useNavigate } from "react-router";
import "./Register.css";
import qs from "qs";
const Register = () => {
  const [uname, setuname] = useState("");
  const [warning, setWarning] = useState();
  const [pass, setpass] = useState("");
  const [passwarning, setPassWarning] = useState();
  const [confirmPass, setConfirmPass] = useState("");
  const [confirmPassWarn, setConfirmPassWarn] = useState("");
  const navigate = useNavigate();
  const values = [
    ``,
    `\``,
    `/`,
    `//`,
    `' or "`,
    `-- or #`,
    `' OR '1`,
    `' OR 1 -- -`,
    `" OR "" = "`,
    `" OR 1 = 1 -- -`,
    `' OR '' = '`,
    `'=`,
    `'LIKE`,
    `'=0--+`,
    ` OR 1=1`,
    `' OR 'x'='x`,
    `' AND id IS NULL; --`,
    `'''''''''''''UNION SELECT '2`,
    `%00`,
    `/*...*/`,
  ];
  const key = 'mySecretKey';
  const iv = 'mySecretIV';
  const encryptedPass = CryptoJS.DES.encrypt(pass, key).toString()
  const encryptedUname = CryptoJS.DES.encrypt(uname, key).toString()
  // const [hashValue, setHashValue] = useState('');

  const onSubmit = async () => {
    if (uname) {
      if (pass) {
        if (confirmPass) {
          try {
            const resp = await axios.post("http://127.0.0.1:8000/register", {
              username: encryptedUname,
              password: encryptedPass,
            });
            console.log(resp.data);
            navigate("/login");
          } catch (err) {
            console.log(err.response);
          }
        }
      }
    }
  };
  // const onSubmit = async () => {
  //   console.log("chal rha hai");
  //   try{
  //     const resp = await axios.post("http://127.0.0.1:8000/register",{ username: encryptedUname, password: encryptedPass });
  //     console.log(resp.data);
  //     navigate('/login');

  //   }catch(err){
  //     console.log(err.response)
  //   }
  //   };

  useEffect(() => {
    if (uname === `'`) {
      setWarning("malicious code detected!");
    } else if (uname.length < 8 || uname.length > 20) {
      setWarning("Lenght must be min 8 and max 20 characters!");
    } else {
      setWarning(" ");
    }
  }, [uname]);
  useEffect(() => {
    if (pass === `'`) {
      setPassWarning("malicious code detected!");
    } else if (pass.length > 8 || pass.length < 8) {
      setPassWarning("Length must 8 characters only");
    } else {
      setPassWarning(" ");
    }
  }, [pass]);
  useEffect(() => {
    if (confirmPass !== pass) {
      setConfirmPassWarn("Password does not match");
    } else {
      setConfirmPassWarn(" ");
    }
  }, [confirmPass]);

  return (
    <div className="registerFormHolder">
      <div className="registerForm">
        <h1>Register</h1>

        <input
          className={uname === `'` ? "err" : "noerr"}
          //   onChange={(e) => setuname(e.target.value)}
          onChange={(e) => setuname(e.target.value)}
          value={uname}
          placeholder="Username"
          type="text"
          required
        />
        {warning && <p>{warning}</p>}
        <input
          className={pass === `'` ? "err" : "noerr"}
          onChange={(e) => setpass(e.target.value)}
          value={pass}
          placeholder="Password"
          type="password"
          required
        />
        {passwarning && <p>{passwarning}</p>}
        <input
          className={confirmPass === `'` ? "err" : "noerr"}
          onChange={(e) => setConfirmPass(e.target.value)}
          value={confirmPass}
          placeholder="Confirm-password"
          type="password"
          required
        />
        {confirmPassWarn && <p>{confirmPassWarn}</p>}
        <button onClick={onSubmit} className="register">
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
