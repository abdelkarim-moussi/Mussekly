import React from 'react'

export const Search = () => {
  return (
    <div  className='bg-[#303236] w-[400px] h-[40px] rounded-3xl'>
      <input type="search" className='bg-transparent w-full h-full px-4 text-sm outline-none text-white' placeholder='search a song..'/>
    </div>
  )
}

