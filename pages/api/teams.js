import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';

import { getSession } from '@/lib/auth';

export default async function handler(req, res) {
  await dbConnect();

  const userSession = await getSession(req, res);
  if (!userSession) {
    return {};
  }

  const { method } = req;

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
        const teams = await Team.filter(filterParams);
        res.status(200).json({ success: true, data: teams });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        let teamData = req.body;
        teamData.user_id = userSession.user.id;
        const team = await Team.create(teamData);
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