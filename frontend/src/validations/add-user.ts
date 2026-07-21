import * as z from "zod";

export const AddUserSchema = z.object({
  email: z.email("Email Tidak Valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(20, "Nama maksimal 20 karakter"),
});
