import { Logger } from '@aws-lambda-powertools/logger';

export interface DatabaseContext {
  dynamoDbTableName: string;
}

export interface LoggingContext {
  log: Logger;
}

export interface WorkspaceContext {
  workspaceId: string;
}
