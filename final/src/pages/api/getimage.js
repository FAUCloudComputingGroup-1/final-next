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
    const objects = response.Contents;

    // Get tags for all objects in parallel
    const objectsWithTagPromises = objects.map((object) =>
      s3.getObjectTagging({
        Bucket: params.Bucket,
        Key: object.Key,
      }).promise().then(tagsResponse => {
        const tags = tagsResponse.TagSet;
        return {
          ...object,
          tags,
        };
      })
    );

    const objectsWithTag = await Promise.all(objectsWithTagPromises);

    // Filter objects by tag value
    const filteredObjects = objectsWithTag.filter((object) =>
      object.tags.some((tag) => tag.Value === (req.query.userSub).replace('|',''))
    );

    // Generate signed URLs for filtered objects
    const imageUrls = filteredObjects.map((object) =>
      s3.getSignedUrl('getObject', {
        Bucket: params.Bucket,
        Key: object.Key,
      })
    );
    res.json(imageUrls);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
};