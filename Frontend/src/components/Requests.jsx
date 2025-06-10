import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../utils/requestSlice";
import UserCard from "./UserCard";

const Requests = () => {
  const dispatch = useDispatch();
  const request = useSelector((store) => store.request);


  const reviewRequest = async (status,_id) => {
    try {
      const response = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(removeRequest(_id))
    } catch (error) {
      console.log(error);
    }
  }
  const fetchRequests = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(response?.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  if (!request) {
    return <h1>Loading...</h1>;
  }
  if (request.length === 0) {
    return <h1 className="text-3xl text-center">No pending requests</h1>;
  }
  return (
    <div className="flex justify-center flex-col items-center gap-12 m-4">
      <h1 className="text-4xl font-extrabold">Requests</h1>
      {request.map((user) => (
        <div className="card glass w-80 flex justify-center items-center">
          <figure className="px-6 pt-6">
            <img className="rounded-xl" src={user.fromUserId?.photoUrl} alt="car!" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-3xl">
              {user.fromUserId?.firstName + " " + user.fromUserId?.lastName}
            </h2>
            <div className="flex gap-4 text-xl text-yellow-600">
              <h1>{user.fromUserId?.age}</h1>
              <h1>{user.fromUserId?.gender}</h1>
            </div>
            <p className="text-wrap">{user.fromUserId?.about.slice(0, 60)}</p>
            <div className="card-actions justify-between m-4">
              <button className="btn btn-secondary" onClick={()=>reviewRequest("rejected",user._id)}>Reject</button>
              <button className="btn btn-primary" onClick={()=>reviewRequest("accepted",user._id)}>Accept</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Requests;
