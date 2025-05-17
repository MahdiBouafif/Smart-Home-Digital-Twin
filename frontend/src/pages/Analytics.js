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
  Tabs,
  Tab,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import axios from 'axios';
import moment from 'moment';

function Analytics() {
  const [roomsData, setRoomsData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');

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

        // Generate mock historical data for demonstration
        generateMockHistoricalData(response.data);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to fetch room data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 30000); // Reduced polling frequency for analytics
    return () => clearInterval(interval);
  }, []);

  // Generate mock historical data for demonstration purposes
  const generateMockHistoricalData = (rooms) => {
    if (!rooms || rooms.length === 0) return;

    const now = moment();
    const data = [];
    
    // Create data points for the past 24 hours (hourly)
    for (let i = 24; i >= 0; i--) {
      const timestamp = moment(now).subtract(i, 'hours').format('HH:00');
      
      const dataPoint = {
        timestamp,
        time: moment(now).subtract(i, 'hours').toDate(),
      };
      
      // Add data for each room
      rooms.forEach(room => {
        const roomName = typeof room.name === 'object' ? room.name.value : room.name;
        const roomId = room.id;
        
        // Generate realistic values with some variance
        const baseTemp = typeof room.temperature === 'object' ? 
          parseFloat(room.temperature.value) : parseFloat(room.temperature) || 22;
        const baseHumidity = typeof room.humidity === 'object' ? 
          parseFloat(room.humidity.value) : parseFloat(room.humidity) || 50;
        const baseCO2 = typeof room.co2Level === 'object' ? 
          parseFloat(room.co2Level.value) : parseFloat(room.co2Level) || 800;
          
        // Add some natural variation (±5% for each hour)
        const hourlyVariance = (Math.sin(i * 0.25) * 0.05) + (Math.random() * 0.05);
        
        dataPoint[`temp_${roomId}`] = parseFloat((baseTemp * (1 + hourlyVariance)).toFixed(1));
        dataPoint[`humidity_${roomId}`] = parseFloat((baseHumidity * (1 + hourlyVariance)).toFixed(1));
        dataPoint[`co2_${roomId}`] = Math.round(baseCO2 * (1 + hourlyVariance));
        
        // Add occupancy patterns (more likely occupied during daytime)
        const hour = moment(now).subtract(i, 'hours').hour();
        const isDaytime = hour >= 8 && hour <= 20;
        dataPoint[`occupancy_${roomId}`] = isDaytime ? (Math.random() > 0.3) : (Math.random() > 0.8);
      });
      
      data.push(dataPoint);
    }
    
    setHistoricalData(data);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (historicalData.length === 0) return [];
    
    const now = moment();
    let hoursToSubtract = 24;
    
    switch (timeRange) {
      case '12h':
        hoursToSubtract = 12;
        break;
      case '48h':
        hoursToSubtract = 48;
        break;
      case '7d':
        hoursToSubtract = 168;
        break;
      default:
        hoursToSubtract = 24;
    }
    
    const cutoffTime = moment(now).subtract(hoursToSubtract, 'hours');
    return historicalData.filter(item => moment(item.time).isAfter(cutoffTime));
  };

  // Prepare data for temperature chart
  const prepareTemperatureData = () => {
    const filteredData = getFilteredData();
    
    if (selectedRoom === 'all') {
      return filteredData.map(item => {
        const newItem = { timestamp: item.timestamp };
        roomsData.forEach(room => {
          newItem[room.name] = item[`temp_${room.id}`];
        });
        return newItem;
      });
    } else {
      const selectedRoomData = roomsData.find(room => room.id === selectedRoom);
      if (!selectedRoomData) return [];
      
      return filteredData.map(item => ({
        timestamp: item.timestamp,
        temperature: item[`temp_${selectedRoom}`]
      }));
    }
  };

  // Prepare data for humidity chart
  const prepareHumidityData = () => {
    const filteredData = getFilteredData();
    
    if (selectedRoom === 'all') {
      return filteredData.map(item => {
        const newItem = { timestamp: item.timestamp };
        roomsData.forEach(room => {
          newItem[room.name] = item[`humidity_${room.id}`];
        });
        return newItem;
      });
    } else {
      const selectedRoomData = roomsData.find(room => room.id === selectedRoom);
      if (!selectedRoomData) return [];
      
      return filteredData.map(item => ({
        timestamp: item.timestamp,
        humidity: item[`humidity_${selectedRoom}`]
      }));
    }
  };

  // Prepare data for CO2 chart
  const prepareCO2Data = () => {
    const filteredData = getFilteredData();
    
    if (selectedRoom === 'all') {
      return filteredData.map(item => {
        const newItem = { timestamp: item.timestamp };
        roomsData.forEach(room => {
          newItem[room.name] = item[`co2_${room.id}`];
        });
        return newItem;
      });
    } else {
      const selectedRoomData = roomsData.find(room => room.id === selectedRoom);
      if (!selectedRoomData) return [];
      
      return filteredData.map(item => ({
        timestamp: item.timestamp,
        co2: item[`co2_${selectedRoom}`]
      }));
    }
  };

  // Prepare data for occupancy chart
  const prepareOccupancyData = () => {
    // Calculate total occupancy time for each room
    const roomOccupancyStats = roomsData.map(room => {
      const filteredData = getFilteredData();
      const totalHours = filteredData.length;
      const occupiedHours = filteredData.filter(item => item[`occupancy_${room.id}`]).length;
      const occupancyRate = totalHours > 0 ? (occupiedHours / totalHours) * 100 : 0;
      
      return {
        name: typeof room.name === 'object' ? room.name.value : room.name,
        occupancyRate: parseFloat(occupancyRate.toFixed(1)),
        occupiedHours,
        totalHours
      };
    });
    
    return roomOccupancyStats;
  };

  // Prepare overall room stats
  const prepareRoomStats = () => {
    if (!roomsData || roomsData.length === 0) return [];
    
    return roomsData.map(room => {
      const tempValue = typeof room.temperature === 'object' ? 
        parseFloat(room.temperature.value) : parseFloat(room.temperature) || 0;
      const humidityValue = typeof room.humidity === 'object' ? 
        parseFloat(room.humidity.value) : parseFloat(room.humidity) || 0;
      const co2Value = typeof room.co2Level === 'object' ? 
        parseFloat(room.co2Level.value) : parseFloat(room.co2Level) || 0;
      
      // Calculate comfort index (simple algorithm based on temperature and humidity)
      let comfortIndex = 0;
      // Temperature comfort (20-24°C is ideal)
      if (tempValue >= 20 && tempValue <= 24) comfortIndex += 50;
      else if (tempValue >= 18 && tempValue <= 26) comfortIndex += 30;
      else comfortIndex += 10;
      
      // Humidity comfort (40-60% is ideal)
      if (humidityValue >= 40 && humidityValue <= 60) comfortIndex += 30;
      else if (humidityValue >= 30 && humidityValue <= 70) comfortIndex += 20;
      else comfortIndex += 5;
      
      // CO2 comfort (below 800 ppm is ideal)
      if (co2Value < 800) comfortIndex += 20;
      else if (co2Value < 1000) comfortIndex += 15;
      else if (co2Value < 1500) comfortIndex += 10;
      else comfortIndex += 0;
      
      return {
        id: room.id,
        name: typeof room.name === 'object' ? room.name.value : room.name,
        temperature: tempValue,
        humidity: humidityValue,
        co2: co2Value,
        comfortIndex
      };
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading && roomsData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && roomsData.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const roomStats = prepareRoomStats();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="room-select-label">Room</InputLabel>
            <Select
              labelId="room-select-label"
              id="room-select"
              value={selectedRoom}
              label="Room"
              onChange={handleRoomChange}
            >
              <MenuItem value="all">All Rooms</MenuItem>
              {roomsData.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  {typeof room.name === 'object' ? room.name.value : room.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="time-range-select-label">Time Range</InputLabel>
            <Select
              labelId="time-range-select-label"
              id="time-range-select"
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="12h">Last 12 Hours</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="48h">Last 48 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytic tabs">
          <Tab label="Environment" />
          <Tab label="Occupancy" />
          <Tab label="Room Comparison" />
        </Tabs>
      </Box>
      
      {/* Environment Tab */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Temperature Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Temperature Trends
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareTemperatureData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis unit="°C" />
                      <Tooltip />
                      <Legend />
                      {selectedRoom === 'all' 
                        ? roomsData.map((room, index) => (
                            <Line 
                              key={room.id}
                              type="monotone" 
                              dataKey={room.name} 
                              stroke={COLORS[index % COLORS.length]} 
                              activeDot={{ r: 8 }} 
                            />
                          ))
                        : <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                      }
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Humidity Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Humidity Trends
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prepareHumidityData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Legend />
                      {selectedRoom === 'all' 
                        ? roomsData.map((room, index) => (
                            <Area 
                              key={room.id}
                              type="monotone" 
                              dataKey={room.name} 
                              stackId="1"
                              fill={COLORS[index % COLORS.length]} 
                              stroke={COLORS[index % COLORS.length]} 
                              fillOpacity={0.6}
                            />
                          ))
                        : <Area type="monotone" dataKey="humidity" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      }
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* CO2 Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  CO2 Levels
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareCO2Data()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis unit=" ppm" />
                      <Tooltip />
                      <Legend />
                      {selectedRoom === 'all' 
                        ? roomsData.map((room, index) => (
                            <Bar 
                              key={room.id}
                              dataKey={room.name} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))
                        : <Bar dataKey="co2" fill="#8884d8" />
                      }
                      {/* Reference line for CO2 threshold */}
                      <Line type="monotone" dataKey="threshold" stroke="red" strokeDasharray="5 5" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Occupancy Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Room Occupancy Rates
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareOccupancyData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit="%" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="occupancyRate" fill="#8884d8" name="Occupancy Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Occupancy Distribution
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareOccupancyData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, occupancyRate }) => `${name}: ${occupancyRate}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="occupiedHours"
                      >
                        {prepareOccupancyData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Room Comparison Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Room Comfort Index
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roomStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="comfortIndex" fill="#8884d8" name="Comfort Index">
                        {roomStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.comfortIndex > 80 ? '#4caf50' : entry.comfortIndex > 60 ? '#ff9800' : '#f44336'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Temperature Comparison
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roomStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="°C" />
                      <Tooltip />
                      <Bar dataKey="temperature" fill="#ff9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Humidity Comparison
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roomStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip />
                      <Bar dataKey="humidity" fill="#29b6f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  CO2 Comparison
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roomStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit=" ppm" />
                      <Tooltip />
                      <Bar dataKey="co2" fill="#9c27b0">
                        {roomStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.co2 < 800 ? '#4caf50' : entry.co2 < 1000 ? '#ff9800' : '#f44336'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Analytics; 