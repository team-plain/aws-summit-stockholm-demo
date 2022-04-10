import { CustomerDoesNotExist, WorkspaceDoesNotExistError } from './errors';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ZodError } from 'zod';

export function returnError(
  error: WorkspaceDoesNotExistError | CustomerDoesNotExist | ZodError
): APIGatewayProxyStructuredResultV2 {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        code: 'input_validation_failed',
        message: `Failed to parse payload: ${error.message}`,
      }),
    };
  }
  switch (error.type) {
    case 'workspace_does_not_exist':
      return {
        statusCode: 404,
        body: JSON.stringify({
          code: error.type,
          message: `Workspace doesn't exist: ${error.workspaceId}`,
        }),
      };
    case 'customer_does_not_exist':
      return {
        statusCode: 404,
        body: JSON.stringify({
          code: error.type,
          message: `Customer doesn't exist: ${error.customerId}`,
        }),
      };
  }
}
