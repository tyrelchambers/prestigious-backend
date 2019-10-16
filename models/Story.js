import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const storySchema = new Schema({
  title: String,
  body: String,
  author: String,
  tags: [String],
  theme: [String],
  notes: String,
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