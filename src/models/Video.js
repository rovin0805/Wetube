import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxLength: 50 },
  description: { type: String, required: true, trim: true, maxLength: 200 },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

videoSchema.static('formatHashtags', function (hashtags) {
  return hashtags
    .split(',')
    .map((word) =>
      word.trim().startsWith('#') ? word.trim() : `#${word.trim()}`
    );
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
