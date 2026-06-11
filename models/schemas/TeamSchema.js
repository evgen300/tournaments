import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  hometown: String,
  user_id: String,
  sports: Array
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);