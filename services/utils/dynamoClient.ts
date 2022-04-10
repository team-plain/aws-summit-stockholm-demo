import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import AWSXRay from 'aws-xray-sdk';

export const dynamoClient = DynamoDBDocument.from(
  typeof process.env.IS_LOCAL === 'undefined' || process.env.IS_LOCAL === 'true'
    ? new DynamoDBClient({})
    : AWSXRay.captureAWSv3Client(new DynamoDBClient({}))
);
