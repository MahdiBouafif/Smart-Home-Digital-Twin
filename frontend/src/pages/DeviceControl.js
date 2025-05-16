import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Switch,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';

function DeviceCard({ device, onUpdate }) {
  const [value, setValue] = useState(device.value);
  const [status, setStatus] = useState(device.status === 'active');

  const handleValueChange = async (newValue) => {
    try {
      await axios.patch(`/orion/v2/entities/${device.id}/attrs/value`, {
        value: newValue,
        type: 'Number',
      });
      setValue(newValue);
      onUpdate();
    } catch (error) {
      console.error('Error updating device value:', error);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked ? 'active' : 'inactive';
    try {
      await axios.patch(`/orion/v2/entities/${device.id}/attrs/status`, {
        value: newStatus,
        type: 'Text',
      });
      setStatus(event.target.checked);
      onUpdate();
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {device.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Type: {device.type}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Location: {device.location}
        </Typography>
        {device.type === 'sensor' ? (
          <Typography variant="h4">
            {value} {device.unit}
          </Typography>
        ) : (
          <TextField
            type="number"
            value={value}
            onChange={(e) => handleValueChange(parseFloat(e.target.value))}
            disabled={!status}
          />
        )}
      </CardContent>
      <CardActions>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Switch
            checked={status}
            onChange={handleStatusChange}
            color="primary"
          />
          <Button
            size="small"
            color="primary"
            onClick={() => onUpdate()}
            disabled={!status}
          >
            Refresh
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

function DeviceControl() {
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('/orion/v2/entities', {
        params: {
          type: 'Device',
          options: 'keyValues',
        },
      });
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Device Control
      </Typography>
      <Grid container spacing={3}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <DeviceCard device={device} onUpdate={fetchDevices} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DeviceControl; 