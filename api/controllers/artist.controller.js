import { bucket } from "../lib/firebase.js";
// import { redis } from "../lib/redis.js";
import Artist from "../models/artist.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const addNewArtist = async (req, res, next) => {
    const { name, pic } = req.body;
    if (!name || name === "") {
      return next(errorHandler(400, "Artist name is required"))
    }
    if(!pic || pic === "") {
      return next(errorHandler(400, "Artist pic cannot be empty"))
    }
  try {
    const newArtist = new Artist({
      name,
      pic
    });

    await newArtist.save();

    // await redis.del("totalArtists");
    // await redis.del("lastMonthArtists");

    res.status(201).json({ message: "Artist added successfully!", artist: newArtist });

  } catch (error) {
    next(error);
  }
};

export const searchArtist = async (req, res, next) => {
  try {
    const { artist } = req.query;

    if (!artist) {
      return res.status(200).json({ artists: [] });
    }

    const artists = await Artist.find({
      name: { $regex: artist, $options: "i" }
    }).populate({
      path: 'songs',
      populate: {
        path: 'artist', 
        model: 'Artist',
      },
    });

    res.status(200).json({ artists });
  } catch (error) {
    next(error);
  }
};

export const getArtist = async(req,res,next) =>{
  try {
    const artist = await Artist.findById(req.params.artistId).populate({
        path: 'songs',
        populate: {
          path: 'artist', 
          model: 'Artist',
        },
      });
      if (!artist) return next(errorHandler(404, 'Artist not found'))
    res.status(200).json({artist});
  } catch (error) {
    next(error);
  }
}

export const getArtists = async (req,res, next) =>{
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const limit = parseInt(req.query.limit) || null;
      const artists = await Artist.find(
            {
                  ...(req.query.name && { name: { $regex: req.query.name, $options: 'i' } })
            }
      ).populate({
        path: 'songs',
        populate: {
          path: 'artist', 
          model: 'Artist',
        },
      }).limit(limit).sort({ updatedAt: sortDirection }).skip(startIndex);

      const totalArtists = await Artist.countDocuments();

      const Now = new Date();
      const oneMonthAgo = new Date(
            Now.getFullYear(),
            Now.getMonth() - 1,
            Now.getDate()
      );
      const lastMonthArtists = await Artist.countDocuments({
            createdAt: { $gte: oneMonthAgo },
      })

      res.status(200).json({
            artists,
            totalArtists,
            lastMonthArtists,
      })
    } catch (error) {
        next(error);
    }
}

export const deleteArtist = async (req, res, next) => {


  try {
      const artist = await Artist.findById(req.params.Id);
      if (!artist) return next(errorHandler(404, 'Artist not found'))
      
        if(artist.pic !== "https://firebasestorage.googleapis.com/v0/b/instagram-296d0.appspot.com/o/user.jpeg?alt=media&token=944db7f2-56d9-4f6f-95a6-0216cfa649fb");{
          const artistPicPath = decodeURIComponent(artist.pic.split('/o/')[1].split('?')[0]);
          await bucket.file(artistPicPath).delete();      
        }
      await Artist.findByIdAndDelete(artist._id);

      // await redis.del("totalArtists");
      // await redis.del("lastMonthArtists");
      
      const updatedArtists = await Artist.find();
      return res.status(200).json({ msg: 'Artist deleted successfully', artists:updatedArtists });
  } catch (error) {
      next(error)
  }
}


export const updateArtist = async (req, res) => {
  try {
      const { id } = req.params;
      const updates = req.body; 


      const updatedArtist = await Artist.findByIdAndUpdate(id, updates, { 
          new: true, 
          runValidators: true 
      });

      if (!updatedArtist) {
          return next(errorHandler(404, 'Artist not found'))
      }

      res.status(200).json(updatedArtist);
  } catch (error) {
      next(error)
  }
};
