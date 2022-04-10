import { ulid } from 'ulid';

export function newId(): string {
  return ulid();
}
