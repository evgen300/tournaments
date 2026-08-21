import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String
  },
  lang: {
    type: String
  }
}, {
  bufferCommands: false
});

export default mongoose.models.User || mongoose.model('User', UserSchema);