import { DatabaseContext, LoggingContext } from '../services/utils/context';
import { getCloudformationOutput } from './getCloudformationOutputs';
import { Logger } from '@aws-lambda-powertools/logger';

export function createTestContext(): DatabaseContext & LoggingContext {
  return {
    dynamoDbTableName: getCloudformationOutput('DatabaseStack', 'TableName'),
    log: new Logger({
      logLevel: 'ERROR',
    }),
  };
}
