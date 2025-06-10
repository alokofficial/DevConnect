import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector(store=>store.user);
  return user &&(
    <div className="flex gap-8 justify-center mt-12">
      <EditProfile user={user} />
    </div>
  )
}

export default Profile