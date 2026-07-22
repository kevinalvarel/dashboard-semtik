import * as z from "zod";

export const AddAdminSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type AddAdminSchemaType = z.infer<typeof AddAdminSchema>;
