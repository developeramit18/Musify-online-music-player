import mongoose from "mongoose";
import { bucket } from "../lib/firebase.js";
// import { redis } from "../lib/redis.js";
import Artist from "../models/artist.model.js";
import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const addNewSong = async (req, res, next) => {
  const checkAdmin = await User.findOne({ _id: req.user.id });
  if (checkAdmin.isAdmin === false) {
    return next(errorHandler(403, "Only admin can upload songs!"));
  }

  try {
    const { songTitle, songUrl, songThumbnail, artists } = req.body;

    const artistIds = artists.map((artist) => artist._id);

    const existingArtists = await Artist.find({ _id: { $in: artistIds } });
    if (existingArtists.length !== artistIds.length) {
      return next(errorHandler(406, "One or more artists not found!"));
    }

    const newSong = new Song({
      title: songTitle,
      url: songUrl,
      thumbnail: songThumbnail,
      artist: artistIds,
    });

    await newSong.save();

    // await redis.del("totalSongs");
    // await redis.del("lastMonthSongs");
    // await redis.del("totalArtists");
    // await redis.del("lastMonthArtists");


    await Promise.all(
      artistIds.map(async (artistId) => {
        await Artist.findByIdAndUpdate(
          artistId,
          { $push: { songs: newSong._id } },
          { new: true }
        );
      })
    );

    res.status(201).json({ message: "Song added successfully!", song: newSong });
  } catch (error) {
    next(error);
  }
}

export const
  getSongs = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const limit = parseInt(req.query.limit) || null
      const songs = await Song.find(
        {
          ...(req.query.title && { title: { $regex: req.query.searchTerm, $options: 'i' } })
        }
      ).populate('artist').sort({ updatedAt: sortDirection }).limit(limit).skip(startIndex);

      const totalSongs = await Song.countDocuments();

      const Now = new Date();
      const oneMonthAgo = new Date(
        Now.getFullYear(),
        Now.getMonth() - 1,
        Now.getDate()
      );
      const lastMonthSongs = await Song.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      })

      res.status(200).json({
        songs,
        totalSongs,
        lastMonthSongs,
      })
    } catch (error) {
      next(error)
    }
  }

export const searchedSongs = async (req, res, next) => {
  const searchTerm = req.query.searchTerm || '';
  try {

    if (searchTerm !== '') {
      const matchingArtists = await Artist.find({
        name: { $regex: searchTerm, $options: "i" },
      });


      const artistIds = matchingArtists.map((artist) => artist._id);

      const songs = await Song.find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { artist: { $in: artistIds } },
        ],
      })
        .populate("artist")
        .sort({ createdAt: -1 })
        .limit(12);

      res.status(200).json(songs);
    }
  } catch (error) {
    next(error);
  }
};

export const getSong = async (req, res, next) => {
  try {
    const songId = req.params.songId;

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }

    const song = await Song.findById(songId).populate('artist');
    if (!song) return next(errorHandler(404, 'Song not found'));

    res.status(200).json({
      song
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSong = async (req, res, next) => {

  const checkAdmin = await User.findOne({ _id: req.user.id });
  if (checkAdmin.isAdmin === false) {
    return next(errorHandler(403, "Only admin can delete songs!"));
  }

  try {
    const song = await Song.findById(req.params.Id);
    if (!song) return next(errorHandler(404, 'Song not found'))
    if (song.thumbnail !== 'https://res-console.cloudinary.com/ascoder/media_explorer_thumbnails/1052616536c1ce28fccd4f98d57d7f42/detailed') {
      const thumbnailPath = decodeURIComponent(song.thumbnail.split('/o/')[1].split('?')[0]);
      await bucket.file(thumbnailPath).delete();
    }


    const filePath = decodeURIComponent(song.url.split('/o/')[1].split('?')[0]);
    await bucket.file(filePath).delete();


    await Artist.updateMany(
      { _id: { $in: song.artist } },
      { $pull: { songs: song._id } }
    );

    await Song.findByIdAndDelete(song._id);


    // await redis.del("totalSongs");
    // await redis.del("lastMonthSongs");
    // await redis.del("totalArtists");
    // await redis.del("lastMonthArtists");

    const updatedSongs = await Song.find();
    return res.status(200).json({ msg: 'Song deleted successfully', songs: updatedSongs });
  } catch (error) {
    next(error)
  }
}


export const addToFavourite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const songId = req.params.songId;
    const song = await Song.findById(songId);

    if (!song) {
      return next(errorHandler(404, "Song not found"));
    }

    user.liked_songs.push(songId);


    await user.save();
    const updatedUser = await User.findById(req.user.id).populate({
      path: "liked_songs",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "artist",
      },
    }).select('-password');
    res.status(200).json({
      message: "added to liked songs",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromFavourite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const songId = req.params.songId;


    if (!user.liked_songs.includes(songId)) {
      return next(errorHandler(404, "Song not found in liked songs"));
    }

    user.liked_songs = user.liked_songs.filter(id => id.toString() !== songId);

    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .populate({
        path: "liked_songs",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "artist",
        },
      })
      .select("-password");

    res.status(200).json({
      message: "Removed from liked songs",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const { songTitle, songUrl, songThumbnail, artists } = req.body;

    const artistIds = artists.map((artist) => artist._id);

    const existingSong = await Song.findById(songId);
    if (!existingSong) {
      return next(errorHandler(404, "Song not found!"));
    }

    const existingArtists = await Artist.find({ _id: { $in: artistIds } });
    if (existingArtists.length !== artistIds.length) {
      return next(errorHandler(406, "One or more artists not found!"));
    }

    const previousArtistIds = existingSong.artist.map((artist) => artist.toString());

    const removedArtistIds = previousArtistIds.filter(
      (artistId) => !artistIds.includes(artistId)
    );

    const addedArtistIds = artistIds.filter(
      (artistId) => !previousArtistIds.includes(artistId)
    );

    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      {
        title: songTitle,
        url: songUrl,
        thumbnail: songThumbnail,
        artist: artistIds,
      },
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      return next(errorHandler(404, "Song not found!"));
    }

    await Promise.all(
      removedArtistIds.map(async (artistId) => {
        await Artist.findByIdAndUpdate(
          artistId,
          { $pull: { songs: songId } },
          { new: true }
        );
      })
    );

    await Promise.all(
      addedArtistIds.map(async (artistId) => {
        await Artist.findByIdAndUpdate(
          artistId,
          { $addToSet: { songs: updatedSong._id } },
          { new: true }
        );
      })
    );


    // await redis.del("totalSongs");
    // await redis.del("lastMonthSongs");
    // await redis.del("totalArtists");
    // await redis.del("lastMonthArtists");

    res.status(200).json({ message: "Song updated successfully!", song: updatedSong });
  } catch (error) {
    next(error);
  }
};




