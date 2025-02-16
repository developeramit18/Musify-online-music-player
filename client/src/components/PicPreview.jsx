import React from 'react'

export default function PicPreview({url}) {
  return (
    <div className="w-52 h-52">
        <img onContextMenu={(e)=>e.preventDefault()} src={url} alt="Thumbnail" className='w-full h-full object-cover' />
    </div>
  )
}
