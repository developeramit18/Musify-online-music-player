import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchHomeData = async () => {
  const [artists, playlists, songs] = await Promise.all([
    axios.get("api/artist?limit=8"),
    axios.get("api/playlist"),
    axios.get("api/song?limit=10"),
  ]);

  return {
    artists: artists.data.artists,
    playlists: playlists.data.playlists,
    topTracks: songs.data.songs,
  };
};

export const useHomeData = () => {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: fetchHomeData,
    staleTime: 5 * 60 * 1000, // 5 min
    cacheTime: 10 * 60 * 1000,
  });
};
