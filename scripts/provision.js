const axios = require('axios');

const ORION_URL = 'http://localhost:1026/v2';

const rooms = [
  {
    id: 'urn:ngsi-ld:Room:LivingRoom',
    type: 'Room',
    name: { value: 'Living Room', type: 'Text' },
    temperature: { value: 21.5, type: 'Number' },
    humidity: { value: 45, type: 'Number' },
    illuminance: { value: 1000, type: 'Number' },
    occupancy: { value: true, type: 'Boolean' },
    co2Level: { value: 450, type: 'Number' },
    noiseLevel: { value: 35, type: 'Number' }
  },
  {
    id: 'urn:ngsi-ld:Room:Kitchen',
    type: 'Room',
    name: { value: 'Kitchen', type: 'Text' },
    temperature: { value: 23.0, type: 'Number' },
    humidity: { value: 50, type: 'Number' },
    illuminance: { value: 800, type: 'Number' },
    occupancy: { value: false, type: 'Boolean' },
    co2Level: { value: 500, type: 'Number' },
    noiseLevel: { value: 45, type: 'Number' }
  },
  {
    id: 'urn:ngsi-ld:Room:MasterBedroom',
    type: 'Room',
    name: { value: 'Master Bedroom', type: 'Text' },
    temperature: { value: 20.5, type: 'Number' },
    humidity: { value: 55, type: 'Number' },
    illuminance: { value: 0, type: 'Number' },
    occupancy: { value: false, type: 'Boolean' },
    co2Level: { value: 400, type: 'Number' },
    noiseLevel: { value: 25, type: 'Number' }
  }
];

async function provisionEntities() {
  try {
    // Create rooms
    for (const room of rooms) {
      try {
        await axios.post(`${ORION_URL}/entities`, room);
        console.log(`Created room: ${room.id}`);
      } catch (error) {
        if (error.response?.status === 422) {
          // Entity already exists, update it
          const { id, type, ...attrs } = room;
          await axios.patch(`${ORION_URL}/entities/${id}/attrs`, attrs);
          console.log(`Updated room: ${id}`);
        } else {
          throw error;
        }
      }
    }

    console.log('Data provisioning completed successfully');
  } catch (error) {
    console.error('Error provisioning data:', error.response?.data || error.message);
  }
}

// Execute provisioning
provisionEntities(); 