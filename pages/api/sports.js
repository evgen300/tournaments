import dbConnect from '@/lib/mongodb';
import Sports from '@/models/Sports';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const sports = await Sports.getAll();
        res.status(200).json({ success: true, data: sports });
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