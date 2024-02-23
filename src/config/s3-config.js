import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl  } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
dotenv.config();


// configuration
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});


// Uploading file to S3 Bucket
export const uploadFile = async (fileBuffer, fileName) => {
    try {
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
      };
      const result = await s3Client.send(new PutObjectCommand(uploadParams));
      return result;
    } catch (error) {
      throw error;
    }
};


// Get the invoices signed URL
export const getObjectSignedUrl = async (fileName) => {
    try {
      const getParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
      };
      const command = new GetObjectCommand(getParams);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.log("Error! inside getObjectSignedUrl function");
      throw error;
    }
};