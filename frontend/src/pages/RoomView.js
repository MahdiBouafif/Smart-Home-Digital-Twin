import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  ThermostatAuto,
  WaterDrop,
  Lightbulb,
  Person,
  Co2,
  VolumeUp,
} from '@mui/icons-material';

function RoomView() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        // Convert route parameter to entity ID format
        const roomId = `urn:ngsi-ld:Room:${id.charAt(0).toUpperCase() + id.slice(1)}`;
        console.log('Fetching room data for:', roomId);
        const response = await fetch(`/orion/v2/entities/${roomId}`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`Failed to fetch room data: ${response.statusText}`);
        }
        const data = await response.json();
        setRoom(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
    const interval = setInterval(fetchRoomData, 5000);
    return () => clearInterval(interval);
  }, [id]);

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
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!room) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Room not found</Typography>
      </Box>
    );
  }

  const renderSensorValue = (value, unit = '') => {
    return typeof value === 'object' ? `${value.value}${unit}` : `${value}${unit}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {room.name.value}
      </Typography>

      <Grid container spacing={3}>
        {/* Temperature Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThermostatAuto sx={{ mr: 1 }} />
                <Typography variant="h6">Temperature</Typography>
              </Box>
              <Typography variant="h3">
                {renderSensorValue(room.temperature, '°C')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Humidity Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WaterDrop sx={{ mr: 1 }} />
                <Typography variant="h6">Humidity</Typography>
              </Box>
              <Typography variant="h3">
                {renderSensorValue(room.humidity, '%')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Illuminance Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Lightbulb sx={{ mr: 1 }} />
                <Typography variant="h6">Illuminance</Typography>
              </Box>
              <Typography variant="h3">
                {renderSensorValue(room.illuminance, ' lx')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Occupancy Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="h6">Occupancy</Typography>
              </Box>
              <Typography variant="h3">
                {room.occupancy.value ? 'Occupied' : 'Empty'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* CO2 Level Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Co2 sx={{ mr: 1 }} />
                <Typography variant="h6">CO2 Level</Typography>
              </Box>
              <Typography variant="h3">
                {renderSensorValue(room.co2Level, ' ppm')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Noise Level Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VolumeUp sx={{ mr: 1 }} />
                <Typography variant="h6">Noise Level</Typography>
              </Box>
              <Typography variant="h3">
                {renderSensorValue(room.noiseLevel, ' dB')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RoomView; 