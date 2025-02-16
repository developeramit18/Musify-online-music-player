import React from 'react'

export default function Devider({title}) {
  return (
    <div className='flex w-full gap-2 items-center my-2'>
        <div className="flex-1 h-[1px] bg-black/80"></div>
        {title && <h3 className='text-md'>{title}</h3>}
        <div className="flex-1 h-[1px] bg-black/80"></div>
    </div>
  )
}
