
# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip curl && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy backend source code
COPY . /app

# Install Python dependencies (if any)
RUN if [ -f requirements.txt ]; then pip3 install -r requirements.txt; fi

# Expose port 8000
EXPOSE 8000

# Start the application (adjust if you use something other than main.py)
CMD ["python3", "app.py"]
