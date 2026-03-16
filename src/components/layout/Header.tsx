import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  sidebarWidth: number;
  onMobileMenuToggle: () => void;
}

function Header({ sidebarWidth, onMobileMenuToggle }: HeaderProps) {
  const { currentUser, logoutCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorElement(null);

  const handleLogout = () => {
    handleCloseMenu();
    logoutCurrentUser();
    navigate('/login');
  };

  const userInitials = currentUser?.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${sidebarWidth}px)` },
        ml: { sm: `${sidebarWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMobileMenuToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { sm: 'none' }, alignItems: 'center', gap: 0.5 }}>
            <RecyclingIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Unclutter
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
            {currentUser?.name}
          </Typography>
          <Tooltip title="Account settings">
            <IconButton onClick={handleOpenMenu} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {userInitials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorElement}
          open={Boolean(anchorElement)}
          onClose={handleCloseMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ sx: { minWidth: 180, mt: 1 } }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {currentUser?.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
            <LogoutIcon fontSize="small" />
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
