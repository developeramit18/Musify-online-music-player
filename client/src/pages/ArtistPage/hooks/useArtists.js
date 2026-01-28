import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchArtists = async ({ pageParam = 0, queryKey }) => {
  const [, searchTerm] = queryKey;

  if (searchTerm) {
    const res = await axios.get(
      `/api/artist/search?artist=${searchTerm}`
    );
    return {
      artists: res.data.artists || [],
      nextPage: null,
    };
  }
  const res = await axios.get(
    `/api/artist?startIndex=${pageParam}&limit=8`
  );

  return {
    artists: res.data.artists,
    nextPage:
      res.data.artists.length > 0 ? pageParam + 8 : undefined,
  };
};

export const useArtists = (searchTerm) => {
  return useInfiniteQuery({
    queryKey: ["artists", searchTerm],
    queryFn: fetchArtists,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};
