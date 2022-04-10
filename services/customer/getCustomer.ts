import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import * as customerDomain from './domain/customerDomain';
import 'source-map-support/register';

import { returnError } from '../utils/returnError';
import { getDynamoDbTableName } from '../utils/getDynamoDbTableName';
import { injectLambdaContext, Logger } from '@aws-lambda-powertools/logger';
import { z } from 'zod';
import { extendLogger } from '../utils/extendLogger';

const dynamoDbTableName = getDynamoDbTableName();
const log = new Logger();

const pathParamsSchema = z.object({
  workspaceId: z.string().nonempty(),
  customerId: z.string().nonempty(),
});

const baseHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const pathParamsResult = pathParamsSchema.safeParse(event.pathParameters);
  if (!pathParamsResult.success) {
    return returnError(pathParamsResult.error);
  }
  const path = pathParamsResult.data;
  const workspaceId = path.workspaceId;
  const ctx = {
    dynamoDbTableName,
    log: extendLogger(log, { workspaceId }),
    workspaceId,
  };
  const customerResult = await customerDomain.getCustomer(ctx, path.customerId);

  if (customerResult.isErr) {
    return returnError(customerResult.error);
  }

  return { statusCode: 200, body: JSON.stringify(customerResult.value) };
};

export const handler = middy(baseHandler)
  .use(injectLambdaContext(log))
  .use(jsonBodyParser())
  .use(httpErrorHandler());
