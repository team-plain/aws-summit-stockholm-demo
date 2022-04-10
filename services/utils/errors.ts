export interface WorkspaceDoesNotExistError {
  readonly type: 'workspace_does_not_exist';
  readonly workspaceId: string;
}

export interface CustomerDoesNotExist {
  readonly type: 'customer_does_not_exist';
  readonly customerId: string;
}
