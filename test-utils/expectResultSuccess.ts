import { Result } from 'true-myth';

export function expectResultSuccess<T, E>(result: Result<T, E>): T {
  return result.unwrapOrElse(() => {
    throw new Error(`Expected Result to be Ok, but instead got: ${JSON.stringify(result)}`);
  });
}
