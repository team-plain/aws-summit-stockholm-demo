import { z } from 'zod';

export const NewWorkspace = z.object({
  name: z.string().nonempty().max(500),
});

export type NewWorkspace = z.infer<typeof NewWorkspace>;

export const Workspace = z
  .object({
    id: z.string(),
  })
  .merge(NewWorkspace);

export type Workspace = z.infer<typeof Workspace>;
