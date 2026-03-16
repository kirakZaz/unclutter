import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { loginThunk, registerThunk, logout } from '@/store/slices/authSlice';
import type { LoginCredentials, RegisterCredentials, PublicUser } from '@/types';

interface UseAuthReturn {
  currentUser: PublicUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logoutCurrentUser: () => void;
}

export function useAuth(): UseAuthReturn {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginThunk(credentials));
      if (loginThunk.rejected.match(result)) {
        throw new Error(result.payload ?? 'Login failed');
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const result = await dispatch(registerThunk(credentials));
      if (registerThunk.rejected.match(result)) {
        throw new Error(result.payload ?? 'Registration failed');
      }
    },
    [dispatch]
  );

  const logoutCurrentUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return { currentUser, isAuthenticated, login, register, logoutCurrentUser };
}
