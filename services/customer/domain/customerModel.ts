import { z } from 'zod';

export const NewCustomer = z.object({
  firstName: z.string().nonempty().max(500),
  lastName: z.string().nonempty().max(500),
  email: z.string().email(),
});

export type NewCustomer = z.infer<typeof NewCustomer>;

export const Customer = z
  .object({
    id: z.string(),
    workspaceId: z.string(),
  })
  .merge(NewCustomer);

export type Customer = z.infer<typeof Customer>;
