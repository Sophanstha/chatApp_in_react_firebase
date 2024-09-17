import React from 'react'
import {useUserStore} from "../lib/UseUserStore"
function UseInfo() {
  const {
    currentUser
  } = useUserStore()
  return (
    <div className='p-5 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
            <img src={currentUser.avatar || "./avatar.png"} alt="" srcset="" className='w-1/3 h-1/3 rounded-full object-cover' />
            <h1>{currentUser.username}</h1>
        </div>
        <div className=' flex gap-3 mr-2'>
            <img src="./more.png" alt=""  className='w-5 h-5 '/>
            <img src="./video.png" alt="" className='w-5 h-5 '/>
            <img src="./edit.png" alt="" className='w-5 h-5'/>
        </div>
    </div>
  )
}

export default UseInfo