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

artistSchema.virtual('TotalSongs').get(function(){
    return `${this.name}'s total songs:${this?.songs?.length ?? 0}`
})

artistSchema.set('toJSON', {virtuals:true})
artistSchema.set("toObject", { virtuals: true });

const Artist = mongoose.model("Artist", artistSchema);

export default Artist