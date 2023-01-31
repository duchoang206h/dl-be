const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const uploadSingleFile = async (buffer, fileName) => {
  return await s3
    .upload({
      Body: buffer,
      Key: fileName,
      Bucket: process.env.BUCKET_NAME,
    })
    .promise();
};
module.exports = {
  uploadSingleFile,
};
