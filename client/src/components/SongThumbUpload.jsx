import React from 'react'

export default function SongThumbUpload({
    setSongThumbnail,
    songThumbnailRef,
    handleSongThumbnailUpload,
    songThumbnailUploadProgress
}) {
  return (
    <div className="flex flex-col gap-2">
            <label className="block text-gray-600 font-medium mb-1">
              Song Thumbnail:
            </label>
            <div className="flex sm:flex-row flex-col gap-4 justify-between">
              <input
                type="file"
                onChange={(e) => setSongThumbnail(e.target.files[0])}
                ref={songThumbnailRef}                
                accept="image/*"
                className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300
          file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200"
              />
              <button onClick={()=>handleSongThumbnailUpload('Song thumbnail')} className="px-5 py-2 rounded-full bg-black/90 text-white/80 hover:bg-black hover:text-white">
                {songThumbnailUploadProgress
                  ? `Uploading: ${songThumbnailUploadProgress}%`
                  : "Upload thumbnail"}
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Only image files are allowed (.jpg, .jpeg, .png, etc.)
            </p>
          </div>
  )
}
