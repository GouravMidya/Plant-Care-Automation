FROM node:20.11-alpine3.18

WORKDIR /react-app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

# Build the React app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Serve the build directory
CMD [ "serve", "-s", "build", "-l", "3000" ]
