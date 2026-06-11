import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const team = await Team.getById(req.query.id);

        res.status(200).json({ success: true, data: team });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const team = await Team.update(req.query.id, req.body);
        res.status(201).json({ success: true, data: team });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const team = await Team.remove(req.query.id);
        res.status(201).json({ success: true, data: team });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}