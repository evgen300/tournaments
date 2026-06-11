import mongoose from 'mongoose';

const SportsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

export default mongoose.models.Sports || mongoose.model('Sports', SportsSchema);