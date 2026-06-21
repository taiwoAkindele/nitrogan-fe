import { api, API_VERSION } from "@/lib/api/client";
import type {
  AcceptInviteInput,
  AuthUserView,
  LoginInput,
  RegisterInput,
  SessionView,
} from "./types";

const base = `/${API_VERSION}/auth`;

export async function login(input: LoginInput): Promise<SessionView> {
  const { data } = await api.post<SessionView>(`${base}/login`, input);
  return data;
}

export async function register(input: RegisterInput): Promise<SessionView> {
  const { data } = await api.post<SessionView>(`${base}/register`, input);
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
