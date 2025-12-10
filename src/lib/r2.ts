import { S3Client } from '@aws-sdk/client-s3'
import { config } from '../config'

// Cliente S3 configurado para Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
})

export default r2Client
