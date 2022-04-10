import { Workspace } from '../workspace/domain/workspaceModel';
import { createWorkspace } from '../workspace/domain/workspaceDomain';
import { createTestContext } from '../../test-utils/createTestContext';
import { expectResultSuccess } from '../../test-utils/expectResultSuccess';
import { newTestUser, TestUser } from '../../test-utils/newTestUser';
import { newId } from '../utils/id';

describe('POST /workspaces/{workspaceId}/customers', () => {
  let user: TestUser;
  let workspace: Workspace;

  beforeAll(async () => {
    user = newTestUser();
    workspace = await createWorkspace(createTestContext(), {
      name: 'Test workspace',
    }).then(expectResultSuccess);
  });

  describe('happy path', () => {
    test('should successfully create a customer', async () => {
      const createResponse = await user.request.post(`/workspaces/${workspace.id}/customers`).send({
        firstName: 'Donald',
        lastName: 'Duck',
        email: 'donald@duck.com',
      });

      expect(createResponse.status).toBe(200);
      const createResponseBody = JSON.parse(createResponse.text);
      expect(createResponseBody).toStrictEqual({
        id: expect.stringMatching(/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/),
        workspaceId: workspace.id,
        firstName: 'Donald',
        lastName: 'Duck',
        email: 'donald@duck.com',
      });

      const getResponse = await user.request
        .get(`/workspaces/${workspace.id}/customers/${createResponseBody.id}`)
        .send();
      expect(getResponse.status).toBe(200);
      expect(JSON.parse(getResponse.text)).toStrictEqual({
        id: createResponseBody.id,
        workspaceId: workspace.id,
        firstName: 'Donald',
        lastName: 'Duck',
        email: 'donald@duck.com',
      });
    });
  });

  describe('unhappy path', () => {
    test('should fail to create a customer with an invalid workspace id', async () => {
      const randomWorkspaceId = newId();
      const response = await user.request
        .post(`/workspaces/${randomWorkspaceId}/customers`)
        .set('Accept', 'application/json')
        .send({
          firstName: 'Donald',
          lastName: 'Duck',
          email: 'donald@duck.com',
        });

      expect(response.status).toBe(404);
      expect(JSON.parse(response.text)).toMatchObject({
        code: 'workspace_does_not_exist',
      });
    });

    test.skip('should fail to create a customer with an invalid payload', async () => {
      const response = await user.request
        .post(`/workspaces/${workspace.id}/customers`)
        .set('Accept', 'application/json')
        .send({
          firstName: 'Donald',
        });

      expect(response.status).toBe(400);
      expect(JSON.parse(response.text)).toMatchObject({
        code: 'input_validation_failed',
        message: expect.stringMatching(/^Failed to parse payload/),
      });
    });
  });
});
