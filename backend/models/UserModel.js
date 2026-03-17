import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: { type: String, required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
  },
  likedMovies: [
    {
      movieId: String,
      title: String,
      image: String,
    },
  ],
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionExpiryDate: { // NOUVEAU CHAMP
    type: Date,
    default: null,
  },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
