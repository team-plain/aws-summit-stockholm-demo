import * as fs from 'fs';

export function getStage(): string {
  if (process.env.STAGE) {
    return process.env.STAGE;
  }
  if (fs.existsSync('.sst/stage') && fs.statSync('.sst/stage').isFile()) {
    return fs.readFileSync('.sst/stage').toString().trim();
  }
  throw new Error('Stage not defined via STAGE envvar or .sst/stage file');
}
