import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const player = await Player.getById(req.query.id);

        res.status(200).json({ success: true, data: player });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const player = await Player.update(req.query.id, req.body);
        res.status(201).json({ success: true, data: player });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const player = await Player.remove(req.query.id);
        res.status(201).json({ success: true, data: player });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}