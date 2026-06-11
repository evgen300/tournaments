import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

import { getSession } from '@/lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  const userSession = await getSession(req, res);

  if (!userSession) {
    return {};
  }

  switch (method) {
    case 'GET':
      try {
        let filterParams = [];
        if (userSession.user.role !== "admin") {
          filterParams = [
            {
              field: "user_id",
              compare: "=",
              value: userSession.user.id
            }
          ];
        }
        const players = await Player.filter(filterParams);
        res.status(200).json({ success: true, data: players });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const player = await Player.create(req.body);
        res.status(201).json({ success: true, data: player });
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