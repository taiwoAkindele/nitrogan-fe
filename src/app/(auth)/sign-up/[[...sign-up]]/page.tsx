"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BarChart3, Shield, Brain, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { useRegister } from "@/features/auth";

const NitroganLogo = () => (
  <svg
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    className="size-8 text-primary"
  >
    <g clipPath="url(#clip0_signup)">
      <path
        clipRule="evenodd"
        d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0_signup">
        <rect fill="white" height="48" width="48" />
      </clipPath>
    </defs>
  </svg>
);

const features = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Monitor pipeline performance and conversion metrics instantly.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Industry-standard encryption for all your operational data.",
  },
  {
    icon: Brain,
    title: "Predictive Intelligence",
    description:
      "AI-driven lead scoring and deal forecasting to stay ahead.",
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormData) => {
    registerUser.mutate(
      {
        name: data.fullName,
        email: data.email,
        password: data.password,
        organizationName: data.companyName,
      },
      {
        onSuccess: (session) => {
          const slug = session.memberships[0]?.slug;
          router.push(slug ? `/org/${slug}` : "/sign-in");
        },
        onError: (error) => {
          toast.error(error.message || "Unable to create account");
        },
      },
    );
  };

  const isSubmitting = registerUser.isPending;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <NitroganLogo />
          <h2 className="text-xl font-bold tracking-tight">Nitrogan</h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground sm:block">
            Already have an account?
          </span>
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 md:px-0">
        <div className="flex w-full max-w-[1000px] flex-col items-start gap-12 md:flex-row">
          {/* Left Side: Value Prop */}
          <div className="hidden flex-1 flex-col gap-8 md:sticky md:top-12 md:flex">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Early Access
              </span>
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
                Join the{" "}
                <span className="text-primary">Nitrogan</span> network.
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                The most efficient way to discover high-intent prospects and
                accelerate your sales pipeline. Start closing deals faster
                today.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full rounded-2xl border border-border bg-card p-8 shadow-xl md:max-w-[440px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-bold">Create account</h2>
                <p className="text-sm text-muted-foreground">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="h-12 px-4"
                    aria-invalid={!!errors.fullName}
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Business Email */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className="h-12 px-4"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Industries"
                    className="h-12 px-4"
                    aria-invalid={!!errors.companyName}
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-destructive">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      className="h-12 px-4 pr-11"
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
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full gap-2 text-base font-bold"
                >
                  Create account
                  <ArrowRight className="size-4" />
                </Button>
                <p className="text-center text-[10px] leading-normal text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-4 border-t border-border px-10 py-8 text-sm text-muted-foreground md:flex-row">
        <p>&copy; 2026 Nitrogan Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="transition-colors hover:text-primary">
            Documentation
          </Link>
          <Link href="#" className="transition-colors hover:text-primary">
            Support
          </Link>
          <Link href="#" className="transition-colors hover:text-primary">
            API Status
          </Link>
        </div>
      </footer>
    </div>
  );
}
