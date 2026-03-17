"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
  Shield,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  acceptInviteSchema,
  type AcceptInviteFormData,
} from "@/lib/validations/auth";

const NitroganLogo = () => (
  <svg
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className="size-8 text-primary"
  >
    <g clipPath="url(#clip0_invite)">
      <path
        clipRule="evenodd"
        d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_invite">
        <rect fill="white" height="48" width="48" />
      </clipPath>
    </defs>
  </svg>
);

function InvitePageContent() {
  const searchParams = useSearchParams();
  const orgName = searchParams.get("org") || "your team";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFormData>({
    resolver: yupResolver(acceptInviteSchema),
  });

  const onSubmit = (data: AcceptInviteFormData) => {
    // TODO: connect to backend
    console.log("Accept invite data:", data, { orgName });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="absolute right-[-10%] top-20 h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-20 left-[-10%] h-[30%] w-[30%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-4">
          <NitroganLogo />
          <h2 className="text-xl font-bold tracking-tight">Nitrogan</h2>
        </Link>
        <Link
          href="#"
          className="flex h-10 min-w-[84px] items-center justify-center rounded-lg bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Help Center
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-[480px] flex-col gap-8">
          {/* Welcome Section */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
              <ShieldCheck className="size-7 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Secure Invitation
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Welcome to the team
            </h1>
            <p className="text-lg text-muted-foreground">
              You&apos;ve been invited to join{" "}
              <span className="font-bold text-foreground">{orgName}</span> on
              Nitrogan. Let&apos;s get your account set up with a secure
              password.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Set Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    className="h-14 pr-11"
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
                {errors.password ? (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                ) : (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Info className="size-3" />
                    Must be at least 8 characters with a mix of letters and
                    symbols.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-type your password"
                    className="h-14 pr-11"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 w-full gap-2 text-lg font-bold"
                >
                  Join Team
                  <ArrowRight className="size-5" />
                </Button>
              </div>
            </form>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              By joining, you agree to Nitrogan&apos;s{" "}
              <Link
                href="#"
                className="font-medium text-primary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="font-medium text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2 opacity-50 grayscale">
                <Shield className="size-5 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Enterprise Grade
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-50 grayscale">
                <LockKeyhole className="size-5 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  End-to-End Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense>
      <InvitePageContent />
    </Suspense>
  );
}
