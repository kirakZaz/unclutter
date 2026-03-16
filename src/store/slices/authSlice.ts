import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, PublicUser, LoginCredentials, RegisterCredentials } from '@/types';
import {
  loginUser,
  registerUser,
  logoutUser,
  restoreSession,
} from '@/services/localDbService';

const initialState: AuthState = {
  currentUser: null,
  token: null,
  isAuthenticated: false,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk<
  { user: PublicUser; token: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const user = loginUser(credentials);
    const token = crypto.randomUUID();
    return { user, token };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const registerThunk = createAsyncThunk<
  { user: PublicUser; token: string },
  RegisterCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, { rejectWithValue }) => {
  try {
    const user = registerUser(credentials);
    const token = crypto.randomUUID();
    return { user, token };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const restoreSessionThunk = createAsyncThunk<
  { user: PublicUser; token: string } | null
>('auth/restoreSession', async () => {
  return restoreSession();
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      logoutUser();
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateCurrentUser(state, action: PayloadAction<Partial<PublicUser>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(restoreSessionThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentUser = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { logout, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
