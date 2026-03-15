import mongoose from "mongoose";

const uniquepasswdSchema = new mongoose.Schema({
  passwd: { type: String, unique: true },
});

export default mongoose.models.uniquepasswd ||
  mongoose.model("uniquepasswd", uniquepasswdSchema);
