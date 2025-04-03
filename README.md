
# Orbit Cargo Nexus - ISS Payload Management System

## Project Overview
Orbit Cargo Nexus is an advanced web application designed for managing cargo and waste on the International Space Station (ISS). Built for the National Space Hackathon for ISRO, this application provides an interactive visualization of the ISS with real-time occupancy data, AI-powered placement recommendations, and comprehensive waste management capabilities.

## Key Features
- **Interactive ISS Cross-Section**: Visual representation of the ISS with module-specific occupancy data
- **AI-Powered Placement Recommendations**: Intelligent suggestions for optimal cargo placement
- **Waste Management System**: Track, categorize, and analyze waste for efficient disposal
- **Activity Logging**: Comprehensive logging of all cargo operations
- **Time Simulation**: Simulate the passage of time to predict future storage states
- **Import/Export Functionality**: Bulk data operations via CSV files

## Technology Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Recharts for data visualization
- Shadcn UI component library

### Backend
- Python Flask API
- MongoDB for database
- Scikit-learn for AI recommendations
- Pandas for data processing

### Deployment
- Docker containerization
- Docker Compose for multi-container orchestration

## API Endpoints

The application communicates with the following backend APIs:

1. **Placement Recommendations API**
   - `POST /api/placement`
   - Provides AI-generated recommendations for optimal cargo placement

2. **Item Search and Retrieval API**
   - `GET /api/search?itemId={id}&itemName={name}&userId={id}`
   - Searches for items by ID or name and logs retrievals

3. **Waste Management API**
   - `GET /api/waste/identify`
   - Identifies and categorizes waste materials

4. **Time Simulation API**
   - `POST /api/simulate/day`
   - Simulates passage of time to predict storage changes

5. **Import/Export API**
   - `POST /api/import/items`
   - Imports cargo data from CSV files

6. **Logging API**
   - `GET /api/logs?startDate={date}&endDate={date}&itemId={id}&userId={id}&actionType={type}`
   - Retrieves filtered activity logs

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- MongoDB 4.4+
- Docker and Docker Compose (optional for containerized deployment)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/orbit-cargo-nexus.git
   cd orbit-cargo-nexus
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. Start MongoDB (if running locally)
   ```
   mongod --dbpath /path/to/data/directory
   ```

5. Start the development servers

   Frontend:
   ```
   npm run dev
   ```

   Backend:
   ```
   cd backend
   python app.py
   ```

### Docker Deployment

To build and run the entire application stack with Docker:

```
docker-compose up --build
```

This will start the frontend, backend, and MongoDB services as defined in the docker-compose.yml file.

## Database Schema

### Cargo Collection
- `item_id`: Unique identifier
- `name`: Item name
- `type`: Category (food, medical, etc.)
- `weight_kg`: Weight in kilograms
- `dimensions_cm`: Dimensions (LxWxH)
- `priority`: high/medium/low
- `access_frequency`: high/medium/low
- `module`: ISS module name
- `section`: Section identifier
- `hazardous`: Boolean flag
- `expiry_date`: Optional expiration date

### Waste Collection
- `waste_id`: Unique identifier
- `type`: Waste category
- `weight_kg`: Weight
- `container_id`: Waste container ID
- `hazardous`: Boolean flag
- `disposal_date`: Target date for disposal

### Logs Collection
- `user_id`: User who performed the action
- `action_type`: placement/retrieval/rearrangement/disposal
- `item_id`: Affected item ID
- `item_name`: Item name
- `location`: Operation location
- `timestamp`: When the action occurred

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- This project was created for the National Space Hackathon for ISRO
- Inspired by real-world space station cargo management challenges
