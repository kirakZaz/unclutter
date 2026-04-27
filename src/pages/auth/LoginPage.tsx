import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = React.useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await login(formValues);
      navigate('/');
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage: `
          radial-gradient(ellipse at 20% 80%, rgba(45, 106, 79, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(212, 137, 106, 0.08) 0%, transparent 60%)
        `,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        {/* Brand */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '16px',
              bgcolor: 'primary.main',
              mb: 2,
            }}
          >
            <RecyclingIcon sx={{ color: 'white', fontSize: 36 }} />
          </Box>
          <Typography variant="h3" gutterBottom>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 340, mx: 'auto' }}>
            Your neighbours are sharing, swapping, and connecting. Pick up where you left off.
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Email address"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                required
                fullWidth
                autoComplete="email"
                autoFocus
              />

              <TextField
                label="Password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleInputChange}
                required
                fullWidth
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        edge="end"
                      >
                        {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting || !formValues.email || !formValues.password}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(45,106,79,0.06)', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                <strong>Demo account:</strong> alice@example.com / demo123
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography textAlign="center" sx={{ mt: 3 }} color="text.secondary">
          New to Unclutter?{' '}
          <Link component={RouterLink} to="/register" fontWeight={600}>
            Create an account
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
