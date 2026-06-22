"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { clearTokens, hasSession, setTokens } from "@/lib/auth/tokens";
import type { ApiError } from "@/lib/api/errors";
import {
  acceptInvite,
  changePassword,
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
} from "./api";
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

/** Persist tokens and seed the `me` cache from an auth response. */
function useSessionEstablisher() {
  const qc = useQueryClient();
  return (session: SessionView) => {
    setTokens(session.tokens);
    qc.setQueryData<AuthUserView>(queryKeys.auth.me, session.user);
  };
}

export function useLogin(
  options?: UseMutationOptions<SessionView, ApiError, LoginInput>,
) {
  const establish = useSessionEstablisher();
  return useMutation<SessionView, ApiError, LoginInput>({
    mutationFn: login,
    ...options,
    onSuccess: (session, ...rest) => {
      establish(session);
      (options?.onSuccess as ((...a: unknown[]) => void) | undefined)?.(
        session,
        ...rest,
      );
    },
  });
}

// Registration does NOT establish a session — the user is sent to the sign-in
// page to log in with their new credentials.
export function useRegister(
  options?: UseMutationOptions<AuthUserView, ApiError, RegisterInput>,
) {
  return useMutation<AuthUserView, ApiError, RegisterInput>({
    mutationFn: register,
    ...options,
  });
}

export function useAcceptInvite(
  options?: UseMutationOptions<SessionView, ApiError, AcceptInviteInput>,
) {
  const establish = useSessionEstablisher();
  return useMutation<SessionView, ApiError, AcceptInviteInput>({
    mutationFn: acceptInvite,
    ...options,
    onSuccess: (session, ...rest) => {
      establish(session);
      (options?.onSuccess as ((...a: unknown[]) => void) | undefined)?.(
        session,
        ...rest,
      );
    },
  });
}

/** Current authenticated user. Only runs when a token is present. */
export function useSession() {
  return useQuery<AuthUserView, ApiError>({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    enabled: hasSession(),
    staleTime: 5 * 60_000,
  });
}

export function useForgotPassword(
  options?: UseMutationOptions<OkResponse, ApiError, ForgotPasswordInput>,
) {
  return useMutation<OkResponse, ApiError, ForgotPasswordInput>({
    mutationFn: forgotPassword,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<OkResponse, ApiError, ResetPasswordInput>,
) {
  return useMutation<OkResponse, ApiError, ResetPasswordInput>({
    mutationFn: resetPassword,
    ...options,
  });
}

export function useChangePassword(
  options?: UseMutationOptions<OkResponse, ApiError, ChangePasswordInput>,
) {
  return useMutation<OkResponse, ApiError, ChangePasswordInput>({
    mutationFn: changePassword,
    ...options,
  });
}

/** Clear tokens and wipe cached server state. */
export function useLogout() {
  const qc = useQueryClient();
  return () => {
    clearTokens();
    qc.clear();
  };
}
