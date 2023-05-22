import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as url from 'url';
import * as path from 'path';

// const dotenv = require('dotenv');
// dotenv.config()

@Injectable()
export class S3Service {
  private bucket: string;
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: String(process.env.AWSAccessKeyId),
        secretAccessKey: String(process.env.AWSSecretKey),
      },
    });
    this.bucket = String(process.env.AWS_BUCKET_NAME);
  }

  async uploadFile(file: any) {
    try {
      const fileName =
        file.fieldname + '-' + Date.now() + path.extname(file.originalname);
      const params = {
        Bucket: this.bucket,
        ACL: 'public-read',
        Key: fileName,
        Body: file.buffer,
      };
      return await this.s3.upload(params).promise();
    } catch (error) {
      throw error;
    }
  }

  async deletedFile(objFile: any) {
    try {
      const filename = url.parse(objFile);
      console.log(`filename`, filename);
      if (filename) {
        const params = { Bucket: this.bucket, Key: String(filename.pathname) };
        return await this.s3.deleteObject(params).promise();
      }
    } catch (error) {
      throw error;
    }
  }

  async uploadCert(fileName: string, content: string) {
    try {
      const params = {
        Bucket: this.bucket,
        ACL: 'public-read',
        Key: fileName,
        Body: content,
      };
      return await this.s3.upload(params).promise();
    } catch (error) {
      console.log('🚀 ~ file: s3.service.ts:63 ~ uploadCert ~ error:', error);
    }
  }
}
