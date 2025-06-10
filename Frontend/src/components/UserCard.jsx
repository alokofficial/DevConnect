import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { removeUserFromFeed } from '../utils/feedSlice'

const UserCard = ({user,primary,secondary}) => {
  console.log(user)
  const {firstName,lastName,age,gender,about,photoUrl,_id} = user
  const dispatch = useDispatch()

  const handleSendRequest = async(status)=>{
    try {
      const response = await axios.post(BASE_URL+"/request/send/" + status + "/" + _id,{},{
        withCredentials: true
      })
      dispatch(removeUserFromFeed(_id))
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="card glass w-80 flex justify-center items-center">
      <figure className="px-6 pt-6">
        <img className='rounded-xl' src={photoUrl} alt="car!" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-3xl">{firstName + " " + lastName}</h2>
        <div className="flex gap-4 text-xl text-yellow-600">
          <h1>{age}</h1>
          <h1>{gender}</h1>
        </div>
        <p className='text-wrap'>{about.slice(0,60)}</p>
        <div className="card-actions justify-between m-4">
          <button className="btn btn-secondary" onClick={()=>handleSendRequest("ignored")}>Ignore</button>
          <button className="btn btn-primary" onClick={()=>handleSendRequest("interested")}>Interested</button>

        </div>
      </div>
    </div>
  )
}

export default UserCard