import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    pic: {
        type: String,
        default: ''
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        }
    ]
}, {
    timestamps:true
});


const Artist = mongoose.model("Artist", artistSchema);

export default Artist