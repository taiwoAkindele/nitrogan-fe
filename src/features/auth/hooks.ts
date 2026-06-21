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
import { acceptInvite, getMe, login, register } from "./api";
import type {
  AcceptInviteInput,
  AuthUserView,
  LoginInput,
  RegisterInput,
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

export function useRegister(
  options?: UseMutationOptions<SessionView, ApiError, RegisterInput>,
) {
  const establish = useSessionEstablisher();
  return useMutation<SessionView, ApiError, RegisterInput>({
    mutationFn: register,
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

/** Clear tokens and wipe cached server state. */
export function useLogout() {
  const qc = useQueryClient();
  return () => {
    clearTokens();
    qc.clear();
  };
}
