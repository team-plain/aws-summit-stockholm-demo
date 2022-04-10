import { getStage } from './getStage';
import * as fs from 'fs';

const stage = getStage();
type StackOutputs = {
  StackName: string;
  Outputs: { OutputKey: string; OutputValue: string }[];
};
let stackOutputs: StackOutputs[] | null = null;

export function getCloudformationOutput(stackName: string, outputName: string): string {
  if (stackOutputs === null) {
    stackOutputs = JSON.parse(fs.readFileSync(`./.itest.cfn.${stage}.json`).toString());
  }
  const appName = JSON.parse(fs.readFileSync(`./sst.json`).toString()).name;
  const fullStackName = `${stage}-${appName}-${stackName}`;
  const stack = stackOutputs?.find((s) => s.StackName === fullStackName);
  if (!stack) {
    throw new Error(`Stack not found: ${fullStackName}`);
  }
  const output = stack.Outputs.find((o) => o.OutputKey === outputName);
  if (!output) {
    throw new Error(`Output in stack ${fullStackName} not found: ${outputName}`);
  }
  return output.OutputValue;
}
