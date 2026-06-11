import dbConnect from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const request = req.body;
        const tournament = await Tournament.draw(req.query.id, request.category_id);

        res.status(200).json({ success: true, data: tournament });
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