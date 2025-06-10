import { useDispatch, useSelector } from "react-redux"
import {removeUser} from "../utils/userSlice"
import { Link, useNavigate } from "react-router-dom"

const NavBar = () => {
  const user = useSelector(store=>store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handleLogout =()=>{
    dispatch(removeUser())
    navigate("/login")
  }
  return (
    <div className="navbar bg-base-300 p-4">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl"><span className="text-5xl">👨‍💻</span>DevConnect</a>
  </div>
  <div className="flex gap-8 px-8">
    <div className="dropdown dropdown-end">
      {user && <div className="flex items-center justify-center gap-4">
        <div className="text-lg font-bold text-yellow-500">Welcome, {user?.firstName} </div>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={user?.photoUrl} />
        </div>
      </div>
      </div>}
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <Link to="/profile" className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><Link to="/">Feed</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default NavBar