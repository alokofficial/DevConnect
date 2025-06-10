import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/login",
        {
          email: emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(response?.data));
      navigate("/");
    } catch (error) {
      setError(`${error?.status} : ${error?.response?.data}`);
    }
  };

  const handleSignup = async ()=>{
    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          email: emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(response?.data.data));
      navigate("/profile");
    } catch (error) {
      setError(`${error?.status} : ${error?.response?.data}`);
    }
  }
  return (
    <div className="card bg-base-100 image-full w-96 shadow-xl mx-auto mt-8">
      <figure>
        <img
          src="https://imgs.search.brave.com/Pb42UmzbDdOap3Cjpwb3Rq73291AP32HkdLXPv_AZ5s/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQy/NzE0MzUyMy9waG90/by90d28tZGV2ZWxv/cGVyLWNvbXB1dGVy/LXByb2dyYW1tZXIt/d29ya2luZy10b2dl/dGhlci1jb2Rpbmct/b24tbGFwdG9wLWNv/bXB1dGVyLWF0LWhv/bWUtb2ZmaWNlLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1G/Wm5FSTk3OExUU0Mt/eDNvTHV5X0s0YWox/YzNUUmJzTlhxWDRH/Wk9vOE9VPQ"
          alt="Image"
          />
      </figure>
      <div className="card-body p-3 flex items-center">
          <h1 className="text-3xl font-bold">{isLoginForm ? "Login" : "Signup"}</h1>
        <div className="flex flex-col gap-8 m-6 mb-2">
          {!isLoginForm && (
            <>
              <label className="input border-none flex items-center gap-2">
                FirstName:
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="grow"
                  placeholder="Enter your firstName"
                />
              </label>
              <label className="input border-none flex items-center gap-2">
                lastName:
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="grow"
                  placeholder="Enter your lastName"
                />
              </label>
            </>
          )}
          <label className="input border-none flex items-center gap-2">
            Email:
            <input
              type="text"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="grow"
              placeholder="Enter your email"
            />
          </label>
          <label className="input border-none flex items-center gap-2">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="grow"
              placeholder="Enter your password"
            />
          </label>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={isLoginForm ? handleLogin : handleSignup}>
            {isLoginForm ? "Login" : "Signup"}
          </button>
        </div>
          <h1 onClick={() => setIsLoginForm(!isLoginForm)}>{isLoginForm ? "New User? Signup Here!" : "Already Account? Login Here!"}</h1>
      </div>
    </div>
  );
};

export default Login;
