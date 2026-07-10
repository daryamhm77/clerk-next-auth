import mongoose from 'mongoose';

const favItemSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  dateReleased: { type: String, default: '' },
  rating: { type: String, default: '' },
  list: {
    type: String,
    enum: ['favorite', 'watchlist', 'watched'],
    default: 'favorite',
  },
});

const recentlyViewedSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' },
  year: { type: String, default: '' },
  viewedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    favs: {
      type: [favItemSchema],
      default: [],
    },
    recentlyViewed: {
      type: [recentlyViewedSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
