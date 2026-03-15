import mongoose from "mongoose";

const secureNotesSchema = new mongoose.Schema({
  name: { type: String },
  favorite: { type: Boolean, default: false },
  notes: { type: String },
  encrypt: { type: Boolean, default: false },
  email: { type: String, select: false },
});

export default mongoose.models.securenotes ||
  mongoose.model("securenotes", secureNotesSchema);
