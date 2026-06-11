import TeamSchema from "./schemas/TeamSchema";

const getAllTeams = async function () {
  return await TeamSchema.find({  }).sort({ title: 'asc' });
}

const getTeamsByIds = async function (ids = []) {
  return await TeamSchema.find({ _id: { $in: ids } });
}

const create = async function (params) {
  return await TeamSchema.create(params);
}

const getById = async function (id) {
  let team = await TeamSchema.findById(id);

  return team;
}

const update = async function (id, update) {
  return await TeamSchema.updateOne({ _id: id }, update);
}

const remove = async function (id) {
  return await TeamSchema.deleteOne({ _id: id });
}

const filter = async function (filter = []) {
  let params = {};
  for (const field of filter) {
    switch (field.field) {
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

  return await TeamSchema.find(params);
}

export default {
  getAllTeams,
  getTeamsByIds,
  create,
  getById,
  update,
  remove,
  filter
}