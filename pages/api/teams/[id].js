import dbConnect from '@/lib/mongodb';
import formidable from "formidable";
import Team from '@/models/Team';

export const config = {
  api: {
    bodyParser: false, // Disables automatic parsing, allowing Formidable to read the stream
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const team = await Team.getById(req.query.id);

        res.status(200).json({ success: true, data: team });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const form = formidable({
          keepExtensions: true,
          uploadDir: '/tmp/',
          allowEmptyFiles: true,
          minFileSize: 0
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
          const team = await Team.update(req.query.id, formData, files.image && files.image[0] ? files.image[0] : {});
          res.status(201).json({ success: true, data: team });
          //console.log(err, fields);
          //console.log(files);
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const team = await Team.remove(req.query.id);
        res.status(201).json({ success: true, data: team });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}