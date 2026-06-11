import dbConnect from '@/lib/mongodb';
import Tournament from '@/models/Tournament';
import { getSession } from '@/lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  const userSession = await getSession(req, res);
  if (!userSession.user || !userSession.user.id) {
    return {};
  }

  switch (method) {
    case 'GET':
      try {
        const tournaments = await (userSession.user.role !== "admin" ? Tournament.getUserTournaments(userSession.user.id) : Tournament.getAll());
        res.status(200).json({ success: true, data: tournaments });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        let tournamentData = req.body;
        tournamentData.user_id = userSession.user.id;
        const tournament = await Tournament.create(tournamentData);
        res.status(201).json({ success: true, data: tournament });
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