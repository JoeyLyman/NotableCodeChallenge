# Build off of existing NODE image on Docker Hub 
FROM node:16.11.1

# Create app directory inside Docker Image
WORKDIR /app

# Download dependencies independent of application for faster build
# note: A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /app/
RUN npm install

# Copy application
COPY . .

EXPOSE 3000
# Run application
CMD ["npm", "start"]
