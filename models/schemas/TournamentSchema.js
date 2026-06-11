import mongoose from 'mongoose';

const TournamentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date_start: Date,
  date_end: Date,
  place: String,
  categories: Array,
  teams: Array,
  players: Array,
  user_id: String,
  chief: String,
  sports: Array
  /*has_playoff: Boolean,
  has_groups: Boolean,
  groups_count: Number,
  has_seeds: Boolean,
  teams: Array,
  teams_tournament: Boolean,
  players_tournament: Boolean,
  players: Array*/
});

export default mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);