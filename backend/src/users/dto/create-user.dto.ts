import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
export const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })
  .strict();

export class CreateUserDto extends createZodDto(createUserSchema) {}
