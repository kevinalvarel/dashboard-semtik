import * as z from "zod";

export const SignInSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
