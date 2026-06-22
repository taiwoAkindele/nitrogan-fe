"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, ArrowLeft, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { useForgotPassword } from "@/features/auth";

const NitroganLogo = () => (
  <svg
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className="size-8 text-primary"
  >
    <g clipPath="url(#clip0_forgot)">
      <path
        clipRule="evenodd"
        d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_forgot">
        <rect fill="white" height="48" width="48" />
      </clipPath>
    </defs>
  </svg>
);

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // The backend is enumeration-safe (always 200), so we show the confirmation
  // screen on success regardless of whether the email is registered. The success
  // toast is handled centrally by the axios client.
  const forgot = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgot.mutate(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setSubmitted(true);
      },
    });
  };

  const isSubmitting = forgot.isPending;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 justify-center px-4 py-5 md:py-20">
        <div className="flex w-full max-w-[480px] flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border px-4 py-6">
            <Link href="/" className="flex items-center gap-4">
              <NitroganLogo />
              <h2 className="text-2xl font-bold tracking-tight">Nitrogan</h2>
            </Link>
            <Link
              href="/sign-in"
              className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            >
              <X className="size-5" />
            </Link>
          </header>

          {submitted ? (
            /* Success State */
            <div className="flex flex-col items-center gap-4 px-4 pt-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="size-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Check your email
              </h1>
              <p className="max-w-sm text-muted-foreground">
                We&apos;ve sent a password reset link to{" "}
                <span className="font-semibold text-foreground">
                  {submittedEmail}
                </span>
                . Please check your inbox.
              </p>
              <Link
                href="/sign-in"
                className="mt-4 flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                <ArrowLeft className="size-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              {/* Content Section */}
              <div className="mt-8 flex flex-col gap-3 px-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  Forgot password?
                </h1>
                <p className="text-base text-muted-foreground">
                  No worries, it happens. Enter the email address associated
                  with your account and we&apos;ll send you a link to reset your
                  password.
                </p>
              </div>

              {/* Form Section */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 px-4 py-6"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="h-14 pl-11 pr-4"
                      aria-invalid={!!errors.email}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full text-base font-bold"
                >
                  Send reset link
                </Button>
              </form>

              {/* Footer Links */}
              <div className="flex flex-col items-center gap-4 px-4 py-4">
                <Link
                  href="/sign-in"
                  className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <ArrowLeft className="size-4" />
                  Back to login
                </Link>
                <div className="mt-8 w-full border-t border-border pt-8 text-center">
                  <p className="text-xs text-muted-foreground">
                    &copy; 2026 Nitrogan Inc. All rights reserved.
                    <br />
                    Need help?{" "}
                    <Link
                      href="#"
                      className="text-primary hover:underline"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
