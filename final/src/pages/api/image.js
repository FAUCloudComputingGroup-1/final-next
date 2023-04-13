import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import mongoose from 'mongoose';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


mongoose.connect("mongodb+srv://chefomardee:211473Ok@chefcluster.cq71b3r.mongodb.net/?retryWrites=true&w=majority");

const metadataSchema = new mongoose.Schema({
  size: Number,
  width: Number,
  height: Number,
  name: String,
  _id: String,
  user: String,
}, { collection: 'chefomardee-testing' });

const modelName = 'nim';
let img;
if (mongoose.models[modelName]) {
  img = mongoose.model(modelName);
} else {
  img = mongoose.model(modelName, metadataSchema);
}

async function handler(req, res) {
  try {
    let url = req.query.url;
    console.log("bhad")
    console.log(url)
    console.log("babie")

    const startIndex = url.lastIndexOf("/") + 1;

    // Get the index of the first character after the file name
    const endIndex = url.indexOf("?");
    
    // Extract the file name
    const fileName = url.substring(startIndex, endIndex);

    const bucketParams = { Bucket: "chefomardee-testing", Key:fileName };
    const client = new S3Client({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    });
    console.log(fileName);
    const data = await client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.", data);
    await img.deleteOne({ name:fileName});
    res.status(200).json({ success: true, message: "Object deleted.", height });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
export default withApiAuthRequired(handler)