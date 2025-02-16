import React from "react";

export default function SearchArtistModal({artist,handleAddArtist}) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100"
      onClick={()=>handleAddArtist(artist)}
    >
      <img
        src={artist.pic}
        alt={artist.name}
        onContextMenu={(e)=>e.preventDefault()}
        className="w-10 h-10 rounded-full object-cover"
      />
      <p className="truncate font-medium text-md select-none">{artist.name}</p>
    </div>
  );
}
