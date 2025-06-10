import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { addRequest } from '../utils/requestSlice'
import UserCard from './UserCard'

const Requests = () => {
  const dispatch = useDispatch()
  const request = useSelector(store=>store.request)

  const fetchRequests = async()=>{
    try {
      const response = await axios.get(BASE_URL+"/user/requests/received",{
        withCredentials: true
      })
      dispatch(addRequest(response?.data))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    fetchRequests()
  },[])

  if(!request){
    return <h1>Loading...</h1>
  }
  if(request.length === 0){
    return <h1 className='text-3xl text-center'>No pending requests</h1>
  }
  return(
    <div className="flex justify-center flex-col items-center gap-12 m-4">
      <h1 className='text-4xl font-extrabold'>Requests</h1>
      {request.map(user=><UserCard key={user._id} user={user.fromUserId} />)}
    </div>
  )
}


export default Requests