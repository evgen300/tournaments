import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        let params = [];
        Object.keys(req.query).forEach(field => {
          switch (field) {
            case 'name':
              params.push({field: field, value: req.query[field], compare: 'like'});
              break;
            case 'sex':
              params.push({field: field, value: req.query[field], compare: '='});
              break;
            case 'age_from':
            case 'ageFrom':
              params.push({field: field, value: req.query[field], compare: '<='});
              break;
            case 'age_to':
            case 'ageTo':
              params.push({field: field, value: req.query[field], compare: '>='});
              break;
            case "team_id":
              params.push({field: field, value: req.query[field].split(","), compare: 'in'});
              break;
            case "tournament_id":
              params.push({field: field, value: req.query[field], compare: "in"});
              break;
          }
        });
        const players = await Player.filter(params);

        res.status(200).json({ success: true, data: players });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}