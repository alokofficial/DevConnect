import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../utils/connectionSlice'
import UserCard from './UserCard'

function Connections() {
  const dispatch = useDispatch()
  const connection = useSelector(store=>store.connection)
  const fetchConnections = async ()=>{
    try {
      const response  = await axios.get(BASE_URL+"/user/connections",{
        withCredentials: true
      })
      dispatch(addConnection(response?.data?.data))

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
   fetchConnections()
  },[])
  if(!connection){
    return <h1>Loading...</h1>
  }
  if(connection.length === 0){
    return <h1 className='text-3xl text-center'>No connections</h1>
  }
  return(
    <div className="flex justify-center flex-col items-center gap-12 m-4">
      <h1 className='text-4xl font-extrabold'>Connections</h1>
      {connection.map(user=><UserCard key={user._id} user={user} />)}
    </div>
  )
}

export default Connections