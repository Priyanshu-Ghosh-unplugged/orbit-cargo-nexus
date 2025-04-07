
# Docker Setup for VyomSetu Development

This document provides instructions for setting up and using Docker for VyomSetu development and testing.

## Prerequisites

- Docker Engine (version 20.10 or newer)
- Docker Compose (version 2.0 or newer)

## Development Environment

To start the development environment:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will start:
- Frontend development server on port 8080
- Backend API server on port 8000
- MongoDB server on port 27017

The development environment includes hot reloading for both frontend and backend code.

## Testing the Setup

We've included a test script to verify the setup:

```bash
chmod +x scripts/test-setup.sh
./scripts/test-setup.sh
```

This script will check if all services are running correctly and if the required ports are open.

## Stopping the Environment

To stop the development environment:

```bash
docker-compose -f docker-compose.dev.yml down
```

Add `-v` to remove volumes (database data):

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Production Build

For production, use the regular docker-compose.yml:

```bash
docker-compose up -d
```

## Troubleshooting

### Port Conflicts

If you have port conflicts, edit the docker-compose.dev.yml file and change the host ports.

### Container Access

To access a specific container shell:

```bash
# Frontend
docker exec -it vyomsetu_frontend-dev_1 /bin/sh

# Backend
docker exec -it vyomsetu_backend-dev_1 /bin/bash

# MongoDB
docker exec -it vyomsetu_mongodb-dev_1 /bin/bash
```

### Logs

To view container logs:

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

For a specific service:

```bash
docker-compose -f docker-compose.dev.yml logs -f backend-dev
```
