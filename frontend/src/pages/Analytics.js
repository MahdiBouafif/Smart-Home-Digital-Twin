import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

function Analytics() {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/orion/v2/entities', {
          params: {
            type: 'Room',
            options: 'keyValues',
          },
        });
        setRoomsData(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to fetch room data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Room Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {roomsData.map((room) => (
          <Grid item xs={12} md={4} key={room.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {room.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Temperature
                      </Typography>
                      <Typography variant="h5">
                        {room.temperature}°C
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Humidity
                      </Typography>
                      <Typography variant="h5">
                        {room.humidity}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        CO2 Level
                      </Typography>
                      <Typography variant="h5">
                        {room.co2Level} ppm
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Occupancy
                      </Typography>
                      <Typography variant="h5">
                        {room.occupancy ? 'Occupied' : 'Empty'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Analytics; 