import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
    sno:{type: Number, required: true,unique: true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phNo: { type: String, required: true, unique: true},
  hobbies: { type: mongoose.Schema.Types.Array },
});

// userSchema.methods.generateToken = function() {
//   const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
//   return token;
// };

export const User = mongoose.model("User", userSchema);
