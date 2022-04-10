import * as sst from '@serverless-stack/resources';

export interface ApiStackProps extends sst.StackProps {
  readonly dynamodbTable: sst.Table;
}

export class ApiStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const postWorkspaces = new sst.Function(this, 'PostWorkspaces', {
      handler: 'services/workspace/postWorkspaces.handler',
      functionName: scope.logicalPrefixedName('PostWorkspaces'),
      environment: {
        POWERTOOLS_SERVICE_NAME: 'postWorkspaces',
        DYNAMODB_TABLE_NAME: props.dynamodbTable.tableName,
      },
    });

    const getWorkspace = new sst.Function(this, 'GetWorkspace', {
      handler: 'services/workspace/getWorkspace.handler',
      functionName: scope.logicalPrefixedName('GetWorkspace'),
      environment: {
        POWERTOOLS_SERVICE_NAME: 'getWorkspace',
        DYNAMODB_TABLE_NAME: props.dynamodbTable.tableName,
      },
    });

    const postCustomers = new sst.Function(this, 'PostCustomers', {
      handler: 'services/customer/postCustomers.handler',
      functionName: scope.logicalPrefixedName('PostCustomers'),
      environment: {
        POWERTOOLS_SERVICE_NAME: 'postCustomers',
        DYNAMODB_TABLE_NAME: props.dynamodbTable.tableName,
      },
    });

    const getCustomer = new sst.Function(this, 'GetCustomer', {
      handler: 'services/customer/getCustomer.handler',
      functionName: scope.logicalPrefixedName('GetCustomer'),
      environment: {
        POWERTOOLS_SERVICE_NAME: 'getCustomer',
        DYNAMODB_TABLE_NAME: props.dynamodbTable.tableName,
      },
    });

    const api = new sst.Api(this, 'Api', {
      routes: {
        'POST /workspaces': postWorkspaces,
        'GET /workspaces/{workspaceId}': getWorkspace,
        'POST /workspaces/{workspaceId}/customers': postCustomers,
        'GET /workspaces/{workspaceId}/customers/{customerId}': getCustomer,
      },
    });

    props.dynamodbTable.dynamodbTable.grantReadWriteData(postWorkspaces);
    props.dynamodbTable.dynamodbTable.grantReadWriteData(getWorkspace);
    props.dynamodbTable.dynamodbTable.grantReadWriteData(postCustomers);
    props.dynamodbTable.dynamodbTable.grantReadWriteData(getCustomer);

    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
