import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

import { getSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();

  const userSession = await getSession(req, res);

  if (!userSession.user || !userSession.user.id) {
    return {};
  }

  const { method } = req;

  switch (method) {
    case 'PUT':
      try {
        const request = req.body;
        const user = await User.updatePassword(userSession.user.id, request);

        res.status(200).json({ success: true, data: user });
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