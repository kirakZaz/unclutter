import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 260;

function Layout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const handleMobileToggle = () => setIsMobileSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setIsMobileSidebarOpen(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header sidebarWidth={SIDEBAR_WIDTH} onMobileMenuToggle={handleMobileToggle} />
      <Sidebar
        width={SIDEBAR_WIDTH}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleSidebarClose}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          ml: { sm: `${SIDEBAR_WIDTH}px` },
          mt: '64px',
          p: { xs: 2, md: 4 },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
