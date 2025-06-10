import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import axios from "axios";

const Body = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const fetchLoggedInUser = async () => {
    try {
      const user = await axios(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(user.data));
    } catch (error) {
      if(error.status === 401){
        navigate("/login"); 
      }
    }
  };
  useEffect(() => {
    !user && fetchLoggedInUser();
  }, []);
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
