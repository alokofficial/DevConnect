import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    const response = await axios.get(BASE_URL + "/feed", {
      withCredentials: true,
    });
    dispatch(addFeed(response.data));
  };

  useEffect(() => {
   !feed && getFeed();
  }, []);
  
  if(!feed){
    return <h1>Loading...</h1>
  }
  const user = feed[Math.floor(Math.random() * feed.length)];
  
  return (
    <div className="flex justify-center m-4">
      <UserCard user={user} />
    </div>

)};

export default Feed;
