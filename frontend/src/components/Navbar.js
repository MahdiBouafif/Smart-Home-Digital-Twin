import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

function Navbar() {
  const theme = useTheme();
  
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        backgroundColor: 'background.paper',
        color: 'text.primary',
      }}
      color="inherit"
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 'bold',
            color: 'primary.main',
            mr: 2 
          }}
        >
          Smart Home
        </Typography>
        
        <Box sx={{ 
          position: 'relative',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.common.black, 0.05),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common.black, 0.08),
          },
          mr: 2,
          width: '300px',
        }}>
          <Box sx={{ 
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </Box>
          <InputBase
            placeholder="Search…"
            sx={{
              color: 'inherit',
              padding: theme.spacing(1, 1, 1, 0),
              paddingLeft: `calc(1em + ${theme.spacing(4)})`,
              width: '100%',
            }}
          />
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="large">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Help">
            <IconButton color="inherit" size="large">
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton color="inherit" size="large">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle light/dark theme">
            <IconButton sx={{ ml: 1 }} color="inherit" size="large">
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Avatar 
            sx={{ 
              width: 38, 
              height: 38, 
              ml: 2,
              bgcolor: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)'
              }
            }}
            alt="User"
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 