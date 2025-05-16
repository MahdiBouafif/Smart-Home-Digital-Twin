import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  ThermostatAuto,
  WaterDrop,
  Lightbulb,
  Person,
  Co2,
  VolumeUp,
} from '@mui/icons-material';

function Dashboard() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/orion/v2/entities?type=Room');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderSensorValue = (value, unit = '') => {
    return typeof value === 'object' ? `${value.value}${unit}` : `${value}${unit}`;
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Smart Home Overview
      </Typography>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name.value}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ThermostatAuto sx={{ mr: 1 }} />
                      <Typography>
                        {renderSensorValue(room.temperature, '°C')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WaterDrop sx={{ mr: 1 }} />
                      <Typography>
                        {renderSensorValue(room.humidity, '%')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Lightbulb sx={{ mr: 1 }} />
                      <Typography>
                        {renderSensorValue(room.illuminance, ' lx')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ mr: 1 }} />
                      <Typography>
                        {room.occupancy.value ? 'Occupied' : 'Empty'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Co2 sx={{ mr: 1 }} />
                      <Typography>
                        {renderSensorValue(room.co2Level, ' ppm')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <VolumeUp sx={{ mr: 1 }} />
                      <Typography>
                        {renderSensorValue(room.noiseLevel, ' dB')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard; 