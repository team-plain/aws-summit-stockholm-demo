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
import { extendLogger } from '../utils/extendLogger';

const dynamoDbTableName = getDynamoDbTableName();
const log = new Logger();
import { z } from 'zod';
const pathParamsSchema = z.object({
  workspaceId: z.string(),
});

const baseHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const pathParamsResult = pathParamsSchema.safeParse(event.pathParameters);
  if (!pathParamsResult.success) {
    return returnError(pathParamsResult.error);
  }
  const path = pathParamsResult.data;
  const workspaceId = path.workspaceId;
  const ctx = { log: extendLogger(log, { workspaceId }), dynamoDbTableName };
  const workspaceResult = await workspaceDomain.getWorkspace(ctx, workspaceId);

  if (workspaceResult.isErr) {
    return returnError(workspaceResult.error);
  }

  return { statusCode: 200, body: JSON.stringify(workspaceResult.value) };
};

export const handler = middy(baseHandler)
  .use(injectLambdaContext(log))
  .use(jsonBodyParser())
  .use(httpErrorHandler());
