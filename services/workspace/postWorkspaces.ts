import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { NewWorkspace } from './domain/workspaceModel';
import * as workspaceDomain from './domain/workspaceDomain';
import { returnError } from '../utils/returnError';
import { getDynamoDbTableName } from '../utils/getDynamoDbTableName';
import 'source-map-support/register';
import { injectLambdaContext, Logger } from '@aws-lambda-powertools/logger';

const dynamoDbTableName = getDynamoDbTableName();
const log = new Logger();

const baseHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const parsedBody = NewWorkspace.safeParse(event.body);
  if (!parsedBody.success) {
    return returnError(parsedBody.error);
  }

  const newWorkspace = parsedBody.data;
  const ctx = { log, dynamoDbTableName };
  const workspaceResult = await workspaceDomain.createWorkspace(ctx, newWorkspace);

  if (workspaceResult.isErr) {
    return returnError(workspaceResult.error);
  }

  return { statusCode: 200, body: JSON.stringify(workspaceResult.value) };
};

export const handler = middy(baseHandler)
  .use(injectLambdaContext(log))
  .use(jsonBodyParser())
  .use(httpErrorHandler());
