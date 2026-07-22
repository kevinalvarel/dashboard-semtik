import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddAdminSchema,
  type AddAdminSchemaType,
} from "@/validations/add-admin";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// shadcn UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Icons
import {
  UserPlus,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  CheckCircle,
} from "lucide-react";

export function AddAdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AddAdminSchemaType>({
    resolver: zodResolver(AddAdminSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: AddAdminSchemaType) => {
    setIsLoading(true);
    try {
      // Create user using authClient signUp
      const nameFromEmail = values.email.split("@")[0] || "Admin";
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: nameFromEmail,
      });

      if (data) {
        toast.success(`Admin baru (${values.email}) berhasil ditambahkan!`);
        form.reset();
      } else {
        toast.error(error?.message || "Gagal menambahkan admin baru!");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Tambah Akun Admin Baru
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Isi kredensial email dan password untuk memberikan akses pengelola
              ke dashboard.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            {/* Email Field */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="admin-email"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    Alamat Email Admin
                  </FieldLabel>
                  <div className="relative mt-1">
                    <Input
                      {...field}
                      id="admin-email"
                      type="email"
                      placeholder="admin.baru@semtik.ac.id"
                      className="bg-muted/30 border-border focus-visible:ring-primary text-sm h-9"
                      disabled={isLoading}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor="admin-password"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                    Password Awal
                  </FieldLabel>
                  <div className="relative mt-1">
                    <Input
                      {...field}
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      className="bg-muted/30 border-border focus-visible:ring-primary text-sm h-9 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer gap-1.5"
              >
                {isLoading ? (
                  "Proses Menambahkan..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Tambah Admin Baru
                  </>
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
