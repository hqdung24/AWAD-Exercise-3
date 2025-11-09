import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const signinSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .required();

export class SigninDto extends createZodDto(signinSchema) {}
