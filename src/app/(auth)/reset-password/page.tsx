"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyRound, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { useResetPassword } from "@/features/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    // Success/error toasts are handled centrally by the axios client.
    resetPassword.mutate(
      { token, password: data.password },
      { onSuccess: () => router.push("/sign-in") },
    );
  };

  // No token → the link was malformed or copied incompletely.
  if (!token) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-xl bg-destructive/10">
          <ShieldCheck className="size-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Invalid reset link</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This password reset link is missing or incomplete. Request a new one to
          continue.
        </p>
        <Link
          href="/forgot-password"
          className="mt-2 text-sm font-bold text-primary hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password you don&apos;t reuse on other sites.
        </p>
      </div>

      {/* New password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            className="h-12 pl-11 pr-11"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat new password"
            className="h-12 pl-11 pr-4"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={resetPassword.isPending}
        className="h-12 w-full text-base font-bold"
      >
        Reset password
      </Button>

      <Link
        href="/sign-in"
        className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-xl">
        <Suspense
          fallback={
            <p className="text-center text-sm text-muted-foreground">Loading…</p>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
