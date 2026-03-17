// models/VideoModel.js

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, enum: ['anime', 'documentaire', 'serie'] },
  thumbnail: { type: String },
  videoId: { type: String, required: true, unique: true }, // Ajoutez cette ligne
  videoPath: { type: String, required: true },
  isPremium: { type: Boolean, default: true },
});

export default mongoose.model("videos", videoSchema);