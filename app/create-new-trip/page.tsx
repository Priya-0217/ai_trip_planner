import React from 'react'
import ChatBox from './components/chatbox'

export const CreateNewTrip = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
       
       <div>
        <ChatBox />
        </div>


        <div>
      map and trip
        </div>

    </div>
  )
}

export default CreateNewTrip