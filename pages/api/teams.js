import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';

import { getSession } from '@/lib/auth';

import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disables automatic parsing, allowing Formidable to read the stream
  },
};

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
        const form = formidable({
          keepExtensions: true,
          uploadDir: '/tmp/'
        });
        form.parse(req, async (err, fields, files) => {
          let formData = {};
          Object.keys(fields).forEach(field => {
            if (fields[field].length > 0) {
              if (['sports'].includes(field)) {
                formData[field] = fields[field][0].split(',');
              } else {
                formData[field] = fields[field][0];
              }
            }
          });
          formData.user_id = userSession.user.id;
          const team = await Team.create(formData, files.image && files.image[0] ? files.image[0] : {});
          res.status(201).json({ success: true, data: team });
          //console.log(err, fields);
          //console.log(files);
        });
        /*console.log(teamData);
        teamData.user_id = userSession.user.id;
        const team = await Team.create(teamData);
        res.status(201).json({ success: true, data: tournament });*/
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