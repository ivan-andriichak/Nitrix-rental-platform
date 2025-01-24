import { ObjectCannedACL } from '@aws-sdk/client-s3/dist-types/models';
import dotenv from 'dotenv';

dotenv.config();

export const configs = {
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOST: process.env.APP_HOST,

  FRONTEND_URL: process.env.FRONTEND_URL,

  MONGO_URL: process.env.MONGO_URL,

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_ACL: process.env.AWS_S3_ACL as ObjectCannedACL,
  AWS_ENDPOINT_URL: process.env.AWS_ENDPOINT_URL,
};
