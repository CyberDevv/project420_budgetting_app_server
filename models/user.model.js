import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: 'Name is required',
   },
   email: {
      type: String,
      required: 'Email is required',
      unique: true,
   },
   hashPassword: {
      type: String,
      required: 'Password is required',
   },
   createdOn: {
      type: Date,
      default: Date.now,
   },
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
   return bcrypt.compareSync(password, hashPassword);
};

export default mongoose.model('User', UserSchema);
