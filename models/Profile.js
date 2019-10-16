import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const profileSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  website: String,
  twitter: String,
  facebook: String,
  instagram: String,
  reddit: String,
  youtube: String,
  user_id: String,
  role: String,
  proUser: Boolean,
  partner: Boolean,
  stories: [{
    type: ObjectId,
    ref: "Story"
  }],
  profileCreated: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;