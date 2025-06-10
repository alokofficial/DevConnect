import React from 'react'

const UserCard = ({user,primary,secondary}) => {
  return (
    <div className="card glass w-80 flex justify-center items-center">
      <figure className="px-6 pt-6">
        <img className='rounded-xl' src={user?.photoUrl} alt="car!" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-3xl">{user?.firstName + " " + user?.lastName}</h2>
        <div className="flex gap-4 text-xl text-yellow-600">
          <h1>{user?.age}</h1>
          <h1>{user?.gender}</h1>
        </div>
        <p className='text-wrap'>{user?.about.slice(0,60)}</p>
        <div className="card-actions justify-between m-4">
          <button className="btn btn-secondary">Ignore</button>
          <button className="btn btn-primary">Interested</button>

        </div>
      </div>
    </div>
  )
}

export default UserCard