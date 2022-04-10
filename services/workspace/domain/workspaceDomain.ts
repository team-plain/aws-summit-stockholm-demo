import { Result } from 'true-myth';
import { NewWorkspace, Workspace } from './workspaceModel';
import { newId } from '../../utils/id';
import { dynamoClient } from '../../utils/dynamoClient';
import { DatabaseContext, LoggingContext } from '../../utils/context';
import { WorkspaceDoesNotExistError } from '../../utils/errors';
import { expiresIn6Hours } from '../../utils/expiresIn6Hours';

export async function createWorkspace(
  ctx: DatabaseContext & LoggingContext,
  newWorkspace: NewWorkspace
): Promise<Result<Workspace, WorkspaceDoesNotExistError>> {
  const workspace: Workspace = {
    id: newId(),
    name: newWorkspace.name,
  };
  ctx.log.info('Creating workspace', { workspaceId: workspace.id });
  await dynamoClient.put({
    TableName: ctx.dynamoDbTableName,
    ConditionExpression: 'attribute_not_exists(#sk)',
    ExpressionAttributeNames: {
      '#sk': 'sk',
    },
    Item: {
      pk: `WORKSPACE#${workspace.id}`,
      sk: `WORKSPACE`,
      expiresAt: expiresIn6Hours(),
      ...workspace,
    },
  });
  ctx.log.info('Workspace created', { workspaceId: workspace.id });
  return Result.ok(workspace);
}

export async function getWorkspace(
  ctx: DatabaseContext & LoggingContext,
  workspaceId: string
): Promise<Result<Workspace, WorkspaceDoesNotExistError>> {
  ctx.log.info('Fetching workspace', { workspaceId });
  const dynamoDbResult = await dynamoClient.get({
    TableName: ctx.dynamoDbTableName,
    Key: {
      pk: `WORKSPACE#${workspaceId}`,
      sk: `WORKSPACE`,
    },
  });
  if (dynamoDbResult.Item) {
    ctx.log.info('Workspace found with id', { workspaceId });
    return Result.ok(Workspace.parse(dynamoDbResult.Item));
  } else {
    ctx.log.info('Workspace not found', { workspaceId });
    return Result.err({ type: 'workspace_does_not_exist', workspaceId });
  }
}
