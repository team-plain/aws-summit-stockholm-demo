import { assert } from 'assert-ts';

export function getDynamoDbTableName(): string {
  const envvar = 'DYNAMODB_TABLE_NAME';
  const tableName = process.env[envvar];
  assert(!!tableName, `${envvar} environment variable not defined`);
  return tableName;
}
