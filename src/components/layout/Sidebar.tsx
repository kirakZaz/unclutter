import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import HomeIcon from '@mui/icons-material/Home';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import MapIcon from '@mui/icons-material/Map';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Give & Receive', path: '/give-receive', icon: <VolunteerActivismIcon /> },
  { label: 'Communities', path: '/communities', icon: <PeopleIcon />, badge: 'Hot' },
  { label: 'Events', path: '/events', icon: <EventIcon /> },
  { label: 'Hub Map', path: '/hubs', icon: <MapIcon /> },
];

interface SidebarProps {
  width: number;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({ width }: { width: number }) {
  const location = useLocation();

  return (
    <Box
      sx={{
        width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2.5,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RecyclingIcon sx={{ color: 'white', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1 }}>
            Unclutter
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
            Share. Connect. Belong.
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1.5, pt: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  py: 1.2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'rgba(45, 106, 79, 0.08)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                    minWidth: 38,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: isActive ? 'rgba(255,255,255,0.25)' : 'secondary.main',
                      color: 'white',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(45,106,79,0.08) 0%, rgba(82,183,136,0.08) 100%)',
            border: '1px solid rgba(45, 106, 79, 0.15)',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Inner North Melbourne
          </Typography>
          <Typography variant="body2" fontWeight={600} color="primary.main" sx={{ lineHeight: 1.4 }}>
            "The act of sharing is an act of community-building."
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function Sidebar({ width, isMobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent width={width} />
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
        open
      >
        <SidebarContent width={width} />
      </Drawer>
    </>
  );
}

export default Sidebar;
