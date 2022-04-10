import * as sst from '@serverless-stack/resources';

export class DatabaseStack extends sst.Stack {
  public readonly dynamodbTable: sst.Table;
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.dynamodbTable = new sst.Table(this, 'Database', {
      fields: {
        pk: sst.TableFieldType.STRING,
        sk: sst.TableFieldType.STRING,
      },
      primaryIndex: {
        partitionKey: 'pk',
        sortKey: 'sk',
      },
      dynamodbTable: {
        pointInTimeRecovery: true,
        timeToLiveAttribute: 'expiresAt',
      },
    });

    this.addOutputs({
      TableName: this.dynamodbTable.tableName,
    });
  }
}
