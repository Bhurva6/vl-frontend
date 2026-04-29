import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { S3Client } from '@aws-sdk/client-s3'

const credentials = {
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID as string,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string,
}

const region = import.meta.env.VITE_AWS_REGION as string

export const dynamoDocClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region, credentials }),
)

export const s3Client = new S3Client({ region, credentials })
