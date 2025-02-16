import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    artist:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
      }
    ]
  }, {
    timestamps:true
  }
);

const Song = mongoose.model("Song", songSchema);

export default Song;
