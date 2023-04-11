import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    const bucketParams = { Bucket: "chefomardee-testing", Key: "pan.jpg" };
    const client = new S3Client({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    });
    const data = await client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success. Object deleted.", data);
    res.status(200).json({ success: true, message: "Object deleted." });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
