import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  to: {
    type: ObjectId,
    ref: "User"
  },
  from: {
    type: ObjectId,
    ref: "User"
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  body: String
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;