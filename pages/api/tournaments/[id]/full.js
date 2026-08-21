import dbConnect from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

import { getSession, authOptions } from "@/lib/auth";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  //console.log(req.cookies);
  const userSession = await getSession(req, res);
  if (!userSession) {
    return {};
  }

  switch (method) {
    case 'GET':
      if (!userSession.user || !userSession.user.id) {
        return {};
      }
      try {
        const tournament = await Tournament.getFullTournamentInfo(req.query.id, userSession.user.role === "admin" ? null : user.id);

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