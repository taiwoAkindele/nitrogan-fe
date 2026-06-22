import { api, API_VERSION } from "@/lib/api/client";
import type {
  AcceptInviteInput,
  AuthUserView,
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  OkResponse,
  RegisterInput,
  ResetPasswordInput,
  SessionView,
} from "./types";

const base = `/${API_VERSION}/auth`;

export async function login(input: LoginInput): Promise<SessionView> {
  const { data } = await api.post<SessionView>(`${base}/login`, input);
  return data;
}

// Registration does not return tokens — the user signs in afterwards.
export async function register(input: RegisterInput): Promise<AuthUserView> {
  const { data } = await api.post<AuthUserView>(`${base}/register`, input);
  return data;
}

export async function acceptInvite(
  input: AcceptInviteInput,
): Promise<SessionView> {
  const { data } = await api.post<SessionView>(`${base}/invite/accept`, input);
  return data;
}

export async function getMe(): Promise<AuthUserView> {
  const { data } = await api.get<AuthUserView>(`${base}/me`);
  return data;
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<OkResponse> {
  const { data } = await api.post<OkResponse>(`${base}/password/forgot`, input);
  return data;
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<OkResponse> {
  const { data } = await api.post<OkResponse>(`${base}/password/reset`, input);
  return data;
}

export async function changePassword(
  input: ChangePasswordInput,
): Promise<OkResponse> {
  const { data } = await api.post<OkResponse>(`${base}/password/change`, input);
  return data;
}
