const AWS = require('aws-sdk');

// configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

// create S3 instance
const s3 = new AWS.S3();

export default async (req, res) => {
  const params = {
    Bucket: 'chefomardee-testing',
  };
  
  try {
    const response = await s3.listObjectsV2(params).promise();
    var images = response.Contents.filter((file) =>
      file.Key.startsWith(req.query.userSub) &&
      ['.jpg', '.jpeg', '.png', '.gif'].includes(
        file.Key.substring(file.Key.lastIndexOf('.'))
      )
    );         
    const imageUrls = images.map((image) =>
      s3.getSignedUrl('getObject', {
        Bucket: params.Bucket,
        Key: image.Key,
      })
    );
    res.json(imageUrls);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
};
