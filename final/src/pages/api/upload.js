import S3 from "aws-sdk/clients/s3";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import mongoose from 'mongoose';

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env._ACCESS_KEY_ID,
  secretAccessKey: process.env._SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

mongoose.connect("mongodb+srv://chefomardee:211473Ok@chefcluster.cq71b3r.mongodb.net/?retryWrites=true&w=majority");
const metadataSchema = new mongoose.Schema({
  size: Number,
  width: Number,
  height: Number,
  name: String,
  _id: String,
  user: String,
}, { collection: 'chefomardee-testing' });

const modelName = 'Image';

let Image;
if (mongoose.models[modelName]) {
  Image = mongoose.model(modelName);
} else {
  Image = mongoose.model(modelName, metadataSchema);
}

 let handler=async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    let { name, type, height, width, size } = req.body;
    let tru = `https://chefomardee-testing.s3.amazonaws.com/${name}`;

    const session = await getSession(req, res);
    console.log(await Image.deleteOne({ _id:tru}))
    const fileParams = {
      Bucket: process.env._BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      Tagging: `user=${session.user.sub}`
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    

    const newImage = new Image({
      size:size,
      width:width,
      height:height,
      name: name,
      _id: tru,
      user: ((session.user.sub).replace("|", "")),
    });
    await newImage.save();
    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "image already exists" });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb", // Set desired value here
    },
  },
};
export default withApiAuthRequired(handler)