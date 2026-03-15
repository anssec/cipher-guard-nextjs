import mongoose from "mongoose";

const passwordVaultSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, select: false },
  username: { type: String, trim: true },
  password: { type: String, trim: true },
  website: { type: String, trim: true },
  websiteFavicon: { type: String, trim: true },
  Updated: { type: String, trim: true },
  Created: { type: String, trim: true },
  passwordUpdated: { type: String, trim: true },
  passwordHistory: { type: Number, trim: true, default: 0 },
}, { timestamps: true });

export default mongoose.models.passwordVault ||
  mongoose.model("passwordVault", passwordVaultSchema);
