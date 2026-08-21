import dbConnect from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const request = req.body;
        console.log(request);
        const response = Tournament.saveGameResult(req.query.id, request.category_id, request.result, request.groupIdx);
        res.status(200).json({ success: true, data: response });
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