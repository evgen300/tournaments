import dbConnect from '@/lib/mongodb';
const XLSX = require("xlsx");
const xlsx = require('node-xlsx');
const { formidable, IncomingForm } = require("formidable");

import Player from '@/models/Player';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const form = new IncomingForm()//formidable({});
        const [fields, files] = await form.parse(req);
        console.log(fields);
        let usersData = xlsx.parse(files.file[0].filepath)[0].data;
        for (const user of usersData) {
          if (user[0] !== "#") {
            let birthday = new Date(user[4]);
            let birthDate = birthday;
            const userSaved = await Player.filter([
              { field: "last_name", compare: "=", value: user[1] },
              { field: "first_name", compare: "=", value: user[2] },
              { field: "second_name", compare: "=", value: user[3] },
              { field: "team_id", compare: "=", value: fields.team_id[0] }
            ]);
            console.log("USER CHECK", userSaved);
            if (userSaved.length === 0) {
              await Player.create({
                last_name: user[1],
                first_name: user[2],
                second_name: user[3],
                team_id: fields.team_id[0],
                birth: birthday,
                active: true,
                sex: (user[5] === "ч" ? "m" : "f"),
                grade: user[6]
              });
            }
          }
        }
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err)
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}