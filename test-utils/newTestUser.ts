import request from 'supertest';
import { getCloudformationOutput } from './getCloudformationOutputs';

export type TestUser = {
  request: request.SuperTest<request.Test>;
};

export function newTestUser(): TestUser {
  // In this demo we're not creating users, but we'd normally want to create
  // or configure which user we'll be using
  return {
    request: request(getCloudformationOutput('ApiStack', 'ApiEndpoint')),
  };
}
