import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  description: { type: String, required: true, trim: true, maxLength: 200 },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
});

// middleware
// videoSchema.pre('save', async function () {
//   this.hashtags = this.hashtags[0]
//     .split(',')
//     .map((word) =>
//       word.trim().startsWith('#') ? word.trim() : `#${word.trim()}`
//     );
// });

videoSchema.static('formatHashtags', function (hashtags) {
  return hashtags
    .split(',')
    .map((word) =>
      word.trim().startsWith('#') ? word.trim() : `#${word.trim()}`
    );
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
