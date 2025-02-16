import Song from '../models/song.model.js';
import Playlist from '../models/playlist.model.js';
import { errorHandler } from '../utils/errorHandler.js';


export const createPlaylist = async (req, res, next) => {
  try {
    const { name, thumbnail, songs } = req.body;

    if (songs && songs.length > 0) {
      const validSongs = await Song.find({ _id: { $in: songs } });
      if (validSongs.length !== songs.length) {
        return next(errorHandler(400, 'One or more songs do not exist'))
      }
    }

    const newPlaylist = new Playlist({
      name,
      thumbnail,
      songs,
    });

    await newPlaylist.save();

    res.status(201).json({
      message: 'Playlist created successfully',
      playlist: newPlaylist,
    });
  } catch (error) {
    next(error); 
  }
};


export const getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find()
      .populate({
        path: 'songs', 
        populate: {
            path: 'artist', 
            model: 'Artist',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Playlists retrieved successfully',
      playlists,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId)
      .populate({
        path: 'songs', 
        populate: {
            path: 'artist', 
            model: 'Artist',
        },
      });

    res.status(200).json({
      message: 'Playlists retrieved successfully',
      playlist,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    await Playlist.findByIdAndDelete(req.params.playlistId);

    res.status(200).json({
      message: 'Playlist deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}


export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const { name, thumbnail, songs } = req.body;

    if (songs && songs.length > 0) {
      const validSongs = await Song.find({ _id: { $in: songs } });
      if (validSongs.length !== songs.length) {
        return next(errorHandler(400, 'One or more songs do not exist'));
      }
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { name, thumbnail, songs },
      { new: true, runValidators: true }
    ).populate({
      path: 'songs',
      populate: {
        path: 'artist', 
        model: 'Artist',
      },
    });

    if (!updatedPlaylist) {
      return next(errorHandler(404, "Playlist not found"));
    }

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (error) {
    next(error);
  }
};
