# Smart Home Digital Twin Dashboard

A real-time monitoring dashboard for Smart Home environments built on the FIWARE platform.

![Dashboard Overview](example/dashboard.png)

## Overview

This project implements a Smart Home Digital Twin that displays real-time sensor data from different rooms in a home. The system provides a visual interface showing temperature, humidity, CO2 levels, occupancy status, and other environmental metrics.

## System Architecture

The application is built using the following components:

- **Frontend**: React-based web application
- **Orion Context Broker**: Manages contextual information
- **MongoDB**: Database to store entity data
- **Nginx**: Reverse proxy for routing requests

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 19.03.0+)
- **Docker Compose** (version 1.27.0+)
- **Node.js** (version 14.0.0+)
- **npm** (version 6.0.0+)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-home-digital-twin.git
cd smart-home-digital-twin
```

### 2. Install Dependencies

Install the required Node.js packages for the data simulation scripts:

```bash
cd scripts
npm install
cd ..
```

## Running the Application

### 1. Start the Docker Containers

Start all services using Docker Compose:

```bash
docker-compose up --build -d
```

This command will start:
- MongoDB database
- Orion Context Broker
- Frontend application
- Nginx reverse proxy

### 2. Provision Initial Data

Load the initial room data into the system:

```bash
cd scripts
node provision.js
cd ..
```

### 3. Start the Data Simulation

Run the data simulation script to generate real-time data updates:

```bash
cd scripts
node simulate-data.js
```

Keep this script running to continuously update sensor values.

### 4. Access the Dashboard

Open your web browser and navigate to:

```
http://localhost
```

The dashboard should now be accessible and displaying real-time room data.

## Component Details

### Frontend (React Application)

The frontend provides a user interface to visualize room data:
- **Home page**: Overview of all rooms
- **Room views**: Detailed sensor data for each room
- **Analytics**: Real-time metrics of sensor readings

#### Dashboard View
![Dashboard View](example/dashboard.png)

#### Room Detail View
![Room Detail](example/Room.png)

#### Analytics Views
![Analytics 1](example/Analytics1.png)
![Analytics 2](example/Analytics2.png)

### Orion Context Broker

Manages and stores the contextual information of the smart home, including:
- Room entities with sensor values
- Real-time updates to entity attributes

### Data Simulation

The system includes scripts that simulate sensor data:
- `provision.js`: Creates the initial room entities
- `simulate-data.js`: Periodically updates sensor values to simulate real-time changes

## API Endpoints

The application exposes the following endpoints through Nginx:

- `/orion/v2/entities`: Access to all entities in the system
- `/orion/v2/entities/urn:ngsi-ld:Room:{RoomId}`: Access to specific room data

### Data Model Examples

#### Room Entity Structure
```json
{
  "id": "urn:ngsi-ld:Room:LivingRoom",
  "type": "Room",
  "name": { 
    "value": "Living Room", 
    "type": "Text" 
  },
  "temperature": { 
    "value": 21.5, 
    "type": "Number" 
  },
  "humidity": { 
    "value": 45, 
    "type": "Number" 
  },
  "illuminance": { 
    "value": 1000, 
    "type": "Number" 
  },
  "occupancy": { 
    "value": true, 
    "type": "Boolean" 
  },
  "co2Level": { 
    "value": 450, 
    "type": "Number" 
  },
  "noiseLevel": { 
    "value": 35, 
    "type": "Number" 
  }
}

## File Structure

```
├── docker-compose.yml         # Docker Compose configuration
├── frontend/                  # React frontend application
├── nginx/                     # Nginx configuration files
│   └── default.conf           # Nginx routing configuration
└── scripts/                   # Helper scripts
    ├── provision.js           # Initial data provisioning script
    └── simulate-data.js       # Data simulation script
```

### API Response Examples

#### GET /orion/v2/entities
Returns all room entities in the system:
```json
[
  {
    "id": "urn:ngsi-ld:Room:LivingRoom",
    "type": "Room",
    "name": { "value": "Living Room", "type": "Text" },
    "temperature": { "value": 21.5, "type": "Number" },
    "humidity": { "value": 45, "type": "Number" },
    "illuminance": { "value": 1000, "type": "Number" },
    "occupancy": { "value": true, "type": "Boolean" },
    "co2Level": { "value": 450, "type": "Number" },
    "noiseLevel": { "value": 35, "type": "Number" }
  },
  {
    "id": "urn:ngsi-ld:Room:Kitchen",
    "type": "Room",
    "name": { "value": "Kitchen", "type": "Text" },
    "temperature": { "value": 23.0, "type": "Number" },
    "humidity": { "value": 50, "type": "Number" },
    "illuminance": { "value": 800, "type": "Number" },
    "occupancy": { "value": false, "type": "Boolean" },
    "co2Level": { "value": 500, "type": "Number" },
    "noiseLevel": { "value": 45, "type": "Number" }
  }
]
```

## Troubleshooting

### Connection Issues

If you cannot access the dashboard, check:

1. **Docker containers are running**:
   ```bash
   docker-compose ps
   ```
   All containers should show as "Up".

2. **Nginx logs**:
   ```bash
   docker-compose logs nginx
   ```
   Check for any errors in the Nginx service.

3. **Orion logs**:
   ```bash
   docker-compose logs orion
   ```
   Ensure the Orion Context Broker is functioning properly.

### Data Not Showing

If the dashboard doesn't display data:

1. Check if the provisioning script was run successfully:
   ```bash
   node scripts/provision.js
   ```

2. Verify the data simulation is running:
   ```bash
   node scripts/simulate-data.js
   ```

3. Check browser console for any frontend errors.

## Restarting the System

To restart all services:

```bash
docker-compose down
docker-compose up -d
cd scripts
node provision.js
node simulate-data.js
```

## Docker Volumes

The application uses Docker volumes for data persistence:
- `mongodb_data`: Stores MongoDB data

## Docker Compose Configuration

The project's Docker Compose file defines the following services:

```json
{
  "services": {
    "mongodb": {
      "image": "mongo:4.4",
      "container_name": "mongodb",
      "ports": ["27017:27017"],
      "networks": ["fiware"],
      "volumes": ["mongodb_data:/data/db"]
    },
    "orion": {
      "image": "fiware/orion:3.0.0",
      "container_name": "orion",
      "depends_on": ["mongodb"],
      "networks": ["fiware"],
      "ports": ["1026:1026"],
      "command": "-dbhost mongodb -logLevel DEBUG"
    },
    "frontend": {
      "build": {
        "context": "./frontend",
        "dockerfile": "Dockerfile"
      },
      "container_name": "frontend",
      "networks": ["fiware"],
      "ports": ["3000:3000"],
      "volumes": [
        "./frontend:/app",
        "/app/node_modules"
      ],
      "environment": [
        "NODE_ENV=development",
        "PORT=3000",
        "REACT_APP_ORION_API=/orion"
      ],
      "command": "npm start"
    },
    "nginx": {
      "image": "nginx:alpine",
      "container_name": "nginx",
      "networks": ["fiware"],
      "ports": ["80:80"],
      "volumes": ["./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro"],
      "depends_on": ["frontend", "orion"]
    }
  },
  "networks": {
    "fiware": {
      "driver": "bridge"
    }
  },
  "volumes": {
    "mongodb_data": {}
  }
}
```

---

For any additional issues or questions, please open an issue in the repository.