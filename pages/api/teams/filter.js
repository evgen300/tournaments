import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        console.log(req.query);
        let params = [];
        Object.keys(req.query).forEach(field => {
          switch (field) {
            case 'title':
              params.push({field: field, value: req.query[field], compare: 'like'});
              break;
            case 'sports':
              params.push({field: field, value: Array.isArray(req.query[field]) ? req.query[field] : [req.query[field]], compare: 'in'});
              break;
          }
        });
        const teams = await Team.filter(params);

        res.status(200).json({ success: true, data: teams });
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