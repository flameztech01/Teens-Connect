import mongoose from "mongoose";

const anonymousSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  media: {
    type: String,
    default: null
  },
  mediaType: {
    type: String,
    enum: ["image", "video", null],
    default: null
  },
  tags: [{
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  sharedToWhatsApp: {
    type: Boolean,
    default: false
  },
  sharedAt: {
    type: Date,
    default: null
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Anonymous = mongoose.model("Anonymous", anonymousSchema);
export default Anonymous;