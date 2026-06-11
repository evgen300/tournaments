import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  birth: Date,
  team_id: String,
  grade: String,
  sex: String,
  active: Boolean,
  second_name: String,
  index: Number
});

export default mongoose.models.Player || mongoose.model('Player', PlayerSchema);