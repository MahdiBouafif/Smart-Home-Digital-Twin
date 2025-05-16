const axios = require('axios');

const ORION_URL = 'http://localhost:1026/v2';
const QUANTUMLEAP_URL = 'http://quantumleap:8668';

const subscriptions = [
  {
    description: 'Notify QuantumLeap of all Room entity changes',
    subject: {
      entities: [{ idPattern: '.*', type: 'Room' }],
      condition: {
        attrs: ['temperature', 'humidity', 'illuminance', 'occupancy', 'co2Level', 'noiseLevel']
      }
    },
    notification: {
      http: { url: `${QUANTUMLEAP_URL}/v2/notify` },
      attrs: ['temperature', 'humidity', 'illuminance', 'occupancy', 'co2Level', 'noiseLevel'],
      metadata: ['dateCreated', 'dateModified']
    }
  },
  {
    description: 'Notify QuantumLeap of all Device entity changes',
    subject: {
      entities: [{ idPattern: '.*', type: 'Device' }],
      condition: {
        attrs: ['value', 'batteryLevel', 'rssi', 'co2', 'tvoc', 'powerState', 'dimming', 'mode', 'targetTemperature']
      }
    },
    notification: {
      http: { url: `${QUANTUMLEAP_URL}/v2/notify` },
      attrs: ['value', 'batteryLevel', 'rssi', 'co2', 'tvoc', 'powerState', 'dimming', 'mode', 'targetTemperature'],
      metadata: ['dateCreated', 'dateModified']
    }
  }
];

async function createSubscriptions() {
  try {
    for (const subscription of subscriptions) {
      try {
        await axios.post(`${ORION_URL}/subscriptions`, subscription);
        console.log(`Created subscription: ${subscription.description}`);
      } catch (error) {
        console.error('Error creating subscription:', error.response?.data || error.message);
      }
    }
    console.log('Subscriptions setup completed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Wait for Orion to be ready
setTimeout(createSubscriptions, 5000); 