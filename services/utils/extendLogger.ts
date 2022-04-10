import { Logger } from '@aws-lambda-powertools/logger';

export function extendLogger(log: Logger, extra: { [key: string]: string }): Logger {
  log.addPersistentLogAttributes(extra);
  return log;
}
