import { z } from 'zod';

export const loginSchema = z.object({
  fullname: z.string().optional(),
  email: z.email('Email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(50, 'Password terlalu panjang'),
});

export type FormLoginType = z.infer<typeof loginSchema>;
