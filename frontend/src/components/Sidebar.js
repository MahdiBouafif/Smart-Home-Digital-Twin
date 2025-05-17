import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Meeting as MeetingIcon,
  BarChart as AnalyticsIcon,
  Devices as DevicesIcon,
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

function Sidebar() {
  const location = useLocation();
  const [roomsOpen, setRoomsOpen] = React.useState(false);

  const handleRoomsClick = () => {
    setRoomsOpen(!roomsOpen);
  };

  // Rooms data that matches the actual Orion entity IDs
  const rooms = [
    { id: 'LivingRoom', name: 'Living Room' },
    { id: 'Kitchen', name: 'Kitchen' },
    { id: 'MasterBedroom', name: 'Master Bedroom' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" component="div" color="primary.main" sx={{ fontWeight: 600 }}>
            Smart Home Control
          </Typography>
        </Box>
        
        <Divider />
        
        <List sx={{ flexGrow: 1, pt: 2 }}>
          <ListItem 
            button 
            component={Link} 
            to="/" 
            selected={location.pathname === '/'}
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          
          <ListItem 
            button
            onClick={handleRoomsClick}
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <HomeIcon color={location.pathname.includes('/room/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
            {roomsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          
          <Collapse in={roomsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {rooms.map((room) => (
                <ListItem 
                  key={room.id}
                  button 
                  component={Link}
                  to={`/room/${room.id}`}
                  selected={location.pathname === `/room/${room.id}`}
                  sx={{
                    pl: 4,
                    py: 0.75,
                    borderRadius: '8px',
                    mx: 1,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.12)',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemText 
                    primary={room.name}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
          
          <ListItem 
            button 
            component={Link} 
            to="/devices"
            selected={location.pathname === '/devices'} 
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <DevicesIcon color={location.pathname === '/devices' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Devices" />
          </ListItem>
          
          <ListItem 
            button 
            component={Link} 
            to="/analytics"
            selected={location.pathname === '/analytics'} 
            sx={{
              mb: 1,
              borderRadius: '8px',
              mx: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>
              <AnalyticsIcon color={location.pathname === '/analytics' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItem>
        </List>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar; 