import { ApiStack } from './ApiStack';
import { DatabaseStack } from './DatabaseStack';
import * as sst from '@serverless-stack/resources';
import * as cdk from 'aws-cdk-lib';

export default function main(app: sst.App): void {
  // This is a demo, so we want all our resources to be destroyed after
  app.setDefaultRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: 'nodejs14.x',
  });

  const database = new DatabaseStack(app, 'DatabaseStack');

  new ApiStack(app, 'ApiStack', {
    dynamodbTable: database.dynamodbTable,
  });
}
