/** Mirrors the backend `src/shared/auth.schema.ts` response contracts. */

export interface AuthUserView {
  id: string;
  email: string;
  name: string;
}

export interface MembershipView {
  organizationId: string;
  slug: string;
  name: string;
  role: "Admin" | "Member";
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SessionView {
  user: AuthUserView;
  memberships: MembershipView[];
  tokens: AuthTokens;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
}

export interface AcceptInviteInput {
  token: string;
  password: string;
  name: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface OkResponse {
  ok: boolean;
}
