import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: 'Name is required',
   },
   lastName: {
      type: String,
      required: 'Name is required',
   },
   email: {
      type: String,
      required: 'Email is required',
      unique: true,
      match: [
         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
         'Please provide a valid email',
      ],
   },
   hashPassword: {
      type: String,
      required: 'Password is required',
   },
   balance: {
      type: Number,
      default: 0,
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
