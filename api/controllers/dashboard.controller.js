import { bucket } from "../lib/firebase.js";
import { redis } from "../lib/redis.js";
import Artist from "../models/artist.model.js";
import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const dashboard = async (req, res, next) => {
  try {
    let cachedData;
    try {
      cachedData = await redis.mget(
        "totalSongs",
        "totalArtists",
        "totalUsers",
        "lastMonthSongs",
        "recentlyAddedSongs",
        "recentlyAddedArtist",
        "lastMonthUsers",
        "totalSize"
      );
    } catch (e) {
      console.warn("Redis unavailable, falling back to DB...");
      cachedData = [];
    }

    if (cachedData.length && cachedData.every((value) => value !== null)) {
      const [
        totalSongs,
        totalArtists,
        totalUsers,
        lastMonthSongs,
        recentlyAddedSongs,
        recentlyAddedArtist,
        lastMonthUsers,
        totalSize,
      ] = cachedData;

      return res.status(200).json({
        totalSongs: Number(totalSongs),
        totalArtists: Number(totalArtists),
        totalUsers: Number(totalUsers),
        lastMonthSongs: Number(lastMonthSongs),
        recentlyAddedSongs: JSON.parse(recentlyAddedSongs),
        recentlyAddedArtist: JSON.parse(recentlyAddedArtist),
        lastMonthUsers: Number(lastMonthUsers),
        totalSize: Number(totalSize),
      });
    }

    const Now = new Date();
    const oneMonthAgo = new Date(Now.getFullYear(), Now.getMonth() - 1, Now.getDate());

    const [
      totalSongs,
      totalArtists,
      totalUsers,
      lastMonthSongs,
      recentlyAddedSongs,
      recentlyAddedArtist,
      lastMonthUsers,
      files,
    ] = await Promise.all([
      Song.countDocuments({}),
      Artist.countDocuments({}),
      User.countDocuments({}),
      Song.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
      Song.find({}).sort({ createdAt: -1 }).limit(3).select("title createdAt"),
      Artist.find({}).sort({ createdAt: -1 }).limit(3).select("name createdAt"),
      User.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
      bucket.getFiles(),
    ]);

    let totalSize = 0;
    for (const file of files[0]) {
      const [metadata] = await file.getMetadata();
      totalSize += Number(metadata.size);
    }

    // Cache in Redis (fail silently if Redis is down)
    try {
      await redis.mset({
        totalSongs,
        totalArtists,
        totalUsers,
        lastMonthSongs,
        recentlyAddedSongs: JSON.stringify(recentlyAddedSongs),
        recentlyAddedArtist: JSON.stringify(recentlyAddedArtist),
        lastMonthUsers,
        totalSize,
      });

      const TTL = 3600; // 1 hour
      const keys = [
        "totalSongs",
        "totalArtists",
        "totalUsers",
        "lastMonthSongs",
        "recentlyAddedSongs",
        "recentlyAddedArtist",
        "lastMonthUsers",
        "totalSize",
      ];
      await Promise.all(keys.map((key) => redis.expire(key, TTL)));
    } catch (e) {
      console.warn("Redis cache write failed:", e.message);
    }

    return res.status(200).json({
      totalSongs,
      totalArtists,
      totalUsers,
      lastMonthSongs,
      recentlyAddedSongs,
      recentlyAddedArtist,
      lastMonthUsers,
      totalSize,
    });
  } catch (error) {
    next(error);
  }
};
