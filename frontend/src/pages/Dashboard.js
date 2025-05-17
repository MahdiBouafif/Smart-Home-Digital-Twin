import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Divider,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  ThermostatAuto,
  WaterDrop,
  Lightbulb,
  Person,
  Co2,
  VolumeUp,
  Home,
  Warning,
  Check
} from '@mui/icons-material';

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/orion/v2/entities?type=Room');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderSensorValue = (value, unit = '') => {
    return typeof value === 'object' ? `${value.value}${unit}` : `${value}${unit}`;
  };

  // Calculate summary statistics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => 
    room.occupancy && (room.occupancy.value === true || room.occupancy === true)
  ).length;
  
  // Get average temperature across all rooms
  const avgTemperature = rooms.length > 0 
    ? rooms.reduce((sum, room) => {
        const temp = typeof room.temperature === 'object' 
          ? parseFloat(room.temperature.value) 
          : parseFloat(room.temperature);
        return sum + (isNaN(temp) ? 0 : temp);
      }, 0) / rooms.length
    : 0;

  // Check if any room has high CO2 levels (> 1000 ppm)
  const highCO2Rooms = rooms.filter(room => {
    const co2 = typeof room.co2Level === 'object' 
      ? parseFloat(room.co2Level.value) 
      : parseFloat(room.co2Level);
    return co2 > 1000;
  }).length;

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Smart Home Dashboard
      </Typography>
      
      {loading ? (
        <LinearProgress sx={{ mt: 2, mb: 4 }} />
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Home />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Rooms</Typography>
                      <Typography variant="h4">{totalRooms}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Occupied Rooms</Typography>
                      <Typography variant="h4">{occupiedRooms}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                      <ThermostatAuto />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Avg Temperature</Typography>
                      <Typography variant="h4">{avgTemperature.toFixed(1)}°C</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: highCO2Rooms > 0 ? 'error.main' : 'success.main', mr: 2 }}>
                      {highCO2Rooms > 0 ? <Warning /> : <Check />}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Air Quality</Typography>
                      <Typography variant="h4">
                        {highCO2Rooms > 0 ? `${highCO2Rooms} Issues` : 'Good'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 2, mb: 3 }}>
            Room Details
          </Typography>
          
          <Grid container spacing={3}>
            {rooms.map((room) => {
              const roomName = typeof room.name === 'object' ? room.name.value : room.name;
              const tempValue = typeof room.temperature === 'object' ? parseFloat(room.temperature.value) : parseFloat(room.temperature);
              const humidityValue = typeof room.humidity === 'object' ? parseFloat(room.humidity.value) : parseFloat(room.humidity);
              const co2Value = typeof room.co2Level === 'object' ? parseFloat(room.co2Level.value) : parseFloat(room.co2Level);
              const isOccupied = typeof room.occupancy === 'object' ? room.occupancy.value : room.occupancy;
              
              // Determine air quality status
              let airQualityStatus = 'good';
              if (co2Value > 1500) airQualityStatus = 'poor';
              else if (co2Value > 1000) airQualityStatus = 'fair';
              
              const statusColors = {
                good: 'success',
                fair: 'warning',
                poor: 'error'
              };
              
              return (
                <Grid item xs={12} md={6} lg={4} key={room.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="medium">
                          {roomName}
                        </Typography>
                        <Chip 
                          icon={isOccupied ? <Person fontSize="small" /> : null}
                          label={isOccupied ? "Occupied" : "Empty"}
                          color={isOccupied ? "primary" : "default"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <ThermostatAuto sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Temperature</Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {renderSensorValue(room.temperature, '°C')}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <WaterDrop sx={{ mr: 1, color: 'info.main' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Humidity</Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {renderSensorValue(room.humidity, '%')}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <Lightbulb sx={{ mr: 1, color: 'warning.main' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Light</Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {renderSensorValue(room.illuminance, ' lx')}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <Co2 sx={{ mr: 1, color: statusColors[airQualityStatus] }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">CO2</Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {renderSensorValue(room.co2Level, ' ppm')}
                              </Typography>
                              <Chip 
                                label={airQualityStatus.charAt(0).toUpperCase() + airQualityStatus.slice(1)} 
                                color={statusColors[airQualityStatus]} 
                                size="small" 
                                sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }}
                              />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VolumeUp sx={{ mr: 1, color: 'secondary.main' }} />
                            <Box>
                              <Typography variant="body2" color="text.secondary">Noise</Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {renderSensorValue(room.noiseLevel, ' dB')}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default Dashboard; 