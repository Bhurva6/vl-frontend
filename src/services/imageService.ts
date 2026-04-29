import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3Client } from './aws'

export async function fetchPresignedUrl(imageId: string): Promise<string | null> {
  if (!imageId) return null
  try {
    const command = new GetObjectCommand({
      Bucket: import.meta.env.VITE_S3_BUCKET as string,
      Key: imageId,
    })
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  } catch {
    return null
  }
}
