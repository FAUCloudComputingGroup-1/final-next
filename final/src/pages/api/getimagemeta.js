import mongoose from 'mongoose';

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

export default async function handler(req, res) {
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


    console.log(fileName);
    const data = await client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.", data);
    let meta=await imag.findOne({ name:fileName});
    res.status(200).json({ success: true, message: "Object deleted.", obj:meta});
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
