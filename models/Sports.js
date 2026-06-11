import SportsSchema from "./schemas/SportsSchema";

const getAll = async function () {
  return await SportsSchema.find({ });
}

export default {
  getAll
}