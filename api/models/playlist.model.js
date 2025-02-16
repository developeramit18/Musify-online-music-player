import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide a name"]
    },
    songs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }
    ],
    thumbnail:{
        type: String,
        required: [true, "Please provide a thumbnail"]
    }
},{
    timestamps: true
})

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist