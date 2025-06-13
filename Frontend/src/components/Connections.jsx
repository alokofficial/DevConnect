import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

function Connections() {
  const dispatch = useDispatch();
  
  const connection = useSelector((store) => store.connection);
  const fetchConnections = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(response?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connection) {
    return <h1>Loading...</h1>;
  }
  if (connection.length === 0) {
    return <h1 className="text-3xl text-center">No connections</h1>;
  }
  const handleClickChat = () => {
    console.log("clicked");
  };
  return (
    <div className="flex justify-center flex-col items-center gap-12 m-4">
      <h1 className="text-4xl font-extrabold">Connections</h1>
      {connection.map((user) => (
        <div key={user?._id} className="card glass w-80 flex justify-center items-center">
          <figure className="px-6 pt-6">
            <img className="rounded-xl" src={user?.photoUrl} alt="car!" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-3xl">
              {user?.firstName + " " + user?.lastName}
            </h2>
            <div className="flex gap-4 text-xl text-yellow-600">
              <h1>{user?.age}</h1>
              <h1>{user?.gender}</h1>
            </div>
            <p className="text-wrap">{user?.about.slice(0, 60)}</p>
          </div>
          <Link to={`/chat/${user?._id}`} className="btn btn-secondary mb-2" onClick={handleClickChat}>Chat</Link>
        </div>
      ))}
    </div>
  );
}

export default Connections;
