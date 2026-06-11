import dbConnect from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

import { getSession } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  const userSession = await getSession(req, res);

  if (!userSession.user || !userSession.user.id) {
    res.status(401).json({});
    return {}
  }

  switch (method) {
    case 'GET':
      try {
        const tournament = await Tournament.getUserTournament(req.query.id, userSession.user.id);

        res.status(200).json({ success: true, data: tournament });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const tournament = await Tournament.update(req.query.id, req.body);
        res.status(201).json({ success: true, data: tournament });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}