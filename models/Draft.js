import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const draftSchema = new Schema({
  title: String,
  body: String,
  username: String,
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

const Draft = mongoose.model("Draft", draftSchema);

module.exports = Draft;