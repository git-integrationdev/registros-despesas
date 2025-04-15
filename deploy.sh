#!/bin/bash

# Create deployment directory
mkdir -p deploy

# Copy necessary files
cp -r dist deploy/
cp Dockerfile deploy/
cp nginx.conf deploy/
cp package.json deploy/
cp package-lock.json deploy/

# Create a README with deployment instructions
cat > deploy/README.md << 'EOL'
# Deployment Instructions

1. Copy all files to your VPS
2. Make sure Docker is installed on your VPS
3. Run the following commands:

```bash
# Build the Docker image
docker build -t registros-despesas .

# Run the container
docker run -d -p 80:80 --name registros-despesas registros-despesas
```

The application will be available at http://your-vps-ip
EOL

# Create a zip file
zip -r registros-despesas-deploy.zip deploy/

# Clean up
rm -rf deploy

echo "Deployment package created: registros-despesas-deploy.zip" 