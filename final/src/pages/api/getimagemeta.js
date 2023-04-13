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

const modelName = 'von';
let imag;
if (mongoose.models[modelName]) {
  imag = mongoose.model(modelName);
} else {
  imag = mongoose.model(modelName, metadataSchema);
}

async function handler(req, res) {
  try {
    let url = req.query.url;

    const startIndex = url.lastIndexOf("/") + 1;
    // Get the index of the first character after the file name
    const endIndex = url.indexOf("?");
    // Extract the file name
    const fileName = url.substring(startIndex, endIndex);


    let meta=await imag.findOne({ name:fileName});
    res.status(200).send(meta);
  } catch (err) {
    res.status(200).send("stuff happens");
  }
}
export default withApiAuthRequired(handler)
