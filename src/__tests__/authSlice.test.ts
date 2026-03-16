import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout, updateCurrentUser } from '@/store/slices/authSlice';
import type { AuthState, PublicUser } from '@/types';

const mockUser: PublicUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: '',
  bio: 'Test bio',
  location: 'TestCity',
  joinedAt: '2024-01-01T00:00:00.000Z',
  stats: { itemsGiven: 0, itemsReceived: 0, co2Saved: 0 },
};

function buildTestStore(preloadedState?: Partial<AuthState>) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloadedState ? { auth: preloadedState as AuthState } : undefined,
  });
}

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have correct initial state', () => {
    const store = buildTestStore();
    const state = store.getState().auth;

    expect(state.currentUser).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set isAuthenticated to false after logout', () => {
    const store = buildTestStore({
      currentUser: mockUser,
      token: 'test-token',
      isAuthenticated: true,
    });

    store.dispatch(logout());
    const state = store.getState().auth;

    expect(state.currentUser).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should update current user fields', () => {
    const store = buildTestStore({
      currentUser: mockUser,
      token: 'test-token',
      isAuthenticated: true,
    });

    store.dispatch(updateCurrentUser({ name: 'Updated Name', bio: 'New bio' }));
    const state = store.getState().auth;

    expect(state.currentUser?.name).toBe('Updated Name');
    expect(state.currentUser?.bio).toBe('New bio');
    expect(state.currentUser?.email).toBe(mockUser.email);
  });

  it('should not update current user when not authenticated', () => {
    const store = buildTestStore({
      currentUser: null,
      token: null,
      isAuthenticated: false,
    });

    store.dispatch(updateCurrentUser({ name: 'Should Not Apply' }));
    const state = store.getState().auth;

    expect(state.currentUser).toBeNull();
  });
});
