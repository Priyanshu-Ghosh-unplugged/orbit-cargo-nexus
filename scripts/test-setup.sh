
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is open
check_port() {
  echo -n "Checking if port $1 is open... "
  nc -z localhost $1 > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}OK${NC}"
    return 0
  else
    echo -e "${RED}FAILED${NC}"
    return 1
  fi
}

# Function to check if a container is running
check_container() {
  echo -n "Checking if container $1 is running... "
  docker ps | grep $1 > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}OK${NC}"
    return 0
  else
    echo -e "${RED}FAILED${NC}"
    return 1
  fi
}

# Start containers
echo "Starting containers with docker-compose..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Check container status
check_container "frontend-dev"
check_container "backend-dev"
check_container "mongodb-dev"

# Check ports
check_port 8080
check_port 8000
check_port 27017

# Perform basic connectivity test
echo -n "Testing API connection... "
curl -s http://localhost:8000/api/search > /dev/null
if [ $? -eq 0 ]; then
  echo -e "${GREEN}OK${NC}"
else
  echo -e "${RED}FAILED${NC}"
fi

echo "Test complete. Use 'docker-compose -f docker-compose.dev.yml down' to stop services."
