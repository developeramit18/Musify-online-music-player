import React from "react";
import PlaylistCard from "../../../components/PlaylistCard";

export default function PlaylistSection({loading, playlists}) {
     const playlistLoading = new Array(15).fill(null);
  return (
    <div className="relative mt-4">
      <h2 className="text-xl md:text-2xl font-bold px-2 md:px-4">Playlists</h2>
      <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start p-2 md:p-4  ">
        {loading ? (
          playlistLoading.map((el, index) => (
            <div
              className="w-full h-32 md:min-w-52 md:max-w-52 md:min-h-52 md:max-h-52 bg-slate-200 animate-pulse"
              key={`playlistLoading ${index}`}
            ></div>
          ))
        ) : (
          <>
            {playlists.length > 0 &&
              playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}
