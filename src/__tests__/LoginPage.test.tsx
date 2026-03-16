import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '@/pages/auth/LoginPage';
import authReducer from '@/store/slices/authSlice';
import { theme } from '@/theme';

vi.mock('@/services/localDbService', () => ({
  loginUser: vi.fn((credentials) => {
    if (credentials.email === 'alice@example.com' && credentials.password === 'demo123') {
      return {
        id: 'seed-user-1',
        email: 'alice@example.com',
        name: 'Alice Green',
        avatar: '',
        bio: '',
        location: 'Berlin',
        joinedAt: '2024-01-01T00:00:00.000Z',
        stats: { itemsGiven: 0, itemsReceived: 0, co2Saved: 0 },
      };
    }
    throw new Error('Invalid email or password.');
  }),
  restoreSession: vi.fn(() => null),
  logoutUser: vi.fn(),
  registerUser: vi.fn(),
}));

function buildTestWrapper() {
  const store = configureStore({ reducer: { auth: authReducer } });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={['/login']}>{children}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );

  return { Wrapper, store };
}

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    const { Wrapper } = buildTestWrapper();
    render(<LoginPage />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the sign in button disabled when fields are empty', () => {
    const { Wrapper } = buildTestWrapper();
    render(<LoginPage />, { wrapper: Wrapper });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button after filling both fields', () => {
    const { Wrapper } = buildTestWrapper();
    render(<LoginPage />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'demo123' },
    });

    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled();
  });

  it('shows error message on invalid credentials', async () => {
    const { Wrapper } = buildTestWrapper();
    render(<LoginPage />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
