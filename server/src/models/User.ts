import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);

export default User;
