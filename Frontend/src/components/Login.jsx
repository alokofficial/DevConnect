import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailId, setEmailId] = useState("simran@gmail.com");
  const [password, setPassword] = useState("Simran!123");
  const navigate = useNavigate();

  const handleLogin = async ()=>{
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email:emailId,
        password,
      },{
        withCredentials: true
      });
      // navigate("/profile")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="card bg-base-100 image-full w-96 shadow-xl mx-auto mt-8">
      <figure>
        <img
          src="https://imgs.search.brave.com/Pb42UmzbDdOap3Cjpwb3Rq73291AP32HkdLXPv_AZ5s/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQy/NzE0MzUyMy9waG90/by90d28tZGV2ZWxv/cGVyLWNvbXB1dGVy/LXByb2dyYW1tZXIt/d29ya2luZy10b2dl/dGhlci1jb2Rpbmct/b24tbGFwdG9wLWNv/bXB1dGVyLWF0LWhv/bWUtb2ZmaWNlLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1G/Wm5FSTk3OExUU0Mt/eDNvTHV5X0s0YWox/YzNUUmJzTlhxWDRH/Wk9vOE9VPQ"
          alt="Shoes"
        />
      </figure>
      <div className="card-body p-4 flex items-center">
        <div className="flex flex-col gap-8 m-6">
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

        <div className="card-actions justify-center">
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
