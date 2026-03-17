"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations/auth";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score;
}

function getStrengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Strong";
  return "Very strong";
}

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
  });

  const newPassword = watch("newPassword") || "";
  const strength = getPasswordStrength(newPassword);

  const requirements = [
    { label: "At least 8 characters long", met: newPassword.length >= 8 },
    {
      label: "One special character (!@#$%^&*)",
      met: /[!@#$%^&*]/.test(newPassword),
    },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
  ];

  const onSubmit = (data: ChangePasswordFormData) => {
    // TODO: connect to backend
    console.log("Change password data:", data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Nitrogan</h1>
          <p className="mt-2 text-muted-foreground">
            Secure your account by updating your password
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  className="h-12 pl-11 pr-11"
                  aria-invalid={!!errors.currentPassword}
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showCurrent ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="border-t border-border" />

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="h-12 pl-11 pr-11"
                  aria-invalid={!!errors.newPassword}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showNew ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="mt-1 space-y-2">
                  <div className="flex h-1.5 w-full gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-1 rounded-full ${
                          strength >= level ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-primary">
                      {getStrengthLabel(strength)}
                    </span>{" "}
                    password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  className="h-12 pl-11 pr-11"
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

            {/* Requirements Checklist */}
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Security Requirements
              </p>
              {requirements.map((req) => (
                <div
                  key={req.label}
                  className="flex items-center gap-2 text-sm"
                >
                  {req.met ? (
                    <CheckCircle className="size-4 text-primary" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground" />
                  )}
                  <span className={req.met ? "" : "text-muted-foreground"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full text-base font-bold"
            >
              Update Password
            </Button>

            <div className="text-center">
              <Link
                href="#"
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Cancel and return to dashboard
              </Link>
            </div>
          </form>
        </div>

        {/* Footer Notice */}
        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          Changing your password will sign you out of all other active sessions.
          <br />
          If you didn&apos;t request this change, please{" "}
          <Link href="#" className="underline decoration-primary/40 hover:text-primary transition-colors">
            contact support
          </Link>{" "}
          immediately.
        </p>
      </div>
    </div>
  );
}
