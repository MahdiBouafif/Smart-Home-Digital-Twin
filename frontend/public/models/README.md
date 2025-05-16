# 3D Models Directory

This directory contains the 3D models used in the Smart Home Digital Twin application.

## Required Models

1. `house.glb` - The main house model
   - Format: glTF Binary (.glb)
   - Should include:
     - Rooms (Living Room, Kitchen, Master Bedroom)
     - Basic furniture
     - Lighting fixtures
     - IoT device locations

## Model Requirements

- Use glTF format (.glb or .gltf)
- Keep file sizes under 10MB for optimal performance
- Use proper UV mapping for textures
- Include proper lighting setup
- Follow real-world scale (1 unit = 1 meter)

## Getting Models

You can obtain 3D models from:
1. Create custom models using Blender or similar 3D modeling software
2. Download from 3D model marketplaces:
   - Sketchfab
   - CGTrader
   - TurboSquid
3. Use sample models from glTF Sample Models repository

## Adding New Models

1. Convert your model to glTF format
2. Optimize the model for web use
3. Place the .glb file in this directory
4. Update the model path in the application code 