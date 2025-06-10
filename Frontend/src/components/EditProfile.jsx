import React, { use, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [about, setAbout] = useState(user?.about || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setError("");
    try {
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          about,
          age,
          gender,
          photoUrl,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(response?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      setError(`${error?.status} : ${error?.response?.data}`);
    }
  };

  return (
    <>
      <div className="card bg-base-100 image-full w-96 shadow-xl">
        <figure>
          <img
            src="https://imgs.search.brave.com/Pb42UmzbDdOap3Cjpwb3Rq73291AP32HkdLXPv_AZ5s/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTQy/NzE0MzUyMy9waG90/by90d28tZGV2ZWxv/cGVyLWNvbXB1dGVy/LXByb2dyYW1tZXIt/d29ya2luZy10b2dl/dGhlci1jb2Rpbmct/b24tbGFwdG9wLWNv/bXB1dGVyLWF0LWhv/bWUtb2ZmaWNlLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1G/Wm5FSTk3OExUU0Mt/eDNvTHV5X0s0YWox/YzNUUmJzTlhxWDRH/Wk9vOE9VPQ"
            alt="Shoes"
          />
        </figure>
        <div className="card-body p-4 flex items-center">
          <div className="flex flex-col gap-8 m-6 mb-2">
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
              LastName:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="grow"
                placeholder="Enter your lastName"
              />
            </label>
            <label className="input border-none flex items-center gap-2">
              About:
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="grow"
                placeholder="about you!!"
              />
            </label>
            <label className="input border-none flex items-center gap-2">
              Gender:
              <div className="flex gap-2">
                <label className="flex items-center gap-1">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-primary rounded-full cursor-pointer">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="hidden"
                    />
                    {gender === "male" && (
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                    )}
                  </div>
                  Male
                </label>
                <label className="flex items-center gap-1">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-primary rounded-full cursor-pointer">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="hidden"
                    />
                    {gender === "female" && (
                      <div className="w-4 h-4 rounded-full bg-secondary"></div>
                    )}
                  </div>
                  Female
                </label>
                <label className="flex items-center gap-1">
                  <div className="flex items-center justify-center w-6 h-6 border-2 border-primary rounded-full cursor-pointer">
                    <input
                      type="radio"
                      value="other"
                      checked={gender === "other"}
                      onChange={(e) => setGender(e.target.value)}
                      className="hidden"
                    />
                    {gender === "other" && (
                      <div className="w-4 h-4 rounded-full bg-accent"></div>
                    )}
                  </div>
                  Other
                </label>
              </div>
            </label>
            <label className="input border-none flex items-center gap-2">
              Age:
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="grow"
                placeholder="Tell me your age!"
              />
            </label>
            <label className="input border-none flex items-center gap-2">
              PhotoUrl:
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="grow"
                placeholder="Enter your photoUrl"
              />
            </label>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="card-actions justify-center">
            <button className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="card glass w-80 flex justify-center items-center">
        <figure className="px-6 pt-6">
          <img className="rounded-xl" src={photoUrl} alt="car!" />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-3xl">
            {firstName + " " + lastName}
          </h2>
          <div className="flex gap-4 text-xl text-yellow-600">
            <h1>{age}</h1>
            <h1>{gender}</h1>
          </div>
          <p className="text-wrap">{about.slice(0, 60)}</p>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully!!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
