FROM ubuntu:latest

# Install dependencies and Node.js
RUN apt update && apt install -y curl gnupg2 lsb-release \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt install -y nodejs \
  && apt clean && rm -rf /var/lib/apt/lists/*

# Copy MongoDB .deb file into the container
# Make sure the mongo*server*.deb file is in the build context directory
COPY mongo*server*.deb .

# Install MongoDB server from the .deb package
RUN apt install ./mongo*server*.deb -y \
  && rm mongo*server*.deb  # Clean up the .deb file to reduce image size

# Install yarn globally
RUN npm install -g yarn

# Set the working directory
WORKDIR /app

# Copy the application code into the container
COPY . .

# Install dependencies and build the project
RUN yarn install && yarn build

# Expose MongoDB and app ports
EXPOSE 27017  # MongoDB default port
EXPOSE 3000   # Application port
EXPOSE 3001   # Another app port (if required)

# Start MongoDB and the application
CMD mongod --bind_ip 0.0.0.0 --fork & yarn start

