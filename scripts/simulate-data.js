const axios = require('axios');

const ORION_URL = 'http://localhost:1026/v2';
const ROOMS = ['LivingRoom', 'Kitchen', 'MasterBedroom'];

function generateRandomData() {
  return {
    temperature: (20 + Math.random() * 5).toFixed(1),
    humidity: (40 + Math.random() * 20).toFixed(1),
    co2Level: (400 + Math.random() * 200).toFixed(0),
    noiseLevel: (25 + Math.random() * 30).toFixed(0),
    illuminance: Math.random() > 0.3 ? (500 + Math.random() * 1000).toFixed(0) : (50 + Math.random() * 200).toFixed(0),
    occupancy: Math.random() > 0.5
  };
}

async function updateRoomData(roomId) {
  const data = generateRandomData();
  try {
    await axios.patch(`${ORION_URL}/entities/urn:ngsi-ld:Room:${roomId}/attrs`, {
      temperature: {
        value: parseFloat(data.temperature),
        type: 'Number'
      },
      humidity: {
        value: parseFloat(data.humidity),
        type: 'Number'
      },
      co2Level: {
        value: parseFloat(data.co2Level),
        type: 'Number'
      },
      noiseLevel: {
        value: parseFloat(data.noiseLevel),
        type: 'Number'
      },
      illuminance: {
        value: parseFloat(data.illuminance),
        type: 'Number'
      },
      occupancy: {
        value: data.occupancy,
        type: 'Boolean'
      }
    });
    console.log(`Updated ${roomId} with new data`);
  } catch (error) {
    console.error(`Error updating ${roomId}:`, error.response?.data || error.message);
  }
}

async function simulateData() {
  console.log('Starting data simulation...');
  
  // Initial update
  ROOMS.forEach(room => updateRoomData(room));
  
  // Update each room every 5 seconds
  setInterval(() => {
    ROOMS.forEach(room => updateRoomData(room));
  }, 5000);
}

// Start simulation
simulateData(); 