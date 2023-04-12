import S3 from "aws-sdk/clients/s3";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';



const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});
 let handler=async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    let { name, type, height, width, size } = req.body;
    console.log(name)
    console.log(type)
    console.log(height)
    console.log(width)
    console.log(size)

    const session = await getSession(req, res);
    const fileParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      Tagging: `user=${session.user.sub}`
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
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