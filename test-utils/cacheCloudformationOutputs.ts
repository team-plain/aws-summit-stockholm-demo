import * as fs from 'fs';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { getStage } from './getStage';

const region =
  process.env.AWS_REGION || JSON.parse(fs.readFileSync('./sst.json').toString()).region;
const stage = getStage();

const stsClient = new STSClient({ region });
async function assertAwsCredentialsValid() {
  const getCallerIdentityCommand = new GetCallerIdentityCommand({});
  try {
    const response = await stsClient.send(getCallerIdentityCommand);
    console.error(
      `Credentials to use: account=${response.Account}, userId=${response.UserId}, role=${response.Arn}`
    );
  } catch (e) {
    if (e instanceof Error && e.name === 'ExpiredToken') {
      console.error(`ERROR: ${e.message}`);
      process.exit(1);
    }
    throw e;
  }
}

const cfnClient = new CloudFormationClient({ region });
async function cacheCfnStackOutputs() {
  const describeStackCommand = new DescribeStacksCommand({});
  const result = await cfnClient.send(describeStackCommand);
  const stacks = result?.Stacks || [];
  const stacksForStage = stacks
    .filter((stack) => stack.StackName && stack.StackName.startsWith(`${stage}-`))
    .map((stack) => ({
      StackName: stack.StackName,
      Outputs: stack.Outputs || [],
    }));
  fs.writeFileSync(`./.itest.cfn.${stage}.json`, JSON.stringify(stacksForStage, null, 2));
}

assertAwsCredentialsValid().then(() => cacheCfnStackOutputs());
