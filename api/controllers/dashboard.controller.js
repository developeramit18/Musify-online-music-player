import { bucket } from "../lib/firebase.js";
import { redis } from "../lib/redis.js";
import Artist from "../models/artist.model.js";
import Song from "../models/song.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const dashboard = async (req, res, next) => {
    try {
        const cachedData = await redis.mget(
            "totalSongs",
            "totalArtists",
            "totalUsers",
            "lastMonthSongs",
            "recentlyAddedSongs",
            "recentlyAddedArtist",
            "lastMonthUsers",
            "totalSize"
        );

        if (cachedData.every(Boolean)) {
            const [totalSongs, totalArtists, totalUsers, lastMonthSongs,recentlyAddedSongs, recentlyAddedArtist, lastMonthUsers, totalSize] = cachedData;
            return res.status(200).json({
                totalSongs,
                totalArtists,
                totalUsers,
                lastMonthSongs,
                recentlyAddedSongs: JSON.parse(recentlyAddedSongs),
                recentlyAddedArtist: JSON.parse(recentlyAddedArtist),
                lastMonthUsers,
                totalSize,
            });
        }

        const Now = new Date();
        const oneMonthAgo = new Date(
            Now.getFullYear(),
            Now.getMonth() - 1,
            Now.getDate()
        );

        const [totalSongs, totalArtists, totalUsers, lastMonthSongs,recentlyAddedSongs,recentlyAddedArtist, lastMonthUsers, files] = await Promise.all([
            Song.countDocuments({}),
            Artist.countDocuments({}),
            User.countDocuments({}),
            Song.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
            Song.find({}).sort({ createdAt: -1 }).limit(3).select("title createdAt"),
            Artist.find({}).sort({ createdAt: -1 }).limit(3).select("name createdAt"),
            User.countDocuments({ createdAt: { $gte: oneMonthAgo } }),
            bucket.getFiles()
        ]);

        let totalSize = 0;
        await Promise.all(files[0].map(async (file) => {
            const [metadata] = await file.getMetadata();
            totalSize += parseInt(metadata.size, 10);
        }));

        await redis.mset({
            totalSongs,
            totalArtists,
            totalUsers,
            lastMonthSongs,
            recentlyAddedSongs: JSON.stringify(recentlyAddedSongs),
            recentlyAddedArtist: JSON.stringify(recentlyAddedArtist),
            lastMonthUsers,
            totalSize
        });
        

        const TTL = 3600; 
        await Promise.all([
            redis.expire("totalSongs", TTL),
            redis.expire("totalArtists", TTL),
            redis.expire("totalUsers", TTL),
            redis.expire("lastMonthSongs", TTL),
            redis.expire("recentlyAddedSongs", TTL),
            redis.expire("recentlyAddedArtist", TTL),
            redis.expire("lastMonthUsers", TTL),
            redis.expire("totalSize", TTL),
        ]);

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

export const getUsers = async(_,res,next) =>{
    try {
        const [totalUsers, users] = await Promise.all([
            User.countDocuments({}),
            User.find({}).select("-password").lean()
        ]);
        
        res.status(200).json({totalUsers, users});
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req,res,next) =>{
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        await redis.del("totalUsers");
        res.status(200).json({msg: "User deleted successfully"});
    } catch (error) {
        next(error)
    }
}

export const updateUserRole = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
  
      const isAdmin = role === "Admin";


      const updatedUser = await User.findByIdAndUpdate(
        id,
        { isAdmin },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return next(errorHandler(404, "User not found"));
      }
  
      res.status(200).json({
        message: "User role updated successfully",
        updatedUser
      });
    } catch (error) {
      next(error);
    }
  };

