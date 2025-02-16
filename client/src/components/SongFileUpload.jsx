import React from 'react'

export default function SongFileUpload({
    songFileRef,
    setSongFile,
    songFileUploadProgress,
    handleSongUpload
}) {
  return (
    <div className="flex flex-col gap-2">
            <label className="block text-gray-600 font-medium mb-1">
              Song File:
            </label>
            <div className="flex sm:flex-row flex-col gap-4 justify-between">
              <input
                type="file"
                accept="audio/*"
                ref={songFileRef}
                onChange={(e) => setSongFile(e.target.files[0])}
                className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300
          file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-100 file:text-blue-700
          hover:file:bg-blue-200"
              />
              <button
                onClick={() => handleSongUpload("Song file")}
                className="px-5 py-2 rounded-full bg-black/90 text-white/80 hover:bg-black hover:text-white"
                disabled={songFileUploadProgress}
              >
                {songFileUploadProgress
                  ? `Uploading: ${songFileUploadProgress}%`
                  : "Upload song"}
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Only audio files are allowed (.mp3, .wav, etc.)
            </p>
          </div>
  )
}
