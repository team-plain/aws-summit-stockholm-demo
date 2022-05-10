import { Customer, NewCustomer } from './customerModel';
import { CustomerDoesNotExist, WorkspaceDoesNotExistError } from '../../utils/errors';
import { Result } from 'true-myth';
import { newId } from '../../utils/id';
import { dynamoClient } from '../../utils/dynamoClient';
import { DatabaseContext, LoggingContext, WorkspaceContext } from '../../utils/context';
import { TransactionCanceledException } from '@aws-sdk/client-dynamodb';
import { expiresIn6Hours } from '../../utils/expiresIn6Hours';

export async function createCustomer(
  ctx: DatabaseContext & LoggingContext & WorkspaceContext,
  newCustomer: NewCustomer
): Promise<Result<Customer, WorkspaceDoesNotExistError>> {
  const customer: Customer = Customer.parse({
    id: newId(),
    workspaceId: ctx.workspaceId,
    ...newCustomer,
  });
  try {
    await createCustomerInDatabase(ctx, customer);
  } catch (e) {
    if (
      e instanceof TransactionCanceledException &&
      e.CancellationReasons?.some((reason) => reason.Code === 'ConditionalCheckFailed')
    ) {
      ctx.log.info('Condition check failed for workspace id');
      return Result.err({
        type: 'workspace_does_not_exist',
        workspaceId: customer.workspaceId,
      });
    }
    throw e;
  }

  ctx.log.info('Customer created', { customerId: customer.id });
  return Result.ok(customer);
}

async function createCustomerInDatabase(ctx: DatabaseContext, customer: Customer): Promise<void> {
  await dynamoClient.transactWrite({
    TransactItems: [
      {
        Put: {
          TableName: ctx.dynamoDbTableName,
          ConditionExpression: 'attribute_not_exists(#sk)',
          ExpressionAttributeNames: {
            '#sk': 'sk',
          },
          Item: {
            pk: `WORKSPACE#${customer.workspaceId}`,
            sk: `CUSTOMER#${customer.id}`,
            expiresAt: expiresIn6Hours(),
            ...customer,
          },
        },
      },
      {
        ConditionCheck: {
          TableName: ctx.dynamoDbTableName,
          Key: {
            pk: `WORKSPACE#${customer.workspaceId}`,
            sk: `WORKSPACE`,
          },
          ConditionExpression: 'attribute_exists(#sk)',
          ExpressionAttributeNames: {
            '#sk': 'sk',
          },
        },
      },
    ],
  });
}

export async function getCustomer(
  ctx: LoggingContext & DatabaseContext & WorkspaceContext,
  customerId: string
): Promise<Result<Customer, CustomerDoesNotExist>> {
  ctx.log.info('Fetching customer', { customerId });
  const dynamoDbResult = await dynamoClient.get({
    TableName: ctx.dynamoDbTableName,
    Key: {
      pk: `WORKSPACE#${ctx.workspaceId}`,
      sk: `CUSTOMER#${customerId}`,
    },
  });
  if (dynamoDbResult.Item) {
    ctx.log.info('Customer found with id', { customerId });
    return Result.ok(Customer.parse(dynamoDbResult.Item));
  } else {
    ctx.log.info('Customer not found', { customerId });
    return Result.err({ type: 'customer_does_not_exist', customerId });
  }
}
