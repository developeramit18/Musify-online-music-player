import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ArtistPlaylist from "../../../components/ArtistPlaylist";
import { useRef } from "react";
import { useState } from "react";

export default function ArtistSection({
  loading,
  artists,
}) {
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const scrollContainerRef = useRef(null);
  const artistLoading = new Array(12).fill(null);
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftIcon(scrollLeft > 0);
      setShowRightIcon(scrollLeft + clientWidth < scrollWidth);
    }
  };
  return (
    <div className="relative">
      <h2 className="text-xl md:text-2xl font-bold px-2 md:px-4">Artists</h2>
      <div className="relative">
        {/* Left Scroll Icon */}
        {showLeftIcon && (
          <button
            aria-label="scroll-left"
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-[11] bg-gray-100 dark:bg-gray-500 p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            <FaChevronLeft size={20} />
          </button>
        )}

        {/* Scrollable Artist Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 p-2 md:p-4 overflow-x-auto noScrollbar flex-nowrap"
        >
          {loading ? (
            artistLoading.map((el, index) => (
              <div
                className="min-w-28 min-h-28 max-w-28 max-h-28 md:min-w-36 md:max-w-36 md:max-h-36 md:min-h-36 rounded-full bg-slate-200 animate-pulse"
                key={`artistLoading ${index}`}
              ></div>
            ))
          ) : (
            <>
              {artists.length > 0 &&
                artists.map((artist) => (
                  <ArtistPlaylist key={artist._id} artist={artist} />
                ))}
              {artists.length > 0 && (
                <Link
                  to="/artist"
                  className="text-blue-600 w-full text-nowrap hover:underline"
                >
                  Show more
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Scroll Icon */}
        {showRightIcon && (
          <button
            aria-label="scroll-right"
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-[11] bg-gray-100 dark:bg-gray-500 p-2 rounded-full shadow-md hover:bg-gray-200"
          >
            <FaChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
