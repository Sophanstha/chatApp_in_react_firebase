import React from 'react'
import UseInfo from './UseInfo'
import Chatlist from './Chatlist'
function List() {
  return (
    <div className='flex-1 flex flex-col'>
        <UseInfo />
        <Chatlist />
    </div>
  )
}

export default List