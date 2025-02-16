import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addSongs } from '../redux/slices/songSlice';

export default function ArtistPlaylist({ artist }) {
    const dispatch = useDispatch();
    const userState = useSelector(state => state.user);
    const navigate = useNavigate();

    const handlePlayPlaylist = (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if(userState.isLoggedIn){
            dispatch(addSongs([].concat(...artist.songs)));
        }else{
            navigate('/signin')
        }
    }
    return (
        <Link to={`/artist/${artist._id}`} className='relative group flex flex-col items-center rounded-md p-1 md:p-4 gap-2 hover:bg-[rgba(0,0,0,0.1)] cursor-pointer min-w-[150px] md:min-w-[180px] transition-all duration-300'>
    <img
        src={artist.pic}
        alt={artist.name}
        onContextMenu={(e)=>e.preventDefault()}
        className='w-28 h-28 md:w-36 md:h-36 rounded-full object-cover'
    />
    <h3 className='text-center text-sm font-semibold'>{artist.name}</h3>
    <button
        className='bg-[#ffcd2b] z-10 absolute bottom-10 right-4 text-black w-10 h-10 rounded-full flex md:hidden group-hover:flex  transition-all duration-300 justify-center items-center'
        onClick={handlePlayPlaylist}
    >
        <FaPlay className='w-4 h-4' />
    </button>
</Link>

    );
}
