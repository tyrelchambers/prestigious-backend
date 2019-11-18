import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const storySchema = new Schema({
  title: String,
  body: String,
  username: String,
  tags: [String],
  theme: [String],
  notes: String,
  bannerUrl: String,
  likedBy: [{
    type: ObjectId,
    ref: "Profile"
  }],
  views: {
    type: Number,
    default: 0
  },
  profile_id: {
    type: ObjectId,
    ref: "Profile"
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;