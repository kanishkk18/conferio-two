import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
})


// lib/aws-s3.ts
// This remains the same as previous implementation
// import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from 'uuid';

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || 'ap-south-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export interface UploadResult {
//   url: string;
//   key: string;
//   name: string;
//   type: string;
//   size: number;
// }

// export class S3UploadService {
//   private static instance: S3UploadService;
//   private bucketName = process.env.AWS_S3_BUCKET || 'conferiotestbkt';

//   public static getInstance(): S3UploadService {
//     if (!S3UploadService.instance) {
//       S3UploadService.instance = new S3UploadService();
//     }
//     return S3UploadService.instance;
//   }

//   async uploadFile(
//     file: Buffer,
//     originalName: string,
//     mimeType: string,
//     folder: 'attachments' | 'covers' | 'comments' = 'attachments'
//   ): Promise<UploadResult> {
//     try {
//       const fileExtension = originalName.split('.').pop();
//       const key = `${folder}/${uuidv4()}.${fileExtension}`;

//       const command = new PutObjectCommand({
//         Bucket: this.bucketName,
//         Key: key,
//         Body: file,
//         ContentType: mimeType,
//         ACL: 'public-read',
//       });

//       await s3Client.send(command);

//       const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

//       return {
//         url,
//         key,
//         name: originalName,
//         type: mimeType,
//         size: file.length,
//       };
//     } catch (error) {
//       console.error('S3 upload error:', error);
//       throw new Error('Failed to upload file to S3');
//     }
//   }

//   async deleteFile(key: string): Promise<void> {
//     try {
//       const command = new DeleteObjectCommand({
//         Bucket: this.bucketName,
//         Key: key,
//       });

//       await s3Client.send(command);
//     } catch (error) {
//       console.error('S3 delete error:', error);
//       throw new Error('Failed to delete file from S3');
//     }
//   }
// }

// export const s3UploadService = S3UploadService.getInstance();