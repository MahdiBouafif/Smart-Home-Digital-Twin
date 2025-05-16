import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Room as RoomIcon,
  DevicesOther as DevicesIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/room/LivingRoom">
          <ListItemIcon>
            <RoomIcon />
          </ListItemIcon>
          <ListItemText primary="Living Room" />
        </ListItem>
        <ListItem button component={Link} to="/room/Kitchen">
          <ListItemIcon>
            <RoomIcon />
          </ListItemIcon>
          <ListItemText primary="Kitchen" />
        </ListItem>
        <ListItem button component={Link} to="/room/MasterBedroom">
          <ListItemIcon>
            <RoomIcon />
          </ListItemIcon>
          <ListItemText primary="Master Bedroom" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/devices">
          <ListItemIcon>
            <DevicesIcon />
          </ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItem>
        <ListItem button component={Link} to="/analytics">
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar; 