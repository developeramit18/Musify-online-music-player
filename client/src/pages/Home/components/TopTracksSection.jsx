import React from "react";
import TopTracks from "../../../components/TopTracks";

export default function TopTracksSection({loading, topTracks}) {
    const topTracksLoading = new Array(10).fill(null);
  return (
    <div className="relative mt-4">
      <h2 className="text-xl md:text-2xl font-bold px-2 md:px-4">Top Tracks</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center p-2 md:p-4  ">
        {loading ? (
          topTracksLoading.map((el, index) => (
            <div
              className="w-full h-8 md:min-w-32 md:max-w-32 md:min-h-8 md:max-h-8 bg-slate-200 animate-pulse"
              key={`topTracksLoading ${index}`}
            ></div>
          ))
        ) : (
          <>
            {topTracks.length > 0 &&
              topTracks.map((song) => <TopTracks key={song._id} song={song} />)}
          </>
        )}
      </div>
    </div>
  );
}
