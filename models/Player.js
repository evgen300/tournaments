import PlayerSchema from "./schemas/PlayerSchema";
import Tournament from "@/models/Tournament";
import Team from "@/models/Team";

const getAllPlayers = async function () {
  /*console.log(await PlayerSchema.updateMany({}, { $set: { sex: "m" }}, { multi: true, upsert: true, new: true }), (err, doc) => {
    console.log(err);
    console.log(doc);
  });
  {
    acknowledged: true,
    modifiedCount: 5,
    upsertedId: null,
    upsertedCount: 0,
    matchedCount: 5
  }*/
  return await PlayerSchema.find({ active: true });
}

const getPlayers = async function (ids = []) {
  return await PlayerSchema.find({ _id: { $in: ids }, active: true }).sort("index");
}

const getById = async function (id) {
  let player = await PlayerSchema.findById(id);

  return player;
}

const update = async function (id, update) {
  return await PlayerSchema.updateOne({ _id: id }, update);
}

const create = async function (params) {
  if (params.team_id) {
    let players = await PlayerSchema.findOne({ team_id: params.team_id }).sort({"index": -1});
    params.index = players && players._id ? players.index + 1 : 1;
  }
  params.active = true;
  return await PlayerSchema.create(params);
}

const remove = async function (id) {
  return await PlayerSchema.updateOne({ _id: id }, { active: false });
}

const filter = async function (filter = []) {
  /*let check = PlayerSchema.aggregate({$project: {fullname: {$concat: ["$first_name", "$last_name"]}}}, {$match: {fullname: new RegExp("Віл", 'i')}});
  console.log(check);
  check = await PlayerSchema.find({$expr:{$eq:[/Віл/, {$concat:["$first_name", "$last_name"]}]}});
  console.log(check);*/
  let params = {};
  for (const field of filter) {
    if (['ageFrom', 'age_from'].includes(field.field)) {
      let dateTime = new Date();
      dateTime.setYear(dateTime.getFullYear() - field.value);
      field.field = "birth";
      field.value = dateTime.toISOString();
    }
    if (['ageTo', 'age_to'].includes(field.field)) {
      let dateTime = new Date();
      dateTime.setYear(dateTime.getFullYear() - field.value);
      field.field = "birth";
      field.value = dateTime.toISOString();
    }
    if (['weightFrom', 'weight_from'].includes(field.field)) {
      field.field = "weight";
      field.value = parseInt(field.value);
    }
    if (['weightTo', 'weight_to'].includes(field.field)) {
      field.field = "weight";
      field.value = parseInt(field.value);
    }
    switch (field.field) {
      case "tournament_id":
        const tounrnament = await Tournament.getById(field.value);
        field.field = "_id";
        field.value = tounrnament.players || [];
        field.compare = 'in';
        break;
      case 'user_id':
        const teams = await Team.filter([
          {
            field: 'user_id',
            value: field.value,
            compare: "="
          }
        ]);
        const teamsIds = teams.reduce((acc, curr) => {
          acc.push(curr._id);
          return acc;
        }, []);
        field.field = "team_id";
        field.value = teamsIds;
        field.compare = "in";
        break;
      case 'name': 
        field.field = '$or';
        let searchRegex = new RegExp(field.value, 'i');
        field.value = [
          {first_name: searchRegex},
          {second_name: searchRegex},
          {last_name: searchRegex}
        ];
        field.compare = 'or';
        break;
      default:
        //if (Array.isArray(field.value)) {

        //} else {
        //}
        break;
    }
    let fieldFilter = null;
    switch (field.compare) {
      case 'like':
        fieldFilter = new RegExp(field.value, 'i');
        break;
      case '<=':
        fieldFilter = { $lte: field.value };
        break;
      case '>=':
        fieldFilter = { $gte: field.value };
        break;
      case 'in':
        fieldFilter = { $in: field.value };
        break;
      default:
        fieldFilter = field.value;
        break;
    }
    if (params.hasOwnProperty(field.field)) {
      params.$and = params.$and || [];
      let fieldValue = {};
      fieldValue[field.field] = fieldFilter;
      params.$and.push(fieldValue);
      let oldValue = {};
      oldValue[field.field] = params[field.field];
      params.$and.push(oldValue);
      delete params[field.field];
    } else {
      params[field.field] = fieldFilter;
    }
  }

  params.active = true;
  return await PlayerSchema.find(params);
}

const getPlayersByIds = async function (ids = []) {
  return await PlayerSchema.find({ _id: { $in: ids } });
}

export default {
  getPlayers,
  getAllPlayers,
  getById,
  update,
  create,
  remove,
  filter,
  getPlayersByIds
}