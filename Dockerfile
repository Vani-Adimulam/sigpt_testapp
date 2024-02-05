# Use an official Node.js runtime as a parent image
FROM node:18.15

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install dependencies for the server
WORKDIR /app/Client
RUN npm install

WORKDIR /app
RUN npm install -g nodemon concurrently

# Build the client part of the application
WORKDIR /app/Node_Server
RUN npm install 

# Expose the ports your backend server and frontend assets listen on
EXPOSE 7001
EXPOSE 3000


# Set the environment variables for MongoDB URI and JWT_SECRET
ARG MONGODB_URI_DEV
ARG MONGODB_URI_PROD
ARG JWT_SECRET

# Set default values for the arguments if not provided during build
ARG NODE_ENV=dev
ENV NODE_ENV=$NODE_ENV

ENV MONGODB_URI_DEV=mongodb+srv://veera123:veera123@cluster0.d2xilje.mongodb.net/tes_client_one?retryWrites=true&w=majority
# ENV MONGODB_URI_PROD=$MONGODB_URI_PROD
ENV JWT_SECRET=!#zb6T,*O*:WY:4

# Change working directory back to /app/server
WORKDIR /app/Node_Server

# Command to run your application
CMD ["npm", "start"]



