import React from 'react'
import { FaPlay } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addSongs } from '../redux/slices/songSlice';

export default function PlaylistCard({playlist}) {

  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const navigate = useNavigate();

  const handlePlayPlaylist = (e)=>{
          e.stopPropagation();
          e.preventDefault();
          if(userState.isLoggedIn){
              dispatch(addSongs([].concat(...playlist.songs)));
          }else{
              navigate('/signin')
          }
      }

  return (
    <Link to={`/playlist/${playlist._id}`} className='flex flex-col items-center p-2 md:p-4 gap-2 cursor-pointer group relative bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-500 hover:bg-gray-300 rounded-md'>
        <img src={playlist.thumbnail} alt={playlist.name} onContextMenu={(e)=>e.preventDefault()} className='w-44 h-44 object-cover' />
        <h3 className='font-semibold text-md'>{playlist.name}</h3>
        <button
  className="bg-[#ffcd2b] z-10 absolute bottom-10 right-4 text-black w-10 h-10 rounded-full 
  flex md:hidden group-hover:flex transition-all duration-300 justify-center items-center"
  onClick={handlePlayPlaylist}
>
  <FaPlay className="w-4 h-4 text-black" />
</button>
    </Link>
  )
}
